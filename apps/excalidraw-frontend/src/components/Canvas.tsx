
import { Game } from "@/draw/Game";
import { useEffect, useRef } from "react";

export default function Canvas({
  socket,
  roomId,
}: {
  socket: WebSocket | null;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
   
    if(!canvasRef.current) return
    if(!socket) return

  const game = new Game(canvasRef.current, socket, roomId)
  return () => {
    game.destroyHandler()
  }

  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      height={100}
      width={100}
      className="border border-white"
    ></canvas>
  );
}
