---
layout: default
title: Research
subtitle: How human activity and a changing climate reshape the transport and connectivity of water, sediment, and nutrients across Earth's surface.
description: "Admin Husic's research at Virginia Tech on hydrology, sediment transport, and machine learning for water resources — how human activity and climate change reshape water, sediment, and nutrient connectivity."
image: /assets/img/husic-headshot.jpg
---

My group works at the intersection of hydrology, biogeochemistry, and data science. We combine
high-frequency aquatic sensors, geochemical and isotopic tracers, numerical models, and machine
learning to understand how watersheds move water, sediment, and nutrients &mdash; and how that
movement is being reshaped by urbanization, deforestation, agriculture, and climate change, from individual
catchments to the continental scale.

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
    <p class="page-subtitle" style="margin-bottom:20px;">More than $11M in awarded research funding as PI and Co-PI since 2019, supported primarily by the National Science Foundation.</p>
    <ul class="area-list">
      <li class="area-row">
        <svg class="icon icon--md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 21V12M12 12 6 6M12 12l6-6M6 6V3M18 6V3"/>
        </svg>
        <div>
          <h3>CAREER: Dynamic Connectivity</h3>
          <p>A research and educational frontier for sustainable environmental management under
          climate and land use uncertainty. <em>National Science Foundation</em>, 2024&ndash;2029.</p>
        </div>
      </li>
      <li class="area-row">
        <svg class="icon icon--md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="9" cy="12" r="6"/>
          <circle cx="15" cy="12" r="6"/>
        </svg>
        <div>
          <h3>GCR: Freshwater Salinization</h3>
          <p>Common Pool Resource Theory as a scalable framework for catalyzing stakeholder-driven
          solutions to the Freshwater Salinization Syndrome. <em>National Science Foundation</em>,
          2023&ndash;2027.</p>
        </div>
      </li>
      <li class="area-row">
        <svg class="icon icon--md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 9c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/>
          <path d="M3 15c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2"/>
        </svg>
        <div>
          <h3>Reservoir Sustainability</h3>
          <p>Can human-induced turbidity currents enable sustainability of freshwater reservoirs?
          <em>National Science Foundation</em>, 2023&ndash;2026.</p>
        </div>
      </li>
      <li class="area-row">
        <svg class="icon icon--md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 2v15"/>
          <path d="M12 5h2.5M12 8.5h2.5M12 12h2.5"/>
          <path d="M3 20c2-1.5 3.5 1.5 5.5 0s3.5-1.5 5.5 0 3.5 1.5 5.5 0"/>
        </svg>
        <div>
          <h3>Broad Run Watershed Monitoring Program</h3>
          <p>Long-term water quality and sediment monitoring program in Loudoun County, Virginia.
          <em>Loudoun Water</em>, 2025&ndash;2027.</p>
        </div>
      </li>
      <li class="area-row">
        <svg class="icon icon--md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11Z"/>
          <circle cx="12" cy="10" r="2.5"/>
        </svg>
        <div>
          <h3>Statewide Reservoir Sedimentation Inventory</h3>
          <p>A statewide inventory of dominant reservoir sedimentation sources to inform targeted
          watershed conservation. <em>Kansas Water Office</em>, 2024&ndash;2026.</p>
        </div>
      </li>
    </ul>
    <p style="margin-bottom:0;"><a href="{{ '/assets/cv/Husic-CV.pdf' | relative_url }}">See the full list of awarded grants in my CV &rarr;</a></p>
  </div>
</div>
