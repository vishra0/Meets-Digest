const socket = io(); //connect to server

const startBtn = document.getElementById("start-btn");
const trascription = document.getElementById("transcription");

startBtn.addEventListener("click" , () => {
    trascription.innerHTML("Transcribing live Audio");
    socket.emit("audio-data", "This is a test transcription from audio.");
});

socket.on("summary", (summary) => {
  trascription.innerHTML = `<h2>Summary:</h2><p>${summary}</p>`;
});