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
