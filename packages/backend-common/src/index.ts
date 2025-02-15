import { config } from "dotenv";
config({ path: "../../.env" });

export const JWT_SECRET = process.env.JWT_SECRET || 'jwtsecret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000'
export const PORT = process.env.PORT || 8000 
