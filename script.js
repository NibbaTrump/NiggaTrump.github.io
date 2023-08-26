// DOM elements
const image = document.getElementById("image");

// Sound file
const audioSrc = "nigga.mp3"; // Replace with actual path to your audio file

// Event listener for image click
image.addEventListener("click", playSound);

// Function to play sound and shrink image
function playSound() {
  // Shrink image
  image.classList.add("shrink");
  
  // Create audio object
  const audio = new Audio(audioSrc);

  // Play audio on click
  audio.play();

  // Wait for audio to finish, then restore image size
  audio.onended = function() {
    image.classList.remove("shrink");
  };
}