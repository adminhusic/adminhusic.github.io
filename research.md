---
layout: default
title: Research
subtitle: How human activity and a changing climate reshape the transport and connectivity of water, sediment, and nutrients across Earth's surface.
description: "Admin Husic's research at Virginia Tech on hydrology, sediment transport, and machine learning for water resources — how human activity and climate change reshape water, sediment, and nutrient connectivity."
image: /assets/img/husic-headshot.jpg
---

<strong>Dynamic connectivity</strong> is how water, sediment, and nutrients move across a
landscape via linkages that shift over time &mdash; and the role people play in modulating those
connections. It is at this intersection of hydrology, water quality, and data science that my group operates. We combine
deep learning, environmental sensors, geochemical tracers, and numerical models to understand 
how watersheds function &mdash; and how that function is being reshaped by urbanization, 
deforestation, agriculturalization, and climate change, from individual catchments to the continental scale.

<div class="divider"><span class="divider__mark"></span></div>

<div class="section">
  <h2 class="section-title">Research Areas</h2>
  <p class="page-hint">Select an area to read more and see selected work from the group.</p>

  <div class="areas">
    <ul class="areas__rail">
      {% for a in site.data.research_areas.areas %}
      <li>
        <button type="button" class="area-tab" data-area="{{ a.id }}" aria-expanded="false" aria-controls="panel-{{ a.id }}">
          {% case a.id %}
          {% when "machine-learning" %}
          <svg class="icon icon--md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="6" cy="7" r="2"/>
            <circle cx="18" cy="7" r="2"/>
            <circle cx="12" cy="18" r="2"/>
            <path d="M7.7 8.4 10.4 16M16.3 8.4 13.6 16M8 7h8"/>
          </svg>
          {% when "sensing" %}
          <svg class="icon icon--md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 13h2.5l1.5-5 2.5 10 2-7 1.5 3.5H20"/>
          </svg>
          {% when "sediment" %}
          <svg class="icon icon--md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 8h18"/>
            <path d="M3 12h11"/>
            <path d="M3 16h18"/>
            <path d="M16 12h4m0 0-2.2-2.2M20 12l-2.2 2.2"/>
          </svg>
          {% when "salinization" %}
          <svg class="icon icon--md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 3s6.5 8 6.5 12.5a6.5 6.5 0 0 1-13 0C5.5 11 12 3 12 3Z"/>
            <path d="M9 15.5 12 13l3 2.5"/>
          </svg>
          {% endcase %}
          <span class="area-tab__text">
            <span class="area-tab__title">{{ a.title }}</span>
            <span class="area-tab__summary">{{ a.summary }}</span>
          </span>
        </button>
      </li>
      {% endfor %}
    </ul>

    <div class="areas__panels">
      {% for a in site.data.research_areas.areas %}
      <section class="area-panel" id="panel-{{ a.id }}" data-area="{{ a.id }}">
        <h3 class="area-panel__title">{{ a.title }}</h3>
        <p class="area-panel__desc">{{ a.description }}</p>
        {% if a.funded_by and a.funded_by != "" %}
        <p class="area-panel__funding">Funded by {{ a.funded_by }}</p>
        {% endif %}
        <p class="area-panel__label">Selected work</p>
        <ul class="area-papers">
          {% for doi in a.papers %}
            {% assign pub = site.data.publications | where: "doi", doi | first %}
            {% if pub %}
          <li>
            <a class="area-papers__title" href="{{ pub.doi }}" target="_blank" rel="noopener">{{ pub.title }}</a>
            <span class="area-papers__meta">
              {{ pub.journal }}{% if pub.citation and pub.citation != "" %}, {{ pub.citation }}{% endif %} &middot; {{ pub.year }}{% if pub.lead == "lab" %} &middot; <span class="area-papers__lab">Lab&#8209;led</span>{% endif %}
            </span>
          </li>
            {% else %}<!-- research_areas.yml: no publication in _data/publications.yml matches DOI {{ doi }} -->
            {% endif %}
          {% endfor %}
        </ul>
      </section>
      {% endfor %}
    </div>
  </div>
</div>

<div class="divider"><span class="divider__mark"></span></div>

<div class="band band--shade">
  <div class="wrap">
    <h2 class="section-title">Current &amp; Recent Funding</h2>
    <p class="page-subtitle" style="margin-bottom:20px;">Current and recently completed grants, supported primarily by the National Science Foundation.</p>

    {% assign grants = site.data.funding.grants %}

    <ul class="funding-ledger">
      {% for g in grants %}
      <li class="funding-entry">
        <div class="funding-entry__head">
          <span class="funding-entry__agency">{{ g.agency }}</span>
          <span class="funding-entry__years">{{ g.start_year }}&ndash;{{ g.end_year }}</span>
        </div>
        <h3 class="funding-entry__title">{{ g.title }}</h3>
        <p class="funding-entry__desc">{{ g.description }}</p>
        <dl class="funding-entry__facts">
          <div class="funding-entry__fact"><dt>Role</dt><dd>{{ g.role }}</dd></div>
          {% if g.program and g.program != "" %}
          <div class="funding-entry__fact"><dt>Program</dt><dd>{{ g.program }}</dd></div>
          {% endif %}
          {% if g.award_number and g.award_number != "" %}
          <div class="funding-entry__fact funding-entry__fact--id"><dt>Award No.</dt><dd>{{ g.award_number }}</dd></div>
          {% endif %}
        </dl>
      </li>
      {% endfor %}
    </ul>

    <p style="margin-bottom:0;"><a href="{{ '/assets/cv/Husic-CV.pdf' | relative_url }}">See the full list of awarded grants in my CV &rarr;</a></p>
  </div>
</div>
