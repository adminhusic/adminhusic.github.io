---
layout: default
hide_title: true
description: >-
  Admin Husic is an Associate Professor of Civil and Environmental Engineering
  at Virginia Tech, studying hydrologic connectivity and the transport of
  water, sediment, and nutrients across human-altered landscapes.
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
{% assign current_grad = site.data.people.current | where_exp: "p", "p.role != 'Undergraduate Researcher'" %}
{% assign alumni_grad = site.data.people.alumni | where_exp: "p", "p.role != 'Undergraduate Researcher'" %}
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
  <h2 class="section-title">Contents</h2>
  <ul class="contents-list">
    <li class="contents-item">
      <a class="contents-link" href="{{ '/research/' | relative_url }}">
        <span class="contents-title">Research</span>
        <span class="contents-desc">Machine learning for water resources, sediment &amp; nutrient transport, and hydrologic connectivity.</span>
        <svg class="icon icon--sm contents-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
      </a>
    </li>
    <li class="contents-item">
      <a class="contents-link" href="{{ '/people/' | relative_url }}">
        <span class="contents-title">People</span>
        <span class="contents-desc">Meet the current group and alumni of the lab.</span>
        <svg class="icon icon--sm contents-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
      </a>
    </li>
    <li class="contents-item">
      <a class="contents-link" href="{{ '/publications/' | relative_url }}">
        <span class="contents-title">Publications</span>
        <span class="contents-desc">Peer-reviewed journal articles, with DOIs and PDFs.</span>
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
        <span class="contents-desc">Openings for prospective PhD students, master's students, and postdocs.</span>
        <svg class="icon icon--sm contents-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>
      </a>
    </li>
  </ul>
</div>
