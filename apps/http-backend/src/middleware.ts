import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedTokenProps extends JwtPayload {
  userId: string;
}
export interface AuthReq extends Request {
  user?: DecodedTokenProps;
}
export const authMiddleware = async (
  req: AuthReq,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      res.status(400).json({
        success: false,
        message: "Unauthorized, Please login to continue!",
      });
      return;
    }

    const decodeToken = (await jwt.verify(
      token,
      JWT_SECRET
    )) as DecodedTokenProps;

    req.user = decodeToken;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized, Please login to continue",
    });
  }
};
