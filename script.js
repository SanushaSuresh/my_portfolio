/* =========================================
   Sanusha Suresh Babu — portfolio scripts
   1. sticky nav background
   2. mobile menu
   3. active nav link on scroll
   4. skills tabs
   5. experience accordion
   6. reveal on scroll
   7. typing effect in the hero
   ========================================= */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. sticky nav background ------------------------------------ */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* 2. mobile menu ---------------------------------------------- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");

  function setMenu(open) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.hidden = false;
    menu.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) {
      setTimeout(function () {
        if (!menu.classList.contains("open")) menu.hidden = true;
      }, 320);
    }
  }

  burger.addEventListener("click", function () {
    setMenu(burger.getAttribute("aria-expanded") !== "true");
  });

  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") setMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      burger.focus();
    }
  });

  /* 3. active nav link on scroll -------------------------------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.setAttribute("aria-current", a.getAttribute("href") === "#" + entry.target.id ? "true" : "false");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* 4. skills tabs ---------------------------------------------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));

  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      var step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!step) return;
      e.preventDefault();
      var next = tabs[(i + step + tabs.length) % tabs.length];
      selectTab(next);
      next.focus();
    });
  });

  /* 5. experience accordion ------------------------------------- */
  var tlButtons = Array.prototype.slice.call(document.querySelectorAll(".tl-btn"));

  tlButtons.forEach(function (btn) {
    var body = document.getElementById(btn.getAttribute("aria-controls"));
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      body.style.maxHeight = open ? "0px" : body.scrollHeight + "px";
    });
  });

  window.addEventListener("resize", function () {
    tlButtons.forEach(function (btn) {
      if (btn.getAttribute("aria-expanded") !== "true") return;
      var body = document.getElementById(btn.getAttribute("aria-controls"));
      body.style.maxHeight = body.scrollHeight + "px";
    });
  });

  /* 6. reveal on scroll ----------------------------------------- */
  var targets = document.querySelectorAll(".band .wrap > *, .hero .wrap > *");
  targets.forEach(function (el) { el.classList.add("reveal"); });

  if (reduced || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        setTimeout(function () { entry.target.classList.add("in"); }, Math.min(i, 5) * 60);
        ro.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

    targets.forEach(function (el) { ro.observe(el); });
  }

  /* 7. typing effect in the hero -------------------------------- */
  // Edit this list to change the roles that get typed out.
  var roles = ["Frontend Developer", "Python Full Stack Developer", "UI/UX Designer"];
  var typedEl = document.getElementById("typed");

  if (typedEl) {
    if (reduced) {
      typedEl.textContent = roles.join(" · ");
    } else {
      var ri = 0;
      var ci = roles[0].length;   // page starts with the first role already shown
      var deleting = true;

      setTimeout(function tick() {
        var word = roles[ri];
        ci += deleting ? -1 : 1;
        typedEl.textContent = word.slice(0, ci);

        var delay = deleting ? 45 : 85;
        if (!deleting && ci === word.length) {
          delay = 1600;
          deleting = true;
        } else if (deleting && ci === 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
          delay = 350;
        }
        setTimeout(tick, delay);
      }, 1800);
    }
  }
})();
