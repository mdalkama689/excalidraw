"use client";

import { useContext, useEffect, useState } from "react";
import Canvas from "./Canvas";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
export default function RoomCanVas({ roomId }: { roomId: string }) {
  const router = useRouter();

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const auth = useContext(AuthContext);
  if (!auth) return;
  const { isAuthenticated, loading } = auth;

  useEffect(() => {
    const token = localStorage.getItem("token");

    const ws = new WebSocket(`ws://localhost:8080/?token=${token}`);

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
  }, []);

  if (loading) {
    return <p>loading........ </p>;
  }
  if (!isAuthenticated) {
    router.push("/signin");
  }

  if (!socket) {
    return <div>connecting to server........ </div>;
  }

  return <Canvas roomId={roomId} socket={socket} />;
}
