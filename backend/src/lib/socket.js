import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === "production" 
            ? ["http://localhost", "http://localhost:80"] 
            : "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST"]
    },
    transports: ['websocket', 'polling'],  // Allow both with websocket preferred
    pingTimeout: 60000,
    pingInterval: 25000
})

export function getReceiverSocketId(userId) {
    return userSocketMap[userId]
}

//used to store online users
const userSocketMap = {} // {userId: socketId}

io.on("connection", (socket) => {
    console.log("user connected", socket.id);

    const userId = socket.handshake.query.userId;

    if(userId){
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})

export {io, app, server}