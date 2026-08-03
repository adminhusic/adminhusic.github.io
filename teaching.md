---
layout: default
title: Teaching
subtitle: "Undergraduate and graduate courses in fluid mechanics, open channel hydraulics, sediment transport, and machine learning."
description: "Courses taught by Admin Husic at Virginia Tech: fluid mechanics, open channel hydraulics, sediment transport, and machine learning for water resources."
image: /assets/img/husic-headshot.jpg
---

<p class="page-hint">Click a tile to flip it and read the course description.</p>

<ul class="course-mosaic">
  {% for course in site.data.teaching %}
  <li>
    <button type="button" class="course-tile" aria-pressed="false">
      <span class="course-tile__inner">
        <span class="course-tile__face course-tile__face--front">
          {% case course.title %}
          {% when "Fluid Mechanics" %}
          <svg class="icon icon--lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12 16.5 19.79H7.5L3 12"/>
            <path d="M12 3C10.3 6.3 8.5 9.7 8.5 12.5a3.5 3.5 0 0 0 7 0C15.5 9.7 13.7 6.3 12 3Z"/>
          </svg>
          {% when "Fluid Mechanics Lab" %}
          <svg class="icon icon--lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9 2h6"/>
            <path d="M10 2v6L5 20h14L14 8V2"/>
            <path d="M7.3 15h9.4" opacity="0.6"/>
          </svg>
          {% when "Open Channel Flow" %}
          <svg class="icon icon--lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4 15h16" opacity="0.6"/>
            <path d="M1 12 8 19h8L23 12"/>
          </svg>
          {% when "Mechanics of Sediment Transport" %}
          <svg class="icon icon--lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2"/>
            <path d="M12.59 19.41A2 2 0 1 0 14 16H2"/>
            <circle cx="5" cy="11" r="1.1" fill="currentColor" stroke="none" opacity="0.6"/>
            <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" opacity="0.6"/>
            <circle cx="17" cy="9" r="1.2" fill="currentColor" stroke="none" opacity="0.6"/>
            <circle cx="18" cy="15" r="1.1" fill="currentColor" stroke="none" opacity="0.6"/>
          </svg>
          {% when "Watershed Erosion and Sedimentation" %}
          <svg class="icon icon--lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M2 19 10 6l4 6 3-4 5 11Z"/>
            <path d="M6 19c1-3 2-4 3-4"/>
            <path d="M14 19c1-2.5 1.5-3.5 2-4"/>
          </svg>
          {% when "Machine Learning in Water Resources" %}
          <svg class="icon icon--lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 7 12 7M5 7 12 17M5 17 12 7M5 17 12 17M12 7 19 12M12 17 19 12"/>
            <circle cx="5" cy="7" r="2" fill="currentColor" stroke="none"/>
            <circle cx="5" cy="17" r="2" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="7" r="2" fill="currentColor" stroke="none"/>
            <circle cx="12" cy="17" r="2" fill="currentColor" stroke="none"/>
            <circle cx="19" cy="12" r="2" fill="currentColor" stroke="none"/>
          </svg>
          {% endcase %}
          <h3 class="course-tile__title">{{ course.title }}</h3>
          <span class="course-tile__level">{{ course.level }}</span>
        </span>
        <span class="course-tile__face course-tile__face--back">
          <p>{{ course.description }}</p>
        </span>
      </span>
    </button>
  </li>
  {% endfor %}
</ul>
