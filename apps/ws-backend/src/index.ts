import { WebSocketServer } from "ws";
import jwt, { decode, Jwt, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { client } from "@repo/db/client";
const wss = new WebSocketServer({ port: 8080 });

let user: any = [];

async function verifyToken(token: any) {
  try {
    const decodeToken = await jwt.verify(token, JWT_SECRET);
    if (!decodeToken) {
      return null;
    }
    // @ts-ignore
    return decodeToken.userId;
  } catch (error) {
    return null;
  }
}

wss.on("connection", async (ws, req) => {
  console.log("new user connected");

  const url = req.url;
  if (!url) return;

  const queryParams = new URLSearchParams(url?.split("?")[1]);
  const token = queryParams.get("token");

  const userId = await verifyToken(token);

  if (!userId) {
    ws.close();
    return;
  }

  ws.on("message", async (data) => {
    const parsedData = JSON.parse(data.toString());
    console.log(" parsedData : ", parsedData);

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

      user.forEach((eachUser: any) => {
        if (eachUser.roomId == parsedData.roomId && eachUser.socket != ws) {
          eachUser.socket.send(JSON.stringify(parsedData.message));
        }
      });

    }

    if (parsedData.type === "leave_room") {
      user = user.filter((eachUser: any) => eachUser.socket !== ws);
    }

    if (parsedData.type === "erase") {

      await client.chat.delete({
        where: {
          diagramId: parsedData.id,
        },
      });
    
      user.forEach((eachUser: any) => {
        if (eachUser.roomId == parsedData.roomId && eachUser.socket != ws) {
          eachUser.socket.send(JSON.stringify(parsedData.id));
        }
      });
    
    }


  });
});
