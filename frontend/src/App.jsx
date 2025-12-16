
import React, { useState } from "react";
import { io } from "socket.io-client";
import PaintRoom from "./components/PaintRoom";
import "./App.css"; 

function App() {
  const [socket] = useState(() => io("http://localhost:4000"));
  const [roomCode, setRoomCode] = useState("");
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {
    if (!roomCode.trim()) return alert("Type a code !");
    socket.emit("join-room", { room: roomCode });
    setJoined(true);
  };

  if (!joined) {
    return (
      <div className="container">
        <h2 className="title">Enter a Room</h2>

        <input
          type="text"
          className="room-input"
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button className="enter-btn" onClick={joinRoom}>
          Enter
        </button>
      </div>
    );
  }

  return (
    <div className="canvas-wrapper">
      <PaintRoom roomCode={roomCode} socket={socket} />
    </div>
  );
}

export default App;
