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

    return response.data.allChats;
  } catch (error) {
    console.log(error);
  }
};

export function initDraw(canvasRef: React.RefObject<HTMLCanvasElement | null>,
socket: WebSocket | null
) {
  if (!canvasRef.current) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

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
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!startDraw) return;

    const width = e.offsetX - startX;
    const height = e.offsetY - startY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.strokeRect(startX, startY, width, height);
  };



  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mouseup", handleMouseUp);
  canvas.addEventListener("mousemove", handleMouseMove);


  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
    

  };
}
