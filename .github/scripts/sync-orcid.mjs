#!/usr/bin/env node
// Checks the site owner's ORCID record for works not yet in _data/publications.yml,
// fetches full metadata for each new one from Crossref, matches authors against
// _data/people.yml (current + alumni) to apply the site's <u>/<strong> author
// conventions, and inserts a new entry per publication -- as raw text splices,
// not a full YAML re-dump, so the file's header comments and formatting survive.
//
// Read-only against the repo until the final write step. Run via:
//   node .github/scripts/sync-orcid.mjs
// Exits 0 with no changes if nothing new is found; writes to
// _data/publications.yml and prints a summary (used by the workflow to decide
// whether to open a PR) if it finds anything.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const PUBLICATIONS_PATH = path.join(REPO_ROOT, "_data", "publications.yml");
const PEOPLE_PATH = path.join(REPO_ROOT, "_data", "people.yml");
const CONFIG_PATH = path.join(REPO_ROOT, "_config.yml");
const SUMMARY_PATH = path.join(REPO_ROOT, ".github", "scripts", "sync-orcid-summary.md");

const config = yaml.load(fs.readFileSync(CONFIG_PATH, "utf8"));
const ORCID_ID = config.orcid;
const CONTACT_EMAIL = config.email;
const USER_AGENT = `HusicSiteOrcidSync/1.0 (mailto:${CONTACT_EMAIL})`;

function normalizeDoi(raw) {
  if (!raw) return null;
  return String(raw)
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .toLowerCase();
}

