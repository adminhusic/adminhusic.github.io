document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  var leadBar = document.querySelector(".pub-filters--lead");
  var pubList = document.getElementById("pub-list");
  if (leadBar && pubList) {
    var lead = "all";

    function applyFilters() {
      pubList.querySelectorAll("li.pub-item").forEach(function (li) {
        li.style.display = (lead === "all" || li.dataset.lead === lead) ? "" : "none";
      });
      var headings = Array.prototype.slice.call(pubList.querySelectorAll(".pub-year-heading"));
      headings.forEach(function (heading, i) {
        var next = headings[i + 1];
        var el = heading.nextElementSibling;
        var hasVisible = false;
        while (el && el !== next) {
          if (!el.classList.contains("pub-year-heading") && el.style.display !== "none") { hasVisible = true; break; }
          el = el.nextElementSibling;
        }
        heading.style.display = hasVisible ? "" : "none";
      });
    }

    leadBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-lead-filter]");
      if (!btn) return;
      leadBar.querySelectorAll("button").forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");
      lead = btn.getAttribute("data-lead-filter");
      applyFilters();
    });

    applyFilters();
  }

  document.querySelectorAll(".course-tile").forEach(function (tile) {
    tile.addEventListener("click", function () {
      var flipped = tile.getAttribute("aria-pressed") === "true";
      tile.setAttribute("aria-pressed", flipped ? "false" : "true");
    });
  });

  // Research areas: rail + panels. The markup ships with every panel visible so
  // the page is complete without JS; only once we know we can drive it do we add
  // .is-enhanced and collapse to one panel at a time.
  document.querySelectorAll(".areas").forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll(".area-tab"));
    var panels = Array.prototype.slice.call(root.querySelectorAll(".area-panel"));
    if (!tabs.length || !panels.length) return;

    function select(id) {
      tabs.forEach(function (tab) {
        tab.setAttribute("aria-expanded", tab.dataset.area === id ? "true" : "false");
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.dataset.area !== id;
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        select(tab.dataset.area);
        if (history.replaceState) {
          history.replaceState(null, "", "#" + tab.dataset.area);
        }
      });
    });

    root.classList.add("is-enhanced");

    // Honour a deep link like /research/#sensing, else open the first area.
    function selectFromHash(fallbackToFirst) {
      var id = window.location.hash.replace("#", "");
      var match = tabs.filter(function (t) { return t.dataset.area === id; })[0];
      if (match) select(id);
      else if (fallbackToFirst) select(tabs[0].dataset.area);
    }
    selectFromHash(true);
    // Also respond to the hash changing while already on the page, so a link to
    // #sensing works whether or not it triggers a fresh load.
    window.addEventListener("hashchange", function () { selectFromHash(false); });
  });
});
