const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Gestion des salles
const rooms = {};

io.on("connection", (socket) => {
    console.log("Un utilisateur s'est connecté");

    // Création d'une salle
    socket.on("create-room", () => {
        const roomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        rooms[roomCode] = { users: [] }; // Initialisation de la salle
        socket.join(roomCode); // L'utilisateur rejoint la salle
        rooms[roomCode].users.push(socket.id); // Ajout de l'utilisateur à la salle
        socket.emit("room-created", { roomCode }); // Envoie le code au créateur
        console.log(`Salle créée : ${roomCode}`);
    });

    // Rejoindre une salle
    socket.on("join-room", (roomCode) => {
        if (rooms[roomCode]) {
            socket.join(roomCode);
            rooms[roomCode].users.push(socket.id);
            socket.emit("room-joined", { roomCode });
            console.log(`Utilisateur rejoint la salle : ${roomCode}`);
        } else {
            socket.emit("error", { message: "Salle non trouvée" });
        }
    });

    // Gestion des actions vidéo (play/pause)
    socket.on("video-action", (data) => {
        const { roomCode, action, currentTime } = data;
        if (rooms[roomCode]) {
            socket.to(roomCode).emit("sync-action", { action, currentTime });
            console.log(`Action relayée dans la salle ${roomCode} : ${action} à ${currentTime}s`);
        }
    });

    // Déconnexion d'un utilisateur
    socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté");
        for (const roomCode in rooms) {
            const index = rooms[roomCode].users.indexOf(socket.id);
            if (index !== -1) {
                rooms[roomCode].users.splice(index, 1);
                if (rooms[roomCode].users.length === 0) {
                    delete rooms[roomCode]; // Supprimer la salle si elle est vide
                    console.log(`Salle supprimée : ${roomCode}`);
                }
                break;
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Serveur en écoute sur le port ${PORT}`);
});