function escapeYamlDouble(str) {
  return String(str).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// --- Load existing data -----------------------------------------------------

function loadExistingDois() {
  const raw = fs.readFileSync(PUBLICATIONS_PATH, "utf8");
  const entries = yaml.load(raw) || [];
  const known = new Set();
  for (const entry of entries) {
    const doi = normalizeDoi(entry.doi);
    if (doi) known.add(doi);
  }
  return { raw, entries, known };
}

// Every current + alumni name in _data/people.yml, indexed by last name
// (lowercased) so a Crossref author's family name can be matched against it.
// Ambiguous last names (shared by more than one person) are flagged rather
// than silently guessed.
function loadLabRoster() {
  const people = yaml.load(fs.readFileSync(PEOPLE_PATH, "utf8")) || {};
  const byLastName = new Map();
  const add = (fullName, role) => {
    const parts = fullName.trim().split(/\s+/);
    const last = parts[parts.length - 1].toLowerCase();
    if (!byLastName.has(last)) byLastName.set(last, []);
    byLastName.get(last).push({ fullName, role });
  };
  for (const p of people.current || []) add(p.name, p.role);
  for (const p of people.alumni || []) add(p.name, p.role);
  return byLastName;
}

// --- ORCID -------------------------------------------------------------------

async function fetchOrcidDois() {
  const url = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;
  const res = await fetch(url, { headers: { Accept: "application/json", "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`ORCID API returned ${res.status} ${res.statusText}`);
  const data = await res.json();
  const dois = new Set();
  for (const group of data.group || []) {
    const ids = group["external-ids"]?.["external-id"] || [];
    for (const id of ids) {
      if ((id["external-id-type"] || "").toLowerCase() === "doi") {
        const doi = normalizeDoi(id["external-id-value"]);
        if (doi) dois.add(doi);
      }
    }
  }
  return dois;
}

// --- Crossref ------------------------------------------------------------------

async function fetchCrossrefWork(doi) {
  const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`Crossref returned ${res.status} for ${doi}`);
  const data = await res.json();
  return data.message;
}

function formatAuthorName(author, labRoster, flags) {
  const family = author.family || "";
  const given = author.given || "";
  const initials = given
    .split(/[\s.-]+/)
    .filter(Boolean)
    .map((n) => n[0].toUpperCase() + ".")
    .join(" ");
  const plain = initials ? `${family}, ${initials}` : family;

  const isHusic = /^husic$/i.test(family);
  if (isHusic) return { text: `<strong>${plain}</strong>`, isHusic: true, isLab: false };

  const matches = labRoster.get(family.toLowerCase());
  if (matches && matches.length === 1) {
    return { text: `<u>${plain}</u>`, isHusic: false, isLab: true };
  }
  if (matches && matches.length > 1) {
    flags.push(
      `Author "${plain}" matches ${matches.length} people on the People page by last name alone ` +
        `(${matches.map((m) => m.fullName).join(", ")}) -- underlined as a guess, please verify.`
    );
    return { text: `<u>${plain}</u>`, isHusic: false, isLab: true };
  }
  return { text: plain, isHusic: false, isLab: false };
}

function joinAuthorList(parts) {
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return parts.slice(0, -1).join(", ") + ", and " + parts[parts.length - 1];
}

function buildCitation(message) {
  const volume = message.volume;
  const page = message.page || message["article-number"];
  if (volume && page) return `${volume}, ${page}`;
  if (volume) return String(volume);
  if (page) return String(page);
  return "";
}

function buildEntry(doi, message, labRoster, flags) {
  const authors = message.author || [];
  if (authors.length === 0) {
    flags.push(`${doi}: Crossref returned no author list -- filled in "Author list unavailable", please fix manually.`);
  }
  const formatted = authors.map((a) => formatAuthorName(a, labRoster, flags));
  const authorsHtml = authors.length ? joinAuthorList(formatted.map((f) => f.text)) : "Author list unavailable";
  const first = formatted[0];
  // Best-effort guess ONLY. `lead` records whether the work was led/directed from
  // this lab, which is a judgment about intellectual provenance -- Crossref does not
  // reliably expose corresponding author and never exposes who directed the work, so
  // this first-author heuristic gets it wrong in both directions (a former advisee
  // publishing from a later lab guesses "lab" but is "external"; an independent first
  // author on work Husic directed guesses "external" but is "lab"). Always flagged for
  // human review below -- see the `lead` notes in _data/publications.yml.
  const lead = first ? (first.isHusic || first.isLab ? "lab" : "external") : "external";
  flags.push(
    `${doi}: guessed \`lead: "${lead}"\` from the first author alone. Confirm by hand -- ` +
      `"lab" means the work was led or directed from this lab (e.g. Husic is corresponding ` +
      `author), NOT simply that the first author is an advisee. This drives the public ` +
      `Lab-Led count on the Publications page.`
  );

  const year =
    message.issued?.["date-parts"]?.[0]?.[0] ||
    message.published?.["date-parts"]?.[0]?.[0] ||
    new Date().getFullYear();

  return {
    year,
    status: "published",
    lead,
    authors: authorsHtml,
    title: (message.title || [])[0] || "(title unavailable)",
    journal: (message["container-title"] || [])[0] || null,
    citation: buildCitation(message),
    doi: `https://doi.org/${doi}`,
  };
}

function entryToYamlBlock(entry) {
  const lines = [
    `- year: ${entry.year}`,
    `  status: "published"`,
    `  lead: "${entry.lead}"`,
    `  authors: "${escapeYamlDouble(entry.authors)}"`,
    `  title: "${escapeYamlDouble(entry.title)}"`,
    `  journal: ${entry.journal ? `"${escapeYamlDouble(entry.journal)}"` : "null"}`,
    `  citation: "${escapeYamlDouble(entry.citation)}"`,
    `  doi: "${entry.doi}"`,
    "",
  ];
  return lines.join("\n");
}

// Insert into the raw file text before the first existing entry whose year is
// <= the new entry's year (keeping reverse-chronological order among published
// entries); append at the end if the new entry is older than everything on file.
function insertEntry(raw, entries, newEntry) {
  const lines = raw.split("\n");
  const entryStartLines = [];
  lines.forEach((line, i) => {
    if (/^- year:\s*\d+/.test(line)) entryStartLines.push(i);
  });

  if (entryStartLines.length !== entries.length) {
    throw new Error(
      `Entry count mismatch: found ${entryStartLines.length} "- year:" lines but parsed ${entries.length} entries -- refusing to guess an insertion point.`
    );
  }

  let insertAt = lines.length;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (e.status === "published" && Number(e.year) <= Number(newEntry.year)) {
      insertAt = entryStartLines[i];
      break;
    }
  }

  const blockLines = entryToYamlBlock(newEntry).split("\n");
  // Drop the trailing empty string from the split so we don't double a blank line.
  blockLines.pop();
  lines.splice(insertAt, 0, ...blockLines, "");
  return lines.join("\n");
}

// --- Main ----------------------------------------------------------------------

async function main() {
  if (!ORCID_ID) throw new Error("_config.yml has no `orcid` key -- can't look up the ORCID record.");

  const { raw, entries, known } = loadExistingDois();
  const labRoster = loadLabRoster();

  console.log(`Checking ORCID ${ORCID_ID} for works not yet in _data/publications.yml...`);
  const orcidDois = await fetchOrcidDois();
  const newDois = [...orcidDois].filter((doi) => !known.has(doi));

  if (newDois.length === 0) {
    console.log("No new works found. Nothing to do.");
    fs.writeFileSync(SUMMARY_PATH, "No new works found on ORCID beyond what's already in `_data/publications.yml`.\n");
    return;
  }

  console.log(`Found ${newDois.length} DOI(s) on ORCID not yet on the site:`, newDois);

  let currentRaw = raw;
  let currentEntries = entries;
  const added = [];
  const allFlags = [];

  const skippedNonArticle = [];

  for (const doi of newDois) {
    try {
      const message = await fetchCrossrefWork(doi);

      // Preprints (Crossref type "posted-content", e.g. EGUsphere) are the
      // common case: ORCID often indexes both a preprint DOI and, once it
      // clears review, a separate DOI for the actual journal article. Adding
      // the preprint would either duplicate an already-tracked publication or
      // publish something not actually peer-reviewed yet -- skip anything
      // that isn't a real journal article rather than guessing.
      if (message.type !== "journal-article") {
        console.log(`Skipping ${doi}: Crossref type is "${message.type}", not a journal article.`);
        skippedNonArticle.push(`- **${doi}** (${message.type}): "${(message.title || [])[0] || "untitled"}" -- ` +
          `likely a preprint of a publication already on the site, or not peer-reviewed yet. Not added.`);
        continue;
      }

      const flags = [];
      const entry = buildEntry(doi, message, labRoster, flags);
      currentRaw = insertEntry(currentRaw, currentEntries, entry);
      currentEntries = yaml.load(currentRaw); // re-parse so the next insertion's indices stay correct
      added.push(entry);
      allFlags.push(...flags.map((f) => `- **${doi}**: ${f}`));
    } catch (err) {
      console.warn(`Skipping ${doi}: ${err.message}`);
      allFlags.push(`- **${doi}**: skipped -- ${err.message}`);
    }
  }

  if (added.length === 0) {
    const lines = ["No new journal articles to add."];
    if (skippedNonArticle.length) {
      lines.push("", "Found on ORCID but skipped (not a journal article -- likely a preprint of something already tracked):", ...skippedNonArticle);
    }
    if (allFlags.length) {
      lines.push("", "Errors while resolving candidate DOIs:", ...allFlags);
    }
    console.log(lines.join("\n"));
    fs.writeFileSync(SUMMARY_PATH, lines.join("\n") + "\n");
    return; // nothing written to publications.yml, so the workflow's diff check stays clean and opens no PR
  }

  fs.writeFileSync(PUBLICATIONS_PATH, currentRaw, "utf8");

  const summaryLines = [
    `Added ${added.length} publication(s) found on ORCID but not yet on the site:`,
    "",
    ...added.map((e) => `- **${e.title}** (${e.journal || "journal unknown"}, ${e.year}) -- lead: \`${e.lead}\`, ${e.doi}`),
  ];
  if (allFlags.length) {
    summaryLines.push("", "**Please double-check before merging:**", ...allFlags);
  }
  if (skippedNonArticle.length) {
    summaryLines.push("", "Also found on ORCID but skipped (not a journal article -- likely a preprint of something already tracked):", ...skippedNonArticle);
  }
  summaryLines.push(
    "",
    "This PR was opened automatically from ORCID data. Author-list formatting, lead/lab " +
      "classification, and citation formatting are best-effort from Crossref metadata -- " +
      "review against the actual paper before merging."
  );
  fs.writeFileSync(SUMMARY_PATH, summaryLines.join("\n") + "\n");
  console.log(`Wrote ${added.length} new entr${added.length === 1 ? "y" : "ies"} to _data/publications.yml.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
