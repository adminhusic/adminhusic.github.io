#!/usr/bin/env node
// Keeps _data/publications.yml in step with the site owner's ORCID record. Two
// passes run on every invocation:
//
//   1. ADD  -- works on ORCID with no matching DOI in the file yet. Full metadata
//      comes from Crossref; authors are matched against _data/people.yml (current
//      + alumni) to apply the site's <u>/<strong> conventions.
//
//   2. REFRESH -- entries already in the file whose citation is still "In Press".
//      A paper is listed that way once it is accepted and has a DOI but has not
//      been paginated yet; weeks or months later the publisher assigns a volume,
//      issue, and page/article number. This pass re-checks each one against
//      Crossref and fills the real citation in once it exists. Nothing else about
//      the entry is rewritten -- a changed year is reported for a human to decide
//      on rather than applied, because `year` also drives the file's ordering.
//
// Both passes edit the file as raw text splices, not a full YAML re-dump, so its
// header comments and hand-tuned formatting survive.
//
// Read-only against the repo until the final write step. Run via:
//   node .github/scripts/sync-orcid.mjs
// Exits 0 with no changes if nothing is new and nothing has been paginated;
// otherwise writes _data/publications.yml and a summary + PR title that the
// workflow uses to open a pull request.

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
const TITLE_PATH = path.join(REPO_ROOT, ".github", "scripts", "sync-orcid-title.txt");

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

// Everything interpolated into a double-quoted YAML scalar goes through this --
// including the DOI, which is not as inert as it looks (a stray quote or backslash
// in Crossref's copy would otherwise produce a file that no longer parses).
// C0 control characters are dropped rather than escaped: they carry no meaning in a
// title, and js-yaml refuses to load a double-quoted scalar containing a raw one, so
// letting one through would write a publications.yml that breaks the site build.
// Accented names and en-dashes are untouched -- only C0 is stripped.
function escapeYamlDouble(str) {
  return String(str)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
}

