import express from 'express';
import { Server } from 'socket.io';
import { createServer} from 'http';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
})

function generateRandomID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }

const players = [];
console.log(players)

app.get("/", (req, res) => {
    res.send("Hello from Server!")
})

io.on("connection", (socket) => {
    console.log("Player connected -", socket.id)

    socket.on("player-joined", playerName => {
        players.push({
            id: generateRandomID(12), 
            name: playerName, 
            ready: false, 
            socketId: socket.id
        })
        console.log(playerName + "  joined the server")
        io.emit("new-player-list", players)
    })

    socket.on("update-player", player => {
        const newPlayers = players.map(item => {
            if(item.id === player.id){
                return player
            } return item
        });
        players.length = 0;
        players.push(...newPlayers)  
        io.emit("new-player-list", players)
    })

    socket.on("disconnect", () => {
        console.log("Player Disconnected -" + socket.id)
    })
})

server.listen(5000, () => {
    console.log("Server is listening to PORT 5000")
})