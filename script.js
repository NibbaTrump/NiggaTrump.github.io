 
 document.addEventListener('dblclick', function(event) {
    event.preventDefault();
}, { passive: false });
var executed = false;
var special = false;
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
var audioFile = 'nigga.mp3';

class WebAudioPlayer {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
  }

  playAudio(url) {
    const source = this.context.createBufferSource();
    this.getSource(url, (buffer) => {
      source.buffer = buffer;
      source.connect(this.context.destination);
      source.start(0);
    });
  }

  getSource(url, callback) {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = () => {
      this.context.decodeAudioData(request.response, callback);
    };

    request.send();
  }
}

const player = new WebAudioPlayer();

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
 
	if(special){
			image.src = 'nigga.jpg';
			audioFile = 'nigga.mp3';
			special = false;
	}
 
    // Load current click count value
    db.ref("clicks")
      .once("value")
      .then((snapshot) => {
        const currentCount = snapshot.val() || 0;

        // Increment click count by 1
        const newCount = currentCount + 1;

        // Update click count display
        clickCountElement.textContent = `Nigga Count: ${newCount}`;
		
		if (newCount % 100 == 0){				
			image.src = 'nigga2.jpg';
			audioFile = 'nigga2.mp3';
			special = true;
		}
		
		// Create audio object
		player.playAudio(audioFile);
 
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
function getSource(url, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = function() {
    context.decodeAudioData(request.response, callback);
  };

  request.send();
}


// Listen for changes to global click count in Firebase
db.ref("clicks").on("value", (snapshot) => {
  clickCount = snapshot.val() || 0;
  clickCountElement.textContent = `Nigga Count: ${clickCount}`;
});
