---
layout: default
title: Join Us
subtitle: "We're growing at the Occoquan Watershed Monitoring Laboratory, Virginia Tech."
description: "Admin Husic welcomes inquiries from prospective doctoral students and postdoctoral researchers at Virginia Tech's Occoquan Watershed Monitoring Laboratory."
image: /assets/img/husic-headshot.jpg
---

{% assign openings = site.data.openings %}
{% assign mail_subject = "Website inquiry: joining the Dynamic Connectivity Lab" %}

<div class="masthead">
  <svg class="icon icon--md masthead__mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 21V11"/>
    <path d="M12 11c0-4-3-6-7-6c0 4 3 6 7 6Z"/>
    <path d="M12 14c0-3 3-5 7-5c0 3-3 5-7 5Z"/>
  </svg>
  <p class="masthead__line">Dynamic Connectivity Lab &middot; Occoquan Watershed Monitoring Laboratory &middot; Virginia Tech</p>
</div>

<div class="section">
  <div class="openings__header">
    <h2 class="section-title">Current Openings</h2>
    <a class="btn" href="mailto:{{ site.email }}?subject={{ mail_subject | uri_escape }}">Email me</a>
  </div>
  {% if openings.updated and openings.updated != "" %}
  <p class="openings__updated">Status updated {{ openings.updated }}</p>
  {% endif %}
  <ul class="openings">
    {% for r in openings.roles %}
    <li class="opening">
      <div>
        <h3 class="opening__role">{{ r.role }}</h3>
        <p class="opening__detail">{{ r.detail }}</p>
        {% if r.funding and r.funding != "" %}
        <p class="opening__funding">{{ r.funding }}</p>
        {% endif %}
      </div>
      <span class="opening__status">{{ r.status }}</span>
    </li>
    {% endfor %}
  </ul>
</div>

<div class="divider"><span class="divider__mark"></span></div>

<div class="letter">
  <p class="letter__salutation">Dear prospective student or postdoc,</p>

  <div class="letter__block">
    <p>
      I am generally looking for motivated <strong>doctoral students</strong> and
      <strong>postdoctoral researchers</strong> interested in hydrology, water quality, sediment
      transport, and machine learning for environmental systems.
    </p>
    <aside class="letter__note">
      <strong>Funding</strong>
      The group's work is supported by an NSF CAREER award and several collaborative grants &mdash;
      see <a href="{{ '/research/' | relative_url }}">Research</a>.
    </aside>
  </div>

  <div class="letter__block">
    <p>
      I don't have a formally posted opening at the moment, but I'm always glad to hear from strong
      prospective students and postdocs. The group has active NSF and collaborative funding, and when
      the fit is right I will work to find support for it. If that sounds like you, email me.
    </p>
  </div>

  <div class="letter__block">
    <p>
      Strong candidates typically have a background in civil/environmental engineering, hydrology,
      earth science, or a related quantitative field, and an interest in field sensing, numerical
      modeling, geochemical tracing, or machine learning. Comfort with a programming language &mdash;
      Python, R, or similar &mdash; is a valuable skill, given how much of the group's work relies on
      data analysis, numerical modeling, and machine learning.
    </p>
    <aside class="letter__note">
      <strong>Admission</strong>
      Through the Virginia Tech Charles E. Via, Jr. Department of Civil and Environmental Engineering
      graduate program.
    </aside>
  </div>

  <div class="letter__block">
    <p>
      I periodically host postdoctoral fellows on funded projects spanning continental-scale machine
      learning for hydrology and sediment and salinization tracing. If you have a PhD in a related
      field and are interested in a postdoctoral position, email me with your CV and a short statement
      of research interests &mdash; I'm happy to discuss current and upcoming opportunities, including
      fellowship mechanisms.
    </p>
  </div>

  <div class="letter__block">
    <div>
      <p>When you email me, please include:</p>
      <ul class="checklist">
        <li>
          <svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>
          <span>Your CV or resume</span>
        </li>
        <li>
          <svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>
          <span>A brief note on your research interests and why they overlap with the group's work</span>
        </li>
        <li>
          <svg class="icon icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>
          <span>Unofficial transcripts (if available)</span>
        </li>
      </ul>
    </div>
  </div>

  <div class="letter__signoff">
    <p class="letter__signoff-name">Admin Husic</p>
    <p class="letter__signoff-contact"><a href="mailto:{{ site.email }}?subject={{ mail_subject | uri_escape }}">{{ site.email }}</a></p>
  </div>
</div>

<div class="divider"><span class="divider__mark"></span></div>

<div class="callout">
  <p style="margin-bottom:0;">
    See the <a href="{{ '/people/' | relative_url }}">People</a> page to meet the current group, and
    <a href="{{ '/publications/' | relative_url }}">Publications</a> for a sense of ongoing work.
  </p>
</div>
