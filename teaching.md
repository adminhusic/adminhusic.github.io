---
layout: default
title: Teaching
subtitle: "Undergraduate and graduate courses in fluid mechanics, open channel hydraulics, sediment transport, and machine learning."
description: "Courses taught by Admin Husic at Virginia Tech: fluid mechanics, open channel hydraulics, sediment transport, and machine learning for water resources."
image: /assets/img/husic-headshot.jpg
---

{% for course in site.data.teaching %}
{% unless forloop.first %}<div class="divider"><span class="divider__mark"></span></div>{% endunless %}
<div class="section">
  <div style="display:flex; align-items:center; gap:14px; margin-bottom:2px;">
    <svg class="icon icon--md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z"/>
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5v-13Z"/>
    </svg>
    <h2 class="section-title" style="margin-bottom:0;">{{ course.title }}</h2>
  </div>
  <p class="pub-item__meta" style="margin-bottom:10px;">{{ course.level }}</p>
  <p>{{ course.description }}</p>
</div>
{% endfor %}
