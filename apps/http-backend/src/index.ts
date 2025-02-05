import {JWT_SECRET} from '@repo/backend-common/config'
import express, {Request, Response} from 'express'
import {signInSchema, signUpSchema, createRoomSchema} from "@repo/common/types"
import { client } from '@repo/db/client'
import bcrypt from 'bcrypt'

const app = express()

app.post('/signup', async (req: Request, res: Response) => {

    try {
        
        const parsedData = signUpSchema.safeParse(req.body)
        if(!parsedData.success){
            res.status(400).json({
                success: false,
                message: "Incorrect inputs!"
            })
            return
        }

        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10)

        const userExist = await client.user.findFirst({
            where :{
                username: parsedData.data.username
            }
        })
        if(userExist){
            res.status(400).json({
                success: false,
                message: "Username already exists!"
            })
            return
        }
        const user = await client.user.create({
            data: {
                username:  parsedData.data.username,
                password: hashedPassword
            }
        })

        res.status(201).json({
            success: true,
            message: "Signup successfully!",
            user
        })

        return
    } catch (error) {
        console.log("Error : ", error)
        res.status(400).json({
            success: false,
            message: (error instanceof Error) ? error.message : "Something went wrong!"
        })
        return
    }
})


app.listen(8000)