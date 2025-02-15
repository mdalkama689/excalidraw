import jwt from "jsonwebtoken";
import { config } from "dotenv";
config({ path: "../../.env" });

export const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret';
export const COOKIE_MAX_AGE = process.env.COOKIE_MAX_AGE || 86400000;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
export interface AuthReq extends Request {
  user: string | jwt.JwtPayload;
}
