"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios, { all } from "axios";
import { HTTP_BACKEND } from "../../../../config";

export default function Room() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { roomId } = useParams();
  const [allChats, setAllChats] = useState([]);

  const [message, setMessage] = useState("");

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

    getAllChat();
  }, []);

  useEffect(() => {
    socket?.addEventListener("message", (data) => {
      console.log(data);
      setAllChats((prev) => [...prev, { text: data.data }]);
    });
  }, [socket]);

  const getAllChat = async () => {
    try {
      const response = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setAllChats(response.data.allChats);
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    }
  };

  console.log("all set chat  : ", allChats);
  if (!socket) {
    return <div>connecting to the server....</div>;
  }

  const handleSendMessage = async (e) => {
    try {
      const data = {
        type: "chat",
        roomId,
        message,
      };
      socket.send(JSON.stringify(data));

      setAllChats((prev) => [...prev, { text: message }]);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(allChats);

  allChats.map((mess, index) => {
    // console.log(JSON.stringify(mess))
    console.log(index);
  });
  return (
    <div className="h-screen w-full flex items-center justify-center flex-col">
      <input
        type="text"
        className="bg-black text-white"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}> Send </button>

      <div>
        {allChats.map((mess, index) => (
          <p key={index}>{JSON.stringify(mess.text)}</p>
        ))}
      </div>
    </div>
  );
}
