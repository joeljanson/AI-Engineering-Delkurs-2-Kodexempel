// script.js

// Initialize Tone.js components
const synth = new Tone.Synth().toDestination();
const drums = new Tone.MembraneSynth().toDestination();

const volume = new Tone.Volume(0).toDestination(); // Initial volume is 0
Tone.Destination.volume.value = Tone.gainToDb(0.5);

let isPlaying = false;
let currentSound = null;

// Function to play sound based on selected sound type
function playSound(soundType) {
	stopSound(); // Stop any currently playing sound

	switch (soundType) {
		case "synth":
			currentSound = synth;
			synth.triggerAttackRelease("C4", "8n");
			break;
		case "drums":
			currentSound = drums;
			drums.triggerAttackRelease("C2", "8n");
			break;
		default:
			console.log("Unknown sound type");
			return;
	}

	startVisualizer();
	isPlaying = true;
}

// Function to stop sound
function stopSound() {
	if (currentSound) {
		currentSound.triggerRelease();
	}
	stopVisualizer();
	isPlaying = false;
}

// Function to update volume
function updateVolume(volumeValue) {
	Tone.Destination.volume.value = Tone.gainToDb(volumeValue);
}

// Function to handle visualizer animation
function startVisualizer() {
	const visualizer = document.getElementById("visualizer");
	visualizer.classList.add("active");
}

function stopVisualizer() {
	const visualizer = document.getElementById("visualizer");
	visualizer.classList.remove("active");
}

// Event listeners:
document.getElementById("play-button").addEventListener("click", function () {
	const selectedSound = document.getElementById("sound-select").value;
	if (isPlaying) {
		stopSound();
	} else {
		playSound(selectedSound);
	}
});

document.getElementById("volume-slider").addEventListener("input", function () {
	const volumeValue = parseFloat(this.value);
	updateVolume(volumeValue);
});

document.getElementById("sound-select").addEventListener("change", function () {
	// Handle sound selection change if needed
});
