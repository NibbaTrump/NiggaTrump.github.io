// DOM elements
const image = document.getElementById("image");
const clickCountElement = document.getElementById("clickCount");

// Sound file
const audioSrc = "nigga.mp3";

// Click count variable
let clickCount = 0;

// Event listener for image click
image.addEventListener("click", handleImageClick);

// Function to play sound and shrink image
function handleImageClick() {
  // Increase click count
  clickCount++;
  
  // Update click count display
  clickCountElement.textContent = `Nigga Counter: ${clickCount}`;
  
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