// Crossref returns titles and journal names with HTML entities left in ("Communications
// Earth &amp; Environment"). Everything hand-entered in publications.yml uses the literal
// character, and Liquid renders these fields as-is, so decode the handful of entities
// Crossref actually emits rather than writing "&amp;" into the data file.
function decodeEntities(str) {
  if (str == null) return str;
  return String(str)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&"); // last, so "&amp;lt;" decodes to "&lt;" and not "<"
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

// Crossref writes page ranges with a plain hyphen ("3647-3673"); the file's newer
// entries use a true en-dash ("3647–3673"). Only a hyphen sitting between two digits
// is a range -- article numbers like "e2025WR043141" must come through untouched.
function normalizePageRange(page) {
  return String(page).replace(/(\d)\s*-\s*(\d)/g, "$1–$2");
}

// House style, read off the entries already in _data/publications.yml:
//   volume + issue + page -> "40(5), e70572"
//   volume + page         -> "30, 3647–3673"
//   volume alone          -> "78(36)" / "30"
//   issue but no volume   -> "(170), 115348"
// Returns "" when Crossref has no locator at all, which is what "In Press" means:
// accepted and online, but not yet paginated.
function buildCitation(message) {
  const volume = message.volume ? String(message.volume).trim() : "";
  const issue = message.issue ? String(message.issue).trim() : "";
  const rawPage = message.page || message["article-number"];
  const page = rawPage ? normalizePageRange(String(rawPage).trim()) : "";

  let locator = "";
  if (volume && issue) locator = `${volume}(${issue})`;
  else if (volume) locator = volume;
  else if (issue) locator = `(${issue})`;

  if (locator && page) return `${locator}, ${page}`;
  if (locator) return locator;
  return page;
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

  const year = crossrefYear(message) || new Date().getFullYear();

  // No locator from Crossref means the work is accepted and online but not paginated
  // yet -- exactly what "In Press" records. Write that sentinel rather than an empty
  // string, or pass 2 (which matches on IN_PRESS_RE) could never find the entry again
  // and it would sit uncited forever. This mapping belongs HERE and not inside
  // buildCitation: pass 2 relies on buildCitation returning a falsy value to tell
  // "still unpaginated" from "just paginated".
  const citation = buildCitation(message);
  if (!citation) {
    flags.push(
      `${doi}: Crossref has no volume/issue/pages yet, so this went in as \`citation: "In Press"\`. ` +
        `A later run will fill in the real citation automatically once the publisher assigns one.`
    );
  }

  return {
    year,
    status: "published",
    lead,
    authors: authorsHtml,
    title: decodeEntities((message.title || [])[0]) || "(title unavailable)",
    journal: decodeEntities((message["container-title"] || [])[0]) || null,
    citation: citation || "In Press",
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
    `  doi: "${escapeYamlDouble(entry.doi)}"`,
    "",
  ];
  return lines.join("\n");
}

// Insert into the raw file text before the first existing entry whose year is
// <= the new entry's year (keeping reverse-chronological order among published
// entries); append at the end if the new entry is older than everything on file.
function insertEntry(raw, entries, newEntry) {
  const { lines, ranges } = entryLineRanges(raw, entries);
  const entryStartLines = ranges.map((r) => r.start);

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

// Map each parsed entry onto the raw file's line ranges. Shared by every in-place
// edit below so they all fail the same way -- loudly -- if the file's shape ever
// stops matching what the YAML parser sees.
function entryLineRanges(raw, entries) {
  const lines = raw.split("\n");
  const starts = [];
  lines.forEach((line, i) => {
    if (/^- year:\s*\d+/.test(line)) starts.push(i);
  });
  if (starts.length !== entries.length) {
    throw new Error(
      `Entry count mismatch: found ${starts.length} "- year:" lines but parsed ${entries.length} entries -- refusing to edit by line number.`
    );
  }
  const ranges = starts.map((start, i) => ({
    start,
    end: i + 1 < starts.length ? starts[i + 1] : lines.length,
  }));
  return { lines, ranges };
}

// Replace just the `citation:` line of the entry carrying `targetDoi`, leaving every
// other byte of the file alone. Scoped to that entry's own line range so the schema
// notes in the header comment (which also contain the word "citation:") can't match.
function updateCitationInRaw(raw, entries, targetDoi, newCitation) {
  const { lines, ranges } = entryLineRanges(raw, entries);
  const idx = entries.findIndex((e) => normalizeDoi(e.doi) === targetDoi);
  if (idx === -1) throw new Error(`No entry in publications.yml has DOI ${targetDoi}.`);

  const { start, end } = ranges[idx];
  let citationLine = -1;
  for (let i = start; i < end; i++) {
    if (/^  citation:/.test(lines[i])) {
      citationLine = i;
      break;
    }
  }
  if (citationLine === -1) throw new Error(`Entry for ${targetDoi} has no \`citation:\` line to update.`);

  lines[citationLine] = `  citation: "${escapeYamlDouble(newCitation)}"`;
  return lines.join("\n");
}

function crossrefYear(message) {
  return (
    message.issued?.["date-parts"]?.[0]?.[0] || message.published?.["date-parts"]?.[0]?.[0] || null
  );
}

// --- Pass 1: add works on ORCID that aren't tracked yet --------------------------

async function addNewWorks(state, known, labRoster) {
  console.log(`Checking ORCID ${ORCID_ID} for works not yet in _data/publications.yml...`);
  const orcidDois = await fetchOrcidDois();
  const newDois = [...orcidDois].filter((doi) => !known.has(doi));

  const added = [];
  const flags = [];
  const skippedNonArticle = [];

  if (newDois.length === 0) {
    console.log("No works on ORCID that aren't already on the site.");
    return { added, flags, skippedNonArticle };
  }

  console.log(`Found ${newDois.length} DOI(s) on ORCID not yet on the site:`, newDois);

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
        skippedNonArticle.push(
          `- **${doi}** (${message.type}): "${decodeEntities((message.title || [])[0]) || "untitled"}" -- ` +
            `likely a preprint of a publication already on the site, or not peer-reviewed yet. Not added.`
        );
        continue;
      }

      const entryFlags = [];
      const entry = buildEntry(doi, message, labRoster, entryFlags);
      // Build and validate a candidate before committing it to `state`. If the splice
      // produces something YAML can't read, the throw lands in the catch below with
      // `state` untouched -- this DOI is skipped and flagged, and the rest of the run
      // (including the In Press refresh) still works. Assigning first and re-parsing
      // second would leave a broken file in `state.raw` that main() would still write.
      const candidate = insertEntry(state.raw, state.entries, entry);
      const reparsed = yaml.load(candidate);
      state.raw = candidate;
      state.entries = reparsed; // keeps the next edit's line indices valid
      added.push(entry);
      flags.push(...entryFlags.map((f) => `- **${doi}**: ${f}`));
    } catch (err) {
      console.warn(`Skipping ${doi}: ${err.message}`);
      flags.push(`- **${doi}**: skipped -- ${err.message}`);
    }
  }

  return { added, flags, skippedNonArticle };
}

