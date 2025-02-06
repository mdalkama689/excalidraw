import jwt from 'jsonwebtoken'
export const JWT_SECRET =  "secret"
export interface AuthReq extends Request {
    user: string | jwt.JwtPayload
}