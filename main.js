(function () {
  "use strict";

  var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };

  function safe(fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn("[" + name + "]", e); }
  }

  /* Sticky nav — adds shadow once the page has scrolled past the top */
  function initNav() {
    var nav = $("[data-nav]");
    if (!nav) return;
    var onScroll = function () {
      if (window.scrollY > 40) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Mobile menu — native <details>, JS only closes it after a link is tapped,
     on outside click, or if the page is scrolled while it's open */
  function initMobileNav() {
    var panel = $("[data-nav-mobile]");
    if (!panel) return;

    $$("a", panel).forEach(function (a) {
      a.addEventListener("click", function () { panel.removeAttribute("open"); });
    });

    document.addEventListener("click", function (e) {
      if (panel.hasAttribute("open") && !panel.contains(e.target)) {
        panel.removeAttribute("open");
      }
    });

    window.addEventListener("scroll", function () {
      if (panel.hasAttribute("open")) panel.removeAttribute("open");
    }, { passive: true });
  }

  /* Reveal-on-scroll — universal, low threshold.
     IntersectionObserver is the primary mechanism; a sweep function catches
     anything it misses (e.g. an instant jump via anchor link that skips
     past a section without ever resting on it), re-checked on a short
     timeout and on every scroll so nothing is left permanently invisible. */
  function initReveals() {
    var els = $$("[data-reveal]");
    if (!els.length) return;

    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: "0px 0px -2% 0px" });

    els.forEach(function (el) { io.observe(el); });

    function sweep() {
      var pending = $$("[data-reveal]:not(.is-revealed)");
      pending.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add("is-revealed");
        }
      });
      return pending.length > 0;
    }

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { sweep(); ticking = false; });
    }, { passive: true });

    /* Belt-and-suspenders: keep sweeping periodically (independent of scroll
       events) until every element has been revealed, then stop. Covers any
       scroll pattern the observer or the scroll-driven sweep might miss. */
    var interval = setInterval(function () {
      if (!sweep()) clearInterval(interval);
    }, 1000);
    setTimeout(function () { clearInterval(interval); }, 15000);
  }

  /* Método Raíz — signature path fill, triggered once when the section enters view */
  function initMetodoPath() {
    var wrap = $("[data-metodo-path]");
    var fill = $("[data-metodo-fill]");
    if (!wrap || !fill) return;

    if (!("IntersectionObserver" in window)) {
      wrap.classList.add("is-active");
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          wrap.classList.add("is-active");
          io.unobserve(wrap);
        }
      });
    }, { threshold: 0.05 });

    io.observe(wrap);

    function maybeActivate() {
      if (wrap.classList.contains("is-active")) return true;
      var r = wrap.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) wrap.classList.add("is-active");
      return wrap.classList.contains("is-active");
    }

    window.addEventListener("scroll", function () { maybeActivate(); }, { passive: true });
    var interval = setInterval(function () {
      if (maybeActivate()) clearInterval(interval);
    }, 1000);
    setTimeout(function () { clearInterval(interval); }, 15000);
  }

  /* Calendar/WhatsApp buttons are placeholders until real links are added.
     Prevent the default "#" jump-to-top so an unwired button does nothing
     instead of unexpectedly yanking the page, until it's wired up. */
  function initPlaceholderLinks() {
    $$("[data-placeholder]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (a.getAttribute("href") === "#") e.preventDefault();
      });
    });
  }

  function boot() {
    safe(initNav, "initNav");
    safe(initMobileNav, "initMobileNav");
    safe(initReveals, "initReveals");
    safe(initMetodoPath, "initMetodoPath");
    safe(initPlaceholderLinks, "initPlaceholderLinks");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
