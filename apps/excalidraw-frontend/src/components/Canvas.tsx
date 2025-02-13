
import { Game } from "@/draw/Game";
import { useEffect, useRef, useState } from "react";
import { IconBar } from "./IconBar";

export default function Canvas({
  socket,
  roomId,
}: {
  socket: WebSocket | null;
  roomId: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
const [selectedTool, setSelectedTool] = useState('circle')
const [game, setGame] = useState(null)


const handleSelectTool = (type: string) => {
setSelectedTool(type)
}

useEffect(() => {
if(game){
  game.setTool(selectedTool)
}
}, [selectedTool,game])
  useEffect(() => {
   
    if(!canvasRef.current) return
    if(!socket) return

  const g = new Game(canvasRef.current, socket, roomId, selectedTool)

setGame(g)
  return () => {
    g.destroyHandler()
  }

  }, [canvasRef]);

  return (
  <div
  className="h-screen overflow-hidden"
  >
      <canvas
      ref={canvasRef}
      height={window.innerHeight}
      width={window.innerWidth}
    ></canvas>
    <IconBar 
    onClick={handleSelectTool} 
    selectedTool={selectedTool}
    />
  </div>
  );
}
