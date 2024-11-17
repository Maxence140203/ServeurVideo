document.getElementById("createRoom").addEventListener("click", () => {
    const roomCode = Math.random().toString(36).substr(2, 8);
    chrome.storage.local.set({ roomCode }, () => {
        alert(`Salle créée : ${roomCode}`);
    });
});

document.getElementById("joinRoom").addEventListener("click", () => {
    const roomCode = document.getElementById("roomCodeInput").value;
    if (roomCode) {
        chrome.storage.local.set({ roomCode }, () => {
            alert(`Rejoint la salle : ${roomCode}`);
        });
    } else {
        alert("Veuillez entrer un code de salle.");
    }
});
