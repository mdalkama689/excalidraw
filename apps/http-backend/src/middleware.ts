import { JWT_SECRET, AuthReq } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
  req: AuthReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      res.status(400).json({
        success: false,
        message: "Unauthorized, Please login to continue",
      });
      return;
    }

    const decodeToken = await jwt.verify(token, JWT_SECRET);

    req.user = decodeToken;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized, Please login to continue",
    });
  }
};
