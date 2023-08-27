 
 document.addEventListener('dblclick', function(event) {
    event.preventDefault();
}, { passive: false });

 // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB9JDvvT1ZOuw1Dsrp2JUtXhktdLZux8jA",
    authDomain: "nibbatrump-f8988.firebaseapp.com",
    databaseURL: "https://nibbatrump-f8988-default-rtdb.firebaseio.com",
    projectId: "nibbatrump-f8988",
    storageBucket: "nibbatrump-f8988.appspot.com",
    messagingSenderId: "655739447705",
    appId: "1:655739447705:web:af588ca2f3fc081e29cb08"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
// DOM elements
const image = document.getElementById("image");
const clickCountElement = document.getElementById("clickCount");

// Sound file
const audioSrc = "nigga.mp3";
// Create audio object
const audio = new Audio(audioSrc);
// Click count variable
let clickCount = 0;

// Event listener for image click
image.addEventListener("click", handleImageClick);

// Function to shrink image
function shrinkImage() {
  // Shrink image
  image.classList.add("shrink");

  // Remove shrink class after 0.3s
  setTimeout(() => {
    image.classList.remove("shrink");
  }, 300);
}

// Function to handle image click
function handleImageClick() {
  // Check if user is authenticated
 
    // Load current click count value
    db.ref("clicks")
      .once("value")
      .then((snapshot) => {
        const currentCount = snapshot.val() || 0;

        // Increment click count by 1
        const newCount = currentCount + 1;

        // Update click count display
        clickCountElement.textContent = `Nigga Count: ${newCount}`;
	
  // Play audio on click
  audio.play();

        // Shrink image
        shrinkImage();

        // Update global click count in Firebase
        db.ref("clicks").transaction((currentValue) => {
          // Ensure that the new count is not lower than the current value
          if (newCount > currentValue) {
            return newCount;
          } else {
            // Return undefined to abort the transaction
            return;
          }
        });
      });
  
}

// Listen for changes to global click count in Firebase
db.ref("clicks").on("value", (snapshot) => {
  clickCount = snapshot.val() || 0;
  clickCountElement.textContent = `Nigga Count: ${clickCount}`;
});