// --- Pass 2: fill in citations for entries still marked "In Press" ---------------

const IN_PRESS_RE = /^in\s+press$/i;

async function refreshInPressCitations(state, skipDois = new Set()) {
  // Snapshot the targets up front: state.entries is replaced after every edit, and
  // each entry is re-found by DOI anyway, so the list must not be re-derived mid-loop.
  // A blank citation counts as a target too. Nothing writes one any more, but an entry
  // orphaned by an older run (or a hand-edit that clears the field) would otherwise
  // never be picked up again, which is the exact failure this pass exists to prevent.
  const targets = state.entries
    .filter((e) => {
      const c = String(e.citation ?? "").trim();
      return c === "" || IN_PRESS_RE.test(c);
    })
    .map((e) => ({ title: e.title, year: e.year, journal: e.journal, doi: normalizeDoi(e.doi) }))
    // Anything pass 1 just added already carries fresh Crossref data; re-fetching it
    // would only report a paper as "will be re-checked next run" moments after adding it.
    .filter((t) => !t.doi || !skipDois.has(t.doi));

  const updated = [];
  const stillInPress = [];
  const flags = [];

  if (targets.length === 0) {
    console.log("No entries are awaiting a citation.");
    return { updated, stillInPress, flags };
  }

  console.log(`Re-checking ${targets.length} "In Press" entr${targets.length === 1 ? "y" : "ies"} for volume/issue/page numbers...`);

  for (const t of targets) {
    if (!t.doi) {
      console.warn(`Cannot check "${t.title}": no DOI on file.`);
      flags.push(
        `- **${t.title}**: still "In Press" but has no DOI on file, so there is nothing to look up. ` +
          `Add its DOI to \`_data/publications.yml\` to let this run check it automatically.`
      );
      continue;
    }

    try {
      const message = await fetchCrossrefWork(t.doi);
      const citation = buildCitation(message);

      if (!citation) {
        console.log(`Still unpaginated: ${t.title}`);
        stillInPress.push(t);
        continue;
      }

      // Same validate-before-commit discipline as pass 1: a candidate that won't parse
      // must not survive into `state`, or main() would write an unreadable file.
      const candidate = updateCitationInRaw(state.raw, state.entries, t.doi, citation);
      const reparsed = yaml.load(candidate);
      state.raw = candidate;
      state.entries = reparsed;
      updated.push({ ...t, citation });
      console.log(`Paginated: ${t.title} -> ${citation}`);

      // `year` is left alone deliberately. It drives the file's reverse-chronological
      // ordering as well as the displayed year, so changing it means moving the entry
      // -- a judgment call for the reviewer, not something to do silently in a bot PR.
      const year = crossrefYear(message);
      if (year && Number(year) !== Number(t.year)) {
        flags.push(
          `- **${t.title}**: Crossref now dates this ${year}, but the entry says \`year: ${t.year}\`. ` +
            `The citation was updated; the year was **not**, because it also controls where the entry ` +
            `sits in the file. Change it by hand (and move the entry) if ${year} is right.`
        );
      }

      const journal = decodeEntities((message["container-title"] || [])[0]);
      if (journal && t.journal && journal !== t.journal) {
        flags.push(
          `- **${t.title}**: Crossref lists the journal as "${journal}", the entry says "${t.journal}". ` +
            `Left as-is -- check which is right.`
        );
      }
    } catch (err) {
      console.warn(`Could not re-check ${t.doi}: ${err.message}`);
      flags.push(`- **${t.title}** (${t.doi}): could not be re-checked -- ${err.message}`);
    }
  }

  return { updated, stillInPress, flags };
}

