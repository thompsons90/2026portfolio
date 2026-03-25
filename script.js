// ─────────────────────────────────────────────────────────────
// HIGHLIGHTS — Premium Morph to full-screen experience panel
// Desktop: 5-beat morph animation
// Mobile:  instant fade (respects prefers-reduced-motion)
// ─────────────────────────────────────────────────────────────

(function () {
  "use strict";

  var seeBtn = document.getElementById("hl-see-more-btn");
  var backBtn = document.getElementById("hl-back-btn");
  var panel = document.getElementById("hl-experience");
  var inner = document.getElementById("hl-experience-inner");
  var section = document.querySelector(".highlights-section");
  var prevFocus = null;
  var isAnimating = false;

  // ── Morph pill element ────────────────────────────────────────
  // A div that starts at the button and expands to fill the viewport.
  // It's invisible to AT (aria-hidden) and never receives focus.
  var pill = document.createElement("div");
  pill.setAttribute("aria-hidden", "true");
  pill.style.cssText = [
    "position:fixed",
    "z-index:499" /* just below .hl-experience (500) */,
    "pointer-events:none",
    "opacity:0",
    "background:#0f2018" /* matches panel background */,
    "will-change:left,top,width,height,border-radius,opacity",
    "border-radius:7px",
  ].join(";");
  document.body.appendChild(pill);

  // ── Helpers ───────────────────────────────────────────────────

  var DESKTOP_MQ = window.matchMedia("(min-width: 769px)");
  var REDUCED_MQ = window.matchMedia("(prefers-reduced-motion: reduce)");

  function isDesktop() {
    return DESKTOP_MQ.matches;
  }
  function reducedMotion() {
    return REDUCED_MQ.matches;
  }

  function getFocusable() {
    return Array.from(
      panel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  function focusFirst() {
    var els = getFocusable();
    if (els.length) els[0].focus();
  }

  function blurSection(on) {
    var els = section.querySelectorAll(
      ".hl-card, .highlights-section__header, .hl-see-more",
    );
    [].forEach.call(els, function (el) {
      if (on) {
        el.style.transition = "filter 0.28s ease, opacity 0.28s ease";
        el.style.filter = "blur(2px) brightness(0.4)";
        el.style.opacity = "0.5";
      } else {
        el.style.filter = "";
        el.style.opacity = "";
      }
    });
  }

  function staggerIn(elements) {
    elements.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
    });
    elements.forEach(function (el, i) {
      setTimeout(
        function () {
          el.style.transition =
            "opacity 0.38s ease, transform 0.38s cubic-bezier(0.23,1,0.32,1)";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        },
        50 + i * 80,
      );
    });
  }

  function clearStagger(elements) {
    elements.forEach(function (el) {
      el.style.transition = "";
      el.style.opacity = "";
      el.style.transform = "";
    });
  }

  // ── OPEN ──────────────────────────────────────────────────────

  function openPanel() {
    if (isAnimating) return;
    prevFocus = document.activeElement;

    if (!isDesktop() || reducedMotion()) {
      openInstant();
      return;
    }

    openMorph();
  }

  function openInstant() {
    panel.classList.add("is-open");
    panel.style.opacity = "1";
    document.body.style.overflow = "hidden";
    seeBtn.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
    inner.scrollTop = 0;
    focusFirst();
  }

  function openMorph() {
    isAnimating = true;
    var btnRect = seeBtn.getBoundingClientRect();

    // Beat 1 — micro-press
    seeBtn.style.transition = "transform 0.1s ease";
    seeBtn.style.transform = "scale(0.97)";

    setTimeout(function () {
      seeBtn.style.transform = "scale(1)";

      // Beat 2 — blur section behind
      blurSection(true);

      setTimeout(function () {
        // Beat 3 — pill stamps at button, morphs to fill viewport
        pill.style.transition = "none";
        pill.style.left = btnRect.left + "px";
        pill.style.top = btnRect.top + "px";
        pill.style.width = btnRect.width + "px";
        pill.style.height = btnRect.height + "px";
        pill.style.borderRadius = "7px";
        pill.style.opacity = "1";

        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            pill.style.transition = [
              "left          0.54s cubic-bezier(0.34,1.05,0.64,1)",
              "top           0.54s cubic-bezier(0.34,1.05,0.64,1)",
              "width         0.54s cubic-bezier(0.34,1.05,0.64,1)",
              "height        0.54s cubic-bezier(0.34,1.05,0.64,1)",
              "border-radius 0.54s cubic-bezier(0.34,1.05,0.64,1)",
            ].join(",");
            pill.style.left = "0px";
            pill.style.top = "0px";
            pill.style.width = "100vw";
            pill.style.height = "100vh";
            pill.style.borderRadius = "0px";

            // Beat 4 — swap pill for real panel mid-flight
            setTimeout(function () {
              // Reveal panel (no fade — pill already occupies this space)
              panel.classList.add("is-open");
              panel.style.opacity = "1";
              document.body.style.overflow = "hidden";
              seeBtn.setAttribute("aria-expanded", "true");
              panel.setAttribute("aria-hidden", "false");
              inner.scrollTop = 0;

              // Un-blur section content (it's now hidden behind the panel)
              blurSection(false);

              // Fade pill away now panel is on top
              pill.style.transition = "opacity 0.15s ease";
              pill.style.opacity = "0";

              // Beat 5 — stagger panel content in
              var staggerEls = Array.from(
                panel.querySelectorAll(".hl-experience__header, .hl-tl-item"),
              );
              staggerIn(staggerEls);

              // Focus after stagger settles
              var focusDelay = 50 + staggerEls.length * 80 + 60;
              setTimeout(function () {
                isAnimating = false;
                focusFirst();
              }, focusDelay);
            }, 500); // pill morph duration
          });
        });
      }, 120); // blur settle
    }, 80); // press settle
  }

  // ── CLOSE ─────────────────────────────────────────────────────

  function closePanel() {
    if (isAnimating) return;

    if (!isDesktop() || reducedMotion()) {
      closeInstant();
      return;
    }

    closeMorph();
  }

  function closeInstant() {
    panel.classList.remove("is-open");
    panel.style.opacity = "";
    document.body.style.overflow = "";
    seeBtn.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
    inner.scrollTop = 0;
    if (prevFocus) prevFocus.focus();
  }

  function closeMorph() {
    isAnimating = true;

    // Stagger content out
    var staggerEls = Array.from(
      panel.querySelectorAll(".hl-experience__header, .hl-tl-item"),
    );
    staggerEls.forEach(function (el, i) {
      el.style.transition = [
        "opacity   0.18s " + i * 30 + "ms ease",
        "transform 0.18s " + i * 30 + "ms ease",
      ].join(",");
      el.style.opacity = "0";
      el.style.transform = "scale(0.96)";
    });

    var staggerOut = 40 + staggerEls.length * 30;

    setTimeout(function () {
      // Fade panel out
      panel.style.transition = "opacity 0.22s ease";
      panel.style.opacity = "0";

      setTimeout(function () {
        // Reset panel
        panel.classList.remove("is-open");
        panel.style.opacity = "";
        panel.style.transition = "";
        panel.setAttribute("aria-hidden", "true");
        seeBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        inner.scrollTop = 0;

        // Reset stagger styles for next open
        clearStagger(staggerEls);

        isAnimating = false;
        if (prevFocus) prevFocus.focus();
      }, 240);
    }, staggerOut);
  }

  // ── EVENT BINDINGS ────────────────────────────────────────────

  if (seeBtn) seeBtn.addEventListener("click", openPanel);
  if (backBtn) backBtn.addEventListener("click", closePanel);

  // Keyboard: Escape closes
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!panel.classList.contains("is-open")) return;
    closePanel();
  });

  // Focus trap inside panel
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    if (!panel.classList.contains("is-open")) return;

    var focusable = getFocusable();
    if (!focusable.length) {
      e.preventDefault();
      return;
    }

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
})();
