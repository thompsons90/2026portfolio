// ─────────────────────────────────────────────────────────────
// HIGHLIGHTS — Premium Morph to full-screen experience panel
// Desktop: 5-beat morph animation
// Mobile:  instant fade (respects prefers-reduced-motion)
// ─────────────────────────────────────────────────────────────

(function () {
  "use strict";

  var highlightsSeeMoreBtn = document.getElementById("highlights-see-more-btn");
  var highlightsBackBtn = document.getElementById("highlights-back-btn");
  var highlightsPanel = document.getElementById("highlights-experience");
  var highlightsInner = document.getElementById("highlights-experience-inner");
  var highlightsSection = document.querySelector(".highlights-section");
  var prevFocus = null;
  var isAnimating = false;

  // ── Morph pill element ────────────────────────────────────────
  // A div that starts at the button and expands to fill the viewport.
  // It's invisible to AT (aria-hidden) and never receives focus.
  var pill = document.createElement("div");
  pill.setAttribute("aria-hidden", "true");
  pill.style.cssText = [
    "position:fixed",
    "z-index:499" /* just below .highlights-experience (500) */,
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
      highlightsPanel.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  function focusFirst() {
    var els = getFocusable();
    if (els.length) els[0].focus();
  }

  function blurSection(on) {
    var els = highlightsSection.querySelectorAll(
      ".highlights-card, .highlights-section__header, .highlights-see-more",
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
          el.style.transition = "opacity 0.38s ease, transform 0.38s cubic-bezier(0.23,1,0.32,1)";
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
    highlightsPanel.classList.add("is-open");
    highlightsPanel.style.opacity = "1";
    document.body.style.overflow = "hidden";
    highlightsSeeMoreBtn.setAttribute("aria-expanded", "true");
    highlightsPanel.setAttribute("aria-hidden", "false");
    highlightsInner.scrollTop = 0;
    focusFirst();
  }

  function openMorph() {
    isAnimating = true;
    var btnRect = highlightsSeeMoreBtn.getBoundingClientRect();

    // Beat 1 — micro-press
    highlightsSeeMoreBtn.style.transition = "transform 0.1s ease";
    highlightsSeeMoreBtn.style.transform = "scale(0.97)";

    setTimeout(function () {
      highlightsSeeMoreBtn.style.transform = "scale(1)";

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
              highlightsPanel.classList.add("is-open");
              highlightsPanel.style.opacity = "1";
              document.body.style.overflow = "hidden";
              highlightsSeeMoreBtn.setAttribute("aria-expanded", "true");
              highlightsPanel.setAttribute("aria-hidden", "false");
              highlightsInner.scrollTop = 0;

              // Un-blur section content (it's now hidden behind the panel)
              blurSection(false);

              // Fade pill away now panel is on top
              pill.style.transition = "opacity 0.15s ease";
              pill.style.opacity = "0";

              // Beat 5 — stagger panel content in
              var staggerEls = Array.from(
                highlightsPanel.querySelectorAll(
                  ".highlights-experience__header, .highlights-tl-item",
                ),
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
    highlightsPanel.classList.remove("is-open");
    highlightsPanel.style.opacity = "";
    document.body.style.overflow = "";
    highlightsSeeMoreBtn.setAttribute("aria-expanded", "false");
    highlightsPanel.setAttribute("aria-hidden", "true");
    highlightsInner.scrollTop = 0;
    if (prevFocus) prevFocus.focus();
  }

  function closeMorph() {
    isAnimating = true;

    // Stagger content out
    var staggerEls = Array.from(
      highlightsPanel.querySelectorAll(".highlights-experience__header, .highlights-tl-item"),
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
      highlightsPanel.style.transition = "opacity 0.22s ease";
      highlightsPanel.style.opacity = "0";

      setTimeout(function () {
        // Reset panel
        highlightsPanel.classList.remove("is-open");
        highlightsPanel.style.opacity = "";
        highlightsPanel.style.transition = "";
        highlightsPanel.setAttribute("aria-hidden", "true");
        highlightsSeeMoreBtn.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        highlightsInner.scrollTop = 0;

        // Reset stagger styles for next open
        clearStagger(staggerEls);

        isAnimating = false;
        if (prevFocus) prevFocus.focus();
      }, 240);
    }, staggerOut);
  }

  // ── EVENT BINDINGS ────────────────────────────────────────────

  if (highlightsSeeMoreBtn) highlightsSeeMoreBtn.addEventListener("click", openPanel);
  if (highlightsBackBtn) highlightsBackBtn.addEventListener("click", closePanel);

  // Keyboard: Escape closes
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!highlightsPanel.classList.contains("is-open")) return;
    closePanel();
  });

  // Focus trap inside panel
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    if (!highlightsPanel.classList.contains("is-open")) return;

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

// ─────────────────────────────────────────────────────────────
// SKILLS SECTION
// ─────────────────────────────────────────────────────────────
const core = [
  { label: "React", size: "xl" },
  { label: "TypeScript", size: "xl" },
  { label: "JavaScript", size: "xl" },
  { label: "AI Prompts", size: "lg" },
  { label: "Spec Kit", size: "lg" },
];

const secondary = [
  { label: "C#.NET", size: "md", blue: true },
  { label: "HTML", size: "md", blue: true },
  { label: "CSS", size: "md", blue: true },
  { label: "Tailwind", size: "md", blue: true },
  { label: "Material UI", size: "sm", blue: true },
  { label: "Responsive", size: "sm", blue: true },
  { label: "Mobile-First Design", size: "sm", blue: true },
  { label: "Playwright", size: "sm", blue: true },
  { label: "Vitest", size: "xs", blue: true },
  { label: "Jest", size: "xs", blue: true },
  { label: "Docker", size: "xs", blue: true },
  { label: "SQL", size: "xs", blue: true },
  { label: "Git Version Control", size: "xs", blue: true },
  { label: "CI/CD", size: "xs", blue: true },
  { label: "SDLC", size: "xs", blue: true },
  { label: "RESTful API", size: "xs", blue: true },
  { label: "Figma", size: "xs", blue: true },
  { label: "Jira", size: "xs", blue: true },
];

const soft = [
  { label: "Communication", size: "lg", soft: true },
  { label: "Problem-solving", size: "lg", soft: true },
  { label: "Collaboration", size: "md", soft: true },
  { label: "Ownership", size: "md", soft: true },
];

function render(containerId, items) {
  const el = document.getElementById(containerId);
  items.forEach((item, i) => {
    const chip = document.createElement("span");
    const classes = ["chip", item.size];
    if (item.blue) classes.push("blue");
    if (item.soft) classes.push("soft");
    chip.className = classes.join(" ");
    chip.textContent = item.label;
    chip.style.animationDelay = `${i * 40}ms`;
    el.appendChild(chip);
  });
}

render("core", core);
render("secondary", secondary);
render("soft", soft);
