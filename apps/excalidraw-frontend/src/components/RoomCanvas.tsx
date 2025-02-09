'use client'

import { useEffect, useState } from "react";
import Canvas from "./Canvas"; 

export default function RoomCanVas({roomId}: {roomId: string}) {

const [socket, setSocket] = useState<WebSocket | null> (null)
useEffect(() => {

  const token = localStorage.getItem("token");
  if (!token) {
    console.log("token not found");
    return;
  }

  const ws = new WebSocket(`ws:localhost:8080/?token=${token}`);
  ws.onopen = () => {
    const joinMessage = {
      type: "join_room",
      roomId,
    };
    setSocket(ws);
    ws.send(JSON.stringify(joinMessage));
  };

  return () => {
    socket?.close();
  };

},[])
  if(!socket){
    return (
      <div>connecting to server........ </div>
    )
  }

  
  return (
  <Canvas 
  roomId={roomId}
  socket={socket}
  />
  );
}