// --- Main ----------------------------------------------------------------------

async function main() {
  if (!ORCID_ID) throw new Error("_config.yml has no `orcid` key -- can't look up the ORCID record.");

  const { raw, entries, known } = loadExistingDois();
  const labRoster = loadLabRoster();

  // Both passes edit this in place; `raw` stays as the original for the final diff check.
  const state = { raw, entries };

  const add = await addNewWorks(state, known, labRoster);
  const justAdded = new Set(add.added.map((e) => normalizeDoi(e.doi)));
  const refresh = await refreshInPressCitations(state, justAdded);

  const changed = state.raw !== raw;
  if (changed) {
    // Last line of defence before a bot-authored file reaches the owner's public
    // publication list: prove it still parses and still holds every entry it started
    // with. Throwing here fails the workflow loudly instead of opening a PR that
    // would break the site build on merge.
    const check = yaml.load(state.raw);
    if (!Array.isArray(check) || check.length < entries.length) {
      throw new Error(
        `Refusing to write _data/publications.yml: it would go from ${entries.length} entries to ` +
          `${Array.isArray(check) ? check.length : "un-parseable"}.`
      );
    }
    fs.writeFileSync(PUBLICATIONS_PATH, state.raw, "utf8");
  }

  // --- Summary + PR title -------------------------------------------------------

  const summary = [];

  if (add.added.length) {
    summary.push(
      `**Added ${add.added.length} publication(s)** found on ORCID but not yet on the site:`,
      "",
      ...add.added.map(
        (e) => `- **${e.title}** (${e.journal || "journal unknown"}, ${e.year}) -- lead: \`${e.lead}\`, ${e.doi}`
      ),
      ""
    );
  }

  if (refresh.updated.length) {
    summary.push(
      `**Filled in ${refresh.updated.length} citation(s)** for entries that were "In Press" and have now been paginated:`,
      "",
      ...refresh.updated.map((u) => `- **${u.title}** -- \`In Press\` → \`${u.citation}\``),
      ""
    );
  }

  if (!add.added.length && !refresh.updated.length) {
    summary.push(
      "Nothing to change: no untracked works on ORCID, and no \"In Press\" entry has been paginated yet.",
      ""
    );
  }

  const allFlags = [...add.flags, ...refresh.flags];
  if (allFlags.length) {
    summary.push("**Please double-check before merging:**", "", ...allFlags, "");
  }

  if (refresh.stillInPress.length) {
    summary.push(
      "Still \"In Press\" (Crossref has no volume/issue/pages yet) -- will be re-checked next run:",
      "",
      ...refresh.stillInPress.map((t) => `- ${t.title}`),
      ""
    );
  }

  if (add.skippedNonArticle.length) {
    summary.push(
      "Found on ORCID but skipped (not a journal article -- likely a preprint of something already tracked):",
      "",
      ...add.skippedNonArticle,
      ""
    );
  }

  if (changed) {
    summary.push(
      "This PR was opened automatically from ORCID and Crossref data. Author-list formatting, " +
        "lead/lab classification, and citation formatting are all best-effort from that metadata -- " +
        "review against the actual paper before merging."
    );
  }

  fs.writeFileSync(SUMMARY_PATH, summary.join("\n").trimEnd() + "\n");

  let title = "Publication updates from ORCID";
  if (add.added.length && refresh.updated.length) title = "New publication(s) and citation update(s) from ORCID";
  else if (add.added.length) title = "New publication(s) found on ORCID";
  else if (refresh.updated.length) title = "Citation update(s) for In Press publication(s)";
  fs.writeFileSync(TITLE_PATH, title + "\n");

  console.log(
    changed
      ? `Wrote _data/publications.yml: ${add.added.length} added, ${refresh.updated.length} citation(s) filled in.`
      : "No changes to _data/publications.yml."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
