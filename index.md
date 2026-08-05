---
layout: default
hide_title: true
description: >-
  Admin Husic is an Associate Professor of Civil and Environmental Engineering
  at Virginia Tech, studying hydrologic connectivity and the transport of
  water, sediment, and nutrients across human-altered landscapes.
image: /assets/img/husic-headshot.jpg
---

<div class="hero">
  <div class="hero__photo">
    <img src="{{ '/assets/img/husic-headshot.jpg' | relative_url }}" alt="Portrait of Admin Husic" width="200" height="200">
  </div>
  <div>
    <h1 class="hero__name">Admin Husic</h1>
    <p class="hero__title">Associate Professor &middot; Occoquan Watershed Monitoring Laboratory &middot; Charles E. Via, Jr. Department of Civil & Environmental Engineering &middot; Virginia Tech</p>
    <div class="hero__links">
      <a class="icon-link" href="{{ site.vt_profile }}" target="_blank" rel="noopener" aria-label="Virginia Tech Faculty Profile" title="Virginia Tech Faculty Profile">
        <img src="{{ '/assets/img/Virginia-Tech-Logo.png' | relative_url }}" alt="Virginia Tech" height="18">
      </a>
      <a class="icon-link" href="https://orcid.org/{{ site.orcid }}" target="_blank" rel="noopener" aria-label="ORCID: {{ site.orcid }}" title="ORCID: {{ site.orcid }}">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#A6CE39"/><text x="12" y="16.3" font-family="Arial, Helvetica, sans-serif" font-size="10.5" font-weight="700" font-style="italic" text-anchor="middle" fill="#ffffff">iD</text></svg>
      </a>
      <a class="icon-link" href="{{ site.linkedin }}" target="_blank" rel="noopener" aria-label="LinkedIn profile" title="LinkedIn">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect width="24" height="24" rx="4" fill="#0A66C2"/><text x="12" y="17" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" text-anchor="middle" fill="#ffffff">in</text></svg>
      </a>
      <a class="icon-link" href="mailto:{{ site.email }}" aria-label="Email: {{ site.email }}" title="Email: {{ site.email }}">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
      </a>
      <a class="icon-link" href="{{ '/assets/cv/Husic-CV.pdf' | relative_url }}" aria-label="Download CV" title="Download CV">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 16.5h6M9 9.5h2"/></svg>
      </a>
    </div>
  </div>
</div>

{% assign published_pubs = site.data.publications | where: "status", "published" %}
{% assign current_grad = site.data.people.current | where_exp: "p", "p.role != 'Undergraduate Student'" %}
{% assign alumni_grad = site.data.people.alumni | where_exp: "p", "p.role != 'Undergraduate Student'" %}
{% assign grad_postdoc_count = current_grad.size | plus: alumni_grad.size %}

<div class="home-highlight">
  <div class="home-highlight__mission">
    <blockquote class="pull-quote">
      &ldquo;How is human activity and a changing climate reshaping the way water, sediment, and
      nutrients move across Earth's surface?&rdquo;
    </blockquote>
  </div>
  <div class="stat-grid home-highlight__stats">
    <div class="stat"><span class="num">{{ published_pubs.size }}</span><span class="label">Peer-reviewed Publications</span></div>
    <div class="stat"><span class="num">$11M+</span><span class="label">Research Funding</span></div>
    <div class="stat"><span class="num">{{ grad_postdoc_count }}</span><span class="label">Graduate Students &amp; Postdocs Mentored</span></div>
    <div class="stat"><span class="num">2024</span><span class="label">NSF CAREER Awardee</span></div>
  </div>
</div>

