---
layout: default
hide_title: true
title: Publications
subtitle: "Peer-reviewed journal articles."
---

{% assign published_pubs = site.data.publications | where: "status", "published" %}
{% assign lab_pubs = published_pubs | where: "lead", "lab" %}
<div class="pub-header">
  <div class="pub-header__text">
    <h1 class="page-title">Publications</h1>
    <p class="page-subtitle">Peer-reviewed journal articles.</p>
    <p class="pub-legend">Underlined names in author lists indicate student/postdoc advisees.</p>
  </div>
  <div class="pub-stats">
    <div class="pub-stat">
      <div class="pub-stat__bubble">{{ published_pubs | size }}</div>
      <div class="pub-stat__label">Total Publications</div>
    </div>
    <div class="pub-stat">
      <div class="pub-stat__bubble">{{ lab_pubs | size }}</div>
      <div class="pub-stat__label">Lab-Led</div>
    </div>
  </div>
</div>

<div class="pub-filters pub-filters--lead" role="group" aria-label="Filter publications by lead author">
  <button type="button" class="is-active" data-lead-filter="all" aria-pressed="true">All</button>
  <button type="button" data-lead-filter="lab" aria-pressed="false">Lab-Led</button>
</div>

<ul class="pub-list" id="pub-list">
  {% assign pubs = site.data.publications %}
  {% assign last_year = nil %}
  {% for pub in pubs %}
    {% if pub.status != "published" %}{% continue %}{% endif %}
    {% if pub.year != last_year %}
      <li class="pub-year-heading"><h2>{{ pub.year }}</h2></li>
      {% assign last_year = pub.year %}
    {% endif %}
    <li class="pub-item" data-lead="{{ pub.lead }}">
      <div class="pub-item__body">
        <div class="pub-item__title">{{ pub.title }}</div>
        {% if pub.journal %}
          <div class="pub-item__journal">{{ pub.journal }}{% if pub.citation contains "In " %}, {{ pub.citation }}{% endif %}</div>
        {% elsif pub.citation %}
          <div class="pub-item__journal">{{ pub.citation }}</div>
        {% endif %}
        <div class="pub-item__authors">{{ pub.authors }}</div>
        {% if pub.note %}<div class="pub-item__note">{{ pub.note }}</div>{% endif %}
      </div>
      <div class="pub-item__links">
        {% if pub.doi %}<a class="doi-link" href="{{ pub.doi }}" target="_blank" rel="noopener">DOI</a>{% endif %}
      </div>
    </li>
  {% endfor %}
</ul>
