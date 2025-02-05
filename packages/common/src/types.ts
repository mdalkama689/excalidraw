import {z} from 'zod'

export const signUpSchema=  z.object({
    username: z.string(),
    password: z.string(), 
    name: z.string().optional()
})
 export const signInSchema=  z.object({
    username: z.string(),
    password: z.string(), 
})

export const createRoomSchema=  z.object({
   roomName: z.string()
})


