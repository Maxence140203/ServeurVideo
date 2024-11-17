const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
    console.log("Un utilisateur s'est connecté");

    socket.on("join-room", (roomCode) => {
        socket.join(roomCode);
        console.log(`Utilisateur a rejoint la salle : ${roomCode}`);
    });

    socket.on("video-action", (data) => {
        io.to(data.roomCode).emit("sync-action", data);
    });

    socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté");
    });
});

server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
