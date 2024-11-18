const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Permet toutes les origines
        methods: ["GET", "POST"],
    },
});

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
    console.log("Nouvelle connexion WebSocket");

    socket.on("join-room", (data) => {
        console.log(`Rejoindre la salle : ${data.roomCode}`);
        socket.join(data.roomCode);
    });

    socket.on("video-action", (data) => {
        console.log(`Action reçue : ${data.action} pour la salle ${data.roomCode}`);
        io.to(data.roomCode).emit("sync-action", data);
    });

    socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté");
    });
});

server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
