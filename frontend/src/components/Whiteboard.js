import React, { useRef, useEffect, useState } from 'react';
import { socketEvents } from '../utils/socket';
import './Whiteboard.css';

function Whiteboard({ socket, userId }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(3);
  const [context, setContext] = useState(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setContext(ctx);
    }
  }, []);

  // Listen for whiteboard updates from other users
  useEffect(() => {
    if (!socket) return;

    socket.on(socketEvents.WHITEBOARD_UPDATE, (data) => {
      if (data.userId !== userId && context) {
        drawLine(context, data.x0, data.y0, data.x1, data.y1, data.color, data.size);
      }
    });

    socket.on(socketEvents.WHITEBOARD_CLEARED, () => {
      if (context) {
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    });

    return () => {
      socket.off(socketEvents.WHITEBOARD_UPDATE);
      socket.off(socketEvents.WHITEBOARD_CLEARED);
    };
  }, [socket, userId, context]);

  const drawLine = (ctx, x0, y0, x1, y1, lineColor, lineSize) => {
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !context || !socket) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawLine(context, x, y, x + 1, y + 1, color, brushSize);

    socket.emit(socketEvents.WHITEBOARD_DRAW, {
      x0: x,
      y0: y,
      x1: x + 1,
      y1: y + 1,
      color,
      size: brushSize,
      userId
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearBoard = () => {
    if (context) {
      context.fillStyle = '#000';
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      socket?.emit(socketEvents.WHITEBOARD_CLEAR, { userId });
    }
  };

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-tools">
        <div className="tool-group">
          <label>Color:</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="color-picker"
          />
        </div>

        <div className="tool-group">
          <label>Brush Size: {brushSize}px</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="slider"
          />
        </div>

        <button onClick={clearBoard} className="clear-btn">
          Clear Board
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="whiteboard-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}

export default Whiteboard;
