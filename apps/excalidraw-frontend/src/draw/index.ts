import axios from "axios";
import React from "react";
import { HTTP_BACKEND } from "../../config";

const getAllDiagram = async (roomId: string) => {
  try {
    const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
return response.data.allChats
  } catch (error) {
    console.log(error);
  }
};

let allShapes = []

export async function initDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>,
socket: WebSocket | null,
roomId: string 
) {
  if(!socket) return
  if (!canvasRef.current) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const response = await getAllDiagram(roomId)
  allShapes = [...response]

  clearAndPrintDiagram(ctx, canvas)

  let startDraw = false;
  let startX = 0;
  let startY = 0;

  const handleMouseDown = (e: MouseEvent) => {
    console.log("mouse down");
    startDraw = true;
    startX = e.offsetX;
    startY = e.offsetY;
  };
  const handleMouseUp = (e: MouseEvent) => {
    console.log("mouseup");
    startDraw = false;
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    const diagram = {
      type: "rect",
      x: startX,
      y: startY,
      height,
      width, 
    }
    const message = {
      type: "chat",
      message: diagram,
      roomId 
    }

    socket.send(JSON.stringify(message))
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!startDraw) return;

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.strokeRect(startX, startY, width, height);
  };

const handleRecievingData = (e: MessageEvent) => {
const data = JSON.parse(e.data)

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "white";
ctx.strokeRect(data.x, data.y, data.width, data.height);
}

  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);

  socket.addEventListener("message", handleRecievingData)


  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
    socket.removeEventListener("message", handleRecievingData)

  };
}

// diagram:{x: 98, y: 76, type: 'rect', width: 169, height: 142
// just to access x , we need to go .diagram.x.

function clearAndPrintDiagram(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement){

  ctx.clearRect(0,0,canvas.width, canvas.height)
  ctx.strokeStyle = "red"
  allShapes.map((shape) => {
const data = shape.diagram
   ctx.strokeRect(data.x, data.y, data.width, data.height)
  })
}