import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { client } from "@repo/db/client";
const wss = new WebSocketServer({ port: 8080 });

interface UserProps {
  socket: WebSocket;
  roomId: string;
  userId: string;
}

let user: UserProps[] = [];

async function verifyToken(token: string) {
  try {
    const decodeToken = await jwt.verify(token, JWT_SECRET);
    if (!decodeToken) {
      return null;
    }

    return decodeToken?.userId;
  } catch (error) {
    return null;
  }
}

wss.on("connection", async (ws: WebSocket, req) => {
  console.log("new user connected");

  const url = req.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url?.split("?")[1]);
  const token = queryParams.get("token");

  if (!token) {
    ws.close();
    return;
  }
  const userId = await verifyToken(token);

  if (!userId) {
    ws.close();
    return;
  }

  ws.on("message", async (data) => {
    const parsedData = JSON.parse(data.toString());


    if (parsedData.type === "join_room") {
      user.push({
        socket: ws,
        roomId: parsedData.roomId,
        userId,
      });
    }

    if (parsedData.type === "chat") {
      await client.chat.create({
        data: {
          roomId: Number(parsedData.roomId),
          userId,
          diagram: parsedData.message,
          diagramId: parsedData.message.id,
        },
      });

      user.forEach((eachUser) => {
        if (eachUser.roomId == parsedData.roomId && eachUser.socket != ws) {
          eachUser.socket.send(JSON.stringify(parsedData.message));
        }
      });
    }

    if (parsedData.type === "leave_room") {
      user = user.filter((eachUser) => eachUser.socket !== ws);
    }

    if (parsedData.type === "erase") {
      await client.chat.delete({
        where: {
          diagramId: parsedData.id,
        },
      });

      user.forEach((eachUser) => {
        if (eachUser.roomId == parsedData.roomId && eachUser.socket != ws) {
          eachUser.socket.send(JSON.stringify(parsedData.id));
        }
      });
    }
  });
});
