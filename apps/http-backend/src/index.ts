import {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CLIENT_URL,
  PORT,
} from "@repo/backend-common/config";
import express, { Request, Response } from "express";
import {
  signInSchema,
  signUpSchema,
  createRoomSchema,
} from "@repo/common/types";
import { client } from "@repo/db/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware, AuthReq } from "./middleware";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.post("/signup", async (req: Request, res: Response) => {
  try {
    const parsedData = signUpSchema.safeParse(req.body);

    if (!parsedData.success) {
      res.status(400).json({
        success: false,
        message: "Incorrect inputs!",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

    const userExist = await client.user.findFirst({
      where: {
        username: parsedData.data.username,
      },
    });
    if (userExist) {
      res.status(400).json({
        success: false,
        message: "Username already exists!",
      });
      return;
    }
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      success: true,
      message: "Signup successfully!",
      user,
    });

    return;
  } catch (error) {
    console.log("Error : ", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong!",
    });
    return;
  }
});

app.post("/signin", async (req: Request, res: Response) => {
  try {
    const parsedData = signInSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({
        success: false,
        message: "Incorrect input!",
      });
    }

    const user = await client.user.findFirst({
      where: {
        username: parsedData.data?.username,
      },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials!",
      });
      return;
    }
    if (!parsedData.data?.password) return;
    const isPasswordCorrect = await bcrypt.compare(
      parsedData.data?.password,
      user?.password
    );

    if (!isPasswordCorrect) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials!",
      });
      return;
    }

    const userId = user.id;

    const token = await jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: Number(JWT_EXPIRES_IN),
    });

    res.status(200).json({
      success: true,
      message: "Sigin successsfully!",
      token,
    });
    return;
  } catch (error) {
    console.log("Error : ", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong!",
    });
    return;
  }
});

app.post(
  "/create-room",
  authMiddleware,
  async (req: AuthReq, res: Response) => {
    try {
      const parsedData = createRoomSchema.safeParse(req.body);

      if (!parsedData.success) {
        res.status(400).json({
          success: false,
          message: "Incorrect input!",
        });
        return;
      }
      if (!req.user) return;
      const userId = req.user.userId;
      const room = await client.room.create({
        data: {
          roomName: parsedData.data?.roomName,
          userId: Number(userId),
        },
      });
      res.status(200).json({
        success: true,
        message: "Room create successfully!",
        room,
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Incorrect input!",
      });
    }
  }
);

app.get(
  "/chats/:roomId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const roomId = req.params.roomId;
      if (!roomId) {
        res.status(400).json({
          success: false,
          message: "Please give roomID",
        });
      }

      const allChats = await client.chat.findMany({
        where: {
          roomId: Number(roomId),
        },
        select: {
          diagram: true,
        },
      });
      res.status(200).json({
        success: true,
        allChats,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
);

app.post("/check-room", authMiddleware, async (req: Request, res: Response) => {
  try {
    const roomId = req.body.roomId;

    if (!roomId) {
      res.status(400).json({
        success: false,
        message: "Please enter room id!",
      });
      return;
    }

    const room = await client.room.findFirst({
      where: {
        id: Number(roomId),
      },
    });

    if (!room) {
      res.status(400).json({
        success: false,
        message: "Room does not exists!",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Room is available!",
      room,
    });
    return;
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
    return;
  }
});

app.listen(PORT, () => {
  console.log("running");
});
