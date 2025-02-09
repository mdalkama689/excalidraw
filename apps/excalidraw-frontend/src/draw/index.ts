import React from "react";

let shapes = [];

export function initDraw(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  socket: WebSocket | null,
  roomId: string
) {
  if (!canvasRef.current) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let startX = 0;
  let startY = 0;
  let draw = false;

  const handleMouseDown = (e: MouseEvent) => {
    draw = true;
    startX = e.offsetX;
    startY = e.offsetY;
  };

  const handleMouseUp = (e: MouseEvent) => {
    draw = false;
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    const diagram = {
      x: startX,
      y: startY,
      width,
      height,
    };

   
    const message = {
      type: "chat",
      message: JSON.stringify(diagram),
      roomId: roomId,
    };
if(!socket) return

    socket.send(JSON.stringify(message));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draw) return;
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.strokeRect(startX, startY, width, height);
  };

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);

  socket?.addEventListener("message", (mess) => {
const data = JSON.parse(mess.data) 
console.log(data.x, data.y, data.width, data.height)
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "white";
ctx.strokeRect(data.x, data.y, data.width, data.height);
  });
}
