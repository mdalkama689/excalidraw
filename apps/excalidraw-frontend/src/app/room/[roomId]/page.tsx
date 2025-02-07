"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function Room() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { roomId } = useParams();
const [allChats, setAllChats] = useState([])

  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem("token");

    const wss = new WebSocket(`ws://localhost:8080?token=${token}`);

    const data = {
      type: "join_room",
      roomId,
    };
    wss.onopen = () => {
      setSocket(wss);
      wss.send(JSON.stringify(data));
    };
  }, []);

  useEffect(() => {
socket?.addEventListener('message', (data) => {
setAllChats((prev) => (({
    ...prev,
    allChats: data.data
})))
})
  }, [socket])
  


  if (!socket) {
    return <div>connecting to the server....</div>;
  }

  const handleSendMessage =async (e) => {
    try {
        const data = {
            type: "chat",
            roomId,
            message
          };
        socket.send(JSON.stringify(data))
    } catch (error) {
        console.log(error)
    }
  }

  console.log(allChats)

  return <div className="h-screen w-full flex items-center justify-center flex-col">
  <input type="text"
  className="bg-black text-white"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  />
  <button onClick={handleSendMessage}> Send </button>

{allChats.map((mes) => (
    <p>{mes}</p>
))}

     </div>;
}
