import axios from "axios";
import React from "react";
import { HTTP_BACKEND } from "../../config";

let shapes = [];

const getAllDiagram = async (roomId: string) => {
  try {
    const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data.allChats;
  } catch (error) {
    console.log(error);
  }
};

export async function initDraw(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  socket: WebSocket | null,
  roomId: string
) {
  const allDiagram = await getAllDiagram(roomId);
  shapes = [...allDiagram];

  
  if (!canvasRef.current) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  printAllExistingDiagram(ctx, canvas);
  let startX = 0;
  let startY = 0;
  let draw = false;

  const handleMouseDown = (e: MouseEvent) => {
    draw = true;
    startX = e.offsetX;
    startY = e.offsetY;
    console.log("mouse down ");
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
    console.log("mouse up"); 
    if (!socket) return;

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

 
  if (!socket) return;

  socket.addEventListener("message", (mess) => {
    const data = JSON.parse(mess.data);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.strokeRect(data.x, data.y, data.width, data.height);
  });

 

}

function printAllExistingDiagram(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  shapes.map((shape) => {
    const parsedData = JSON.parse(shape.text);
   
    // ctx.clearRect(0,0, canvas.width, canvas.height)
    ctx.strokeStyle = "white";
    ctx.strokeRect(
      parsedData.x,
      parsedData.y,
      parsedData.width,
      parsedData.height
    );
  });
}
