import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

function PaintRoom({ roomCode, socket }) {
  const canvasRef = useRef(null);

  const [canvas, setCanvas] = useState(null);
  const [brushColor, setBrushColor] = useState("black");
  const [brushWidth, setBrushWidth] = useState(3);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const c = new fabric.Canvas(canvasRef.current, {
      width: 300,
      height: 260,
      isDrawingMode: true,
    });

    c.freeDrawingBrush = new fabric.PencilBrush(c);
    c.freeDrawingBrush.color = brushColor;
    c.freeDrawingBrush.width = brushWidth;

    setCanvas(c);

    const handleLocalPath = (event) => {
      const pathData = event.path.toObject(["path"]);
      if (socket) {
        socket.emit("drawing", { room: roomCode, path: pathData });
      }
    };

    c.on("path:created", handleLocalPath);

    const handleDrawing = ({ path }) => {
      const obj = fabric.util.object.clone(path);

      const { path: pathArray, ...options } = obj;

      const fabricPath = new fabric.Path(pathArray, options);
      c.add(fabricPath);
      c.renderAll();
    };

    if (socket) socket.on("drawing", handleDrawing);

    return () => {
      c.off("path:created", handleLocalPath);
      if (socket) socket.off("drawing", handleDrawing);

      c.dispose();
      setCanvas(null);
    };
  }, [roomCode, socket]);

  // Clear canvas listener
  useEffect(() => {
    if (!canvas || !socket) return;

    const handleClear = () => {
      canvas.clear();
    };

    socket.on("clear-canvas", handleClear);

    return () => {
      socket.off("clear-canvas", handleClear);
    };
  }, [canvas, socket]);

  // brush color
  useEffect(() => {
    if (canvas) canvas.freeDrawingBrush.color = brushColor;
  }, [brushColor, canvas]);

  // brush width 
  useEffect(() => {
    if (canvas) canvas.freeDrawingBrush.width = brushWidth;
  }, [brushWidth, canvas]);

  return (
    <div style={{ padding: 10, width: 340 }}>
      <h2>Room: {roomCode}</h2>


      <div style={{ marginBottom: 10 }}>
        {["black", "red", "blue", "green", "purple"].map((color) => (
          <button
            key={color}
            onClick={() => setBrushColor(color)}
            style={{
              backgroundColor: color,
              width: 25,
              height: 25,
              marginRight: 8,
              borderRadius: 6,
              border: brushColor === color ? "2px solid #000" : "none",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <div style={{ marginBottom: 10 }}>
        {[2, 4, 6, 8, 10].map((size) => (
          <button
            key={size}
            onClick={() => setBrushWidth(size)}
            style={{
              marginRight: 5,
              padding: "5px",
              border: brushWidth === size ? "2px solid #000" : "1px solid #888",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 20,
                height: size,
                background: "#000",
                margin: "auto",
              }}
            />
          </button>
        ))}

        <button
          onClick={() => {
            if (!canvas) return;
            canvas.clear();
            socket.emit("clear-canvas", { room: roomCode });
          }}
          style={{ marginLeft: 10, padding: "5px 10px", cursor: "pointer" }}
        >
          Clear
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{ border: "1px solid #000", touchAction: "none" }}
      />
    </div>
  );
}

export default PaintRoom;

