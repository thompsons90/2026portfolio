// Device detection - only run interactive features on tablet+ (≥641px)
const isDesktop = window.innerWidth > 640;

// * This is to play the audio when the icon is clicked.
const audio = new Audio("/sounds/noise_to_tuning.mp3");

const icon = document.getElementById("rotateIcon");
const headerText = document.getElementById("headerText");
const fullText = "Cutting the noise to build what matters.";
const charDelay = 2500 / fullText.length;
let hasPlayed = false;

const triggerReveal = () => {
  if (hasPlayed) return;
  hasPlayed = true;

  icon.stop();
  icon.play();
  audio.currentTime = 0;
  audio.play();

  setTimeout(() => {
    let charIndex = 0;
    headerText.textContent = "";
    headerText.classList.add("visible");

    const typeInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        headerText.textContent += fullText[charIndex];
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, charDelay);
  }, 5000);
};

// Show navbar after scrolling past animation section
const navbarContainer = document.querySelector(".navbar-container");
const mobileNav = document.getElementById("mobile-nav");
const animationWrapper = document.querySelector(".animation-wrapper");

const handleScroll = () => {
  const animationHeight = animationWrapper.offsetHeight;
  const scrollPosition = window.scrollY;

  if (scrollPosition > animationHeight - 100) {
    navbarContainer?.classList.add("visible");
    mobileNav?.classList.add("visible");
  } else {
    navbarContainer?.classList.remove("visible");
    mobileNav?.classList.remove("visible");
  }
};

window.addEventListener("scroll", handleScroll);

// Only add event listeners if on desktop (≥641px) and elements exist
if (isDesktop && icon) {
  icon.addEventListener("click", () => {
    audio.currentTime = 0;
    audio.play();
  });

  icon.addEventListener("click", triggerReveal);
  document.addEventListener("keydown", triggerReveal);
}

// ** Highlights & Popup Portfolio Section **
(function () {
  "use strict";

  var overlay = document.getElementById("hl-modal-overlay");
  var modal = document.getElementById("hl-modal");
  var prevFocus = null;

  /* All focusable elements inside the modal */
  function getFocusable() {
    return Array.from(
      modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  /* Open */
  window.hlModalOpen = function () {
    prevFocus = document.activeElement;
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";

    /* Focus the close button after animation */
    setTimeout(function () {
      var focusable = getFocusable();
      if (focusable.length) focusable[0].focus();
    }, 320);
  };

  /* Close */
  window.hlModalClose = function () {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    if (prevFocus) prevFocus.focus();
    /* Reset scroll position for next open */
    setTimeout(function () {
      document.getElementById("hl-modal-body").scrollTop = 0;
    }, 300);
  };

  /* Close on overlay backdrop click */
  window.hlOverlayClick = function (e) {
    if (e.target === overlay) hlModalClose();
  };

  /* Keyboard: Escape to close, Tab trap inside modal */
  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("is-open")) return;

    if (e.key === "Escape") {
      hlModalClose();
      return;
    }

    if (e.key === "Tab") {
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
    }
  });
})();
