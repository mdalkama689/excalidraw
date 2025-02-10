import { WebSocketServer } from "ws";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { client } from "@repo/db/client";
const wss = new WebSocketServer({ port: 8080 });

let user = [];

async function verifyToken(token) {
  try {
    const decodeToken = await jwt.verify(token, JWT_SECRET);
    if (!decodeToken) {
      return null;
    }

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

console.log(" parsedData.message : ", parsedData.message)
    if (parsedData.type === "chat") {

      user.forEach((eachUser) => {
        if (eachUser.roomId == parsedData.roomId && eachUser.socket != ws) {
          eachUser.socket.send(JSON.stringify(parsedData.message))
        }
      });
  
    
     await client.chat.create({
        data: {
          roomId: Number(parsedData.roomId),
          userId,
          diagram: parsedData.message 
        }
      })


    }

    if (parsedData.type === "leave_room") {
      user = user.filter((eachUser) => eachUser.socket !== ws);
    }


  });
});
