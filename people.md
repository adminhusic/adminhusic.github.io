---
layout: default
title: People
subtitle: "The researchers behind the work, at Virginia Tech and University of Kansas."
description: "Meet the Dynamic Connectivity Lab: Admin Husic's research group at Virginia Tech, plus alumni from Virginia Tech and the University of Kansas."
image: /assets/img/husic-headshot.jpg
---

<div class="section">
  <div class="pi-mascot">
    <div class="pi-mascot__col">
      <h2 class="section-title">Principal Investigator</h2>
      <div class="person">
        <div class="person__avatar">
          <img src="{{ '/assets/img/husic-headshot.jpg' | relative_url }}" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
        </div>
        <h3 class="person__name">{{ site.data.people.pi.name }}</h3>
        <p class="person__role">{{ site.data.people.pi.role }}</p>
        {% for line in site.data.people.pi.desc %}<p class="person__desc">{{ line }}</p>{% endfor %}
      </div>
    </div>
    <div class="pi-mascot__col">
      <h2 class="section-title">Lab Mascot</h2>
      <div class="person">
        <div class="person__avatar">
          <img src="{{ '/assets/img/darcy.jpg' | relative_url }}" alt="Darcy, the lab's Great Pyrenees mix mascot" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">
        </div>
        <h3 class="person__name">{{ site.data.people.mascot.name }}</h3>
        <p class="person__role">{{ site.data.people.mascot.role }}</p>
        {% for line in site.data.people.mascot.desc %}<p class="person__desc">{{ line }}</p>{% endfor %}
      </div>
    </div>
  </div>
</div>

<div class="divider"><span class="divider__mark"></span></div>

<div class="section">
  <h2 class="section-title">Current Group</h2>
  <div class="person-grid">
    {% for person in site.data.people.current %}
    {% assign name_parts = person.name | split: " " %}
    <div class="person">
      <div class="person__avatar">{{ name_parts.first | slice: 0, 1 }}{{ name_parts.last | slice: 0, 1 }}</div>
      <h3 class="person__name">{{ person.name }}</h3>
      <p class="person__role">{{ person.role }}</p>
      <p class="person__desc">{{ person.note }}</p>
    </div>
    {% endfor %}
  </div>
</div>

<div class="divider"><span class="divider__mark"></span></div>

<div class="section">
  <h2 class="section-title">Alumni</h2>
  {% assign postdocs = site.data.people.alumni | where: "role", "Postdoctoral Scholar" | sort: "last_year" | reverse %}
  {% assign doctoral = site.data.people.alumni | where: "role", "Doctoral Student" | sort: "last_year" | reverse %}
  {% assign masters = site.data.people.alumni | where: "role", "Master's Student" | sort: "last_year" | reverse %}
  {% assign undergrads = site.data.people.alumni | where: "role", "Undergraduate Student" | sort: "last_year" | reverse %}
  {% include alumni-group.html group=postdocs title="Postdoctoral Fellows" %}
  {% include alumni-group.html group=doctoral title="Doctoral Students" %}
  {% include alumni-group.html group=masters title="Master's Students" %}
  {% include alumni-group.html group=undergrads title="Undergraduate Students" %}
</div>