<div class="section">
  <h2 class="section-title">Featured Research</h2>
  <ul class="triptych">
    <li class="feature-panel">
      <div class="feature-panel__art">
        <svg viewBox="0 0 160 120" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 45c15-8 25 8 40 0s25-8 40 0 25 8 40 0 15-8 20-4"/>
          <path d="M10 65c15-8 25 8 40 0s25-8 40 0 25 8 40 0 15-8 20-4"/>
          <path d="M10 85c15-8 25 8 40 0s25-8 40 0 25 8 40 0 15-8 20-4"/>
          <circle cx="45" cy="55" r="2.2" fill="currentColor" stroke="none" opacity="0.6"/>
          <circle cx="95" cy="75" r="2.6" fill="currentColor" stroke="none" opacity="0.6"/>
          <circle cx="122" cy="55" r="2" fill="currentColor" stroke="none" opacity="0.6"/>
          <circle cx="65" cy="90" r="1.8" fill="currentColor" stroke="none" opacity="0.6"/>
          <circle cx="18" cy="70" r="1.8" fill="currentColor" stroke="none" opacity="0.6"/>
        </svg>
      </div>
      <div class="feature-panel__body">
        <span class="feature-panel__journal">Comms Earth &amp; Environment</span>
        <h3 class="feature-panel__title">U.S. rivers are transporting more suspended sediment, often in less time</h3>
        <div class="feature-panel__footer">
          <p class="feature-panel__author">
            <span class="feature-panel__author-name">Nishchal Sigdel</span>
            <span class="feature-panel__author-role">Master's Student</span>
          </p>
          <a class="doi-link" href="https://doi.org/10.1038/s43247-026-03847-8" target="_blank" rel="noopener">DOI</a>
        </div>
      </div>
    </li>
    <li class="feature-panel">
      <div class="feature-panel__art">
        <svg viewBox="0 0 160 120" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M45 42a16 16 0 0 1 30-7 20 20 0 0 1 38 9 14 14 0 0 1-4 27H50a16 16 0 0 1-5-29Z"/>
          <path d="M55 76v10M75 76v14M95 76v10M65 91v8M85 93v8" opacity="0.6"/>
          <path d="M10 108c15-6 25 6 40 0s25-6 40 0 25 6 40 0 15-6 20-2"/>
        </svg>
      </div>
      <div class="feature-panel__body">
        <span class="feature-panel__journal">Comms Earth &amp; Environment</span>
        <h3 class="feature-panel__title">Streamflow composition in U.S. rivers is shifting toward recent precipitation</h3>
        <div class="feature-panel__footer">
          <p class="feature-panel__author">
            <span class="feature-panel__author-name">Chuqiang Chen</span>
            <span class="feature-panel__author-role">Doctoral Student</span>
          </p>
          <a class="doi-link" href="https://doi.org/10.1038/s43247-026-03788-2" target="_blank" rel="noopener">DOI</a>
        </div>
      </div>
    </li>
    <li class="feature-panel">
      <div class="feature-panel__art">
        <svg viewBox="0 0 160 120" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="18" y="58" width="30" height="27"/>
          <rect x="65" y="42" width="30" height="43"/>
          <rect x="112" y="63" width="30" height="22"/>
          <path d="M8 96c15-6 25 6 40 0s25-6 40 0 25 6 40 0 15-6 24-2"/>
          <path d="M8 107c15-6 25 6 40 0s25-6 40 0 25 6 40 0 15-6 24-2" opacity="0.5"/>
        </svg>
      </div>
      <div class="feature-panel__body">
        <span class="feature-panel__journal">Nature Communications</span>
        <h3 class="feature-panel__title">Disproportionate exposure to extreme floods in historically redlined U.S. communities</h3>
        <div class="feature-panel__footer">
          <p class="feature-panel__author">
            <span class="feature-panel__author-name">Elizabeth Appel</span>
            <span class="feature-panel__author-role">Undergraduate Student</span>
          </p>
          <a class="doi-link" href="https://doi.org/10.1038/s41467-026-76024-2" target="_blank" rel="noopener">DOI</a>
        </div>
      </div>
    </li>
  </ul>
</div>

<div class="divider"><span class="divider__mark"></span></div>

<div class="section">
  <h2 class="section-title">Contents</h2>
  <ul class="contents-list">
    <li class="contents-item">
      <a class="contents-link" href="{{ '/people/' | relative_url }}">
        <span class="contents-title">People</span>
        <span class="contents-desc">Meet the current group and alumni of the lab.</span>
        <svg class="icon icon--sm contents-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
      </a>
    </li>
    <li class="contents-item">
      <a class="contents-link" href="{{ '/research/' | relative_url }}">
        <span class="contents-title">Research</span>
        <span class="contents-desc">Machine learning for water resources, sediment &amp; nutrient transport, and hydrologic connectivity.</span>
        <svg class="icon icon--sm contents-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
      </a>
    </li>
    <li class="contents-item">
      <a class="contents-link" href="{{ '/publications/' | relative_url }}">
        <span class="contents-title">Publications</span>
        <span class="contents-desc">Peer-reviewed journal articles, with a DOI for every entry.</span>
        <svg class="icon icon--sm contents-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
      </a>
    </li>
    <li class="contents-item">
      <a class="contents-link" href="{{ '/teaching/' | relative_url }}">
        <span class="contents-title">Teaching</span>
        <span class="contents-desc">Courses in fluid mechanics, open channel flow, sediment transport, and machine learning.</span>
        <svg class="icon icon--sm contents-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
      </a>
    </li>
    <li class="contents-item">
      <a class="contents-link" href="{{ '/join-us/' | relative_url }}">
        <span class="contents-title">Join Us</span>
        <span class="contents-desc">Openings for prospective doctoral students and postdocs.</span>
        <svg class="icon icon--sm contents-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
      </a>
    </li>
  </ul>
</div>
