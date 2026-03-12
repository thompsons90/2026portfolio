// * This is to play the audio when the icon is clicked.
// const audio = new Audio("/sounds/noise_to_tuning.mp3");

// document.getElementById("rotateIcon").addEventListener("click", () => {
//   audio.currentTime = 0; // rewind to start on each click
//   audio.play();
// });

// const icon = document.getElementById("rotateIcon");

// icon.addEventListener("click", () => {
//   icon.stop();
//   icon.play();
// });

// * This is to play the audio when the icon is clicked.
const audio = new Audio("/sounds/noise_to_tuning.mp3");

document.getElementById("rotateIcon").addEventListener("click", () => {
  audio.currentTime = 0; // rewind to start on each click
  audio.play();
});

const icon = document.getElementById("rotateIcon");
const headerText = document.getElementById("headerText");
const fullText = "Cutting the noise to build what matters.";
const charDelay = 2000 / fullText.length;
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

// trigger on click
icon.addEventListener("click", triggerReveal);

// trigger on any key press
document.addEventListener("keydown", triggerReveal);
// icon.addEventListener("click", () => {
//   if (hasPlayed) return;
//   hasPlayed = true;

//   icon.stop();
//   icon.play();

//   setTimeout(() => {
//     headerText.classList.add("visible");

//     let charIndex = 0;
//     const typeInterval = setInterval(() => {
//       if (charIndex < fullText.length) {
//         headerText.textContent += fullText[charIndex];
//         charIndex++;
//       } else {
//         clearInterval(typeInterval);
//       }
//     }, charDelay);
//   }, 9000);
// });
