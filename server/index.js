import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// connection

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  //join the room 
  socket.on("join-room", ({ room }) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  // send drawing
  socket.on("drawing", ({ room, path }) => {
    socket.to(room).emit("drawing", { path });
  });

  // clean drawing
  socket.on("clear-canvas", ({ room }) => {
    socket.to(room).emit("clear-canvas");
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
