const socket = io("http://localhost:3000"); // Remplace par l'URL de ton backend
let roomCode = null;

chrome.storage.local.get("roomCode", (result) => {
    roomCode = result.roomCode;
    if (roomCode) {
        socket.emit("join-room", roomCode);
    }
});

const video = document.querySelector("video");
if (video) {
    video.addEventListener("play", () => {
        if (roomCode) {
            socket.emit("video-action", { roomCode, action: "play", currentTime: video.currentTime });
        }
    });

    video.addEventListener("pause", () => {
        if (roomCode) {
            socket.emit("video-action", { roomCode, action: "pause", currentTime: video.currentTime });
        }
    });

    socket.on("sync-action", (data) => {
        if (data.action === "play") {
            video.currentTime = data.currentTime;
            video.play();
        } else if (data.action === "pause") {
            video.currentTime = data.currentTime;
            video.pause();
        }
    });
}
