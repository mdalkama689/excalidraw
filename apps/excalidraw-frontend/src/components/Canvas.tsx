'use client'

import { initDraw } from "@/draw"
import { useEffect, useRef } from "react"

export default function Canvas({socket, roomId}: {socket: WebSocket | null, roomId: string}){
const canvasRef = useRef<HTMLCanvasElement>(null)


useEffect(() => {

initDraw(canvasRef, socket, roomId)


},[canvasRef])

    return(
        <canvas
        ref={canvasRef}
        height={600}
        width={500}
        className="border border-white"
        >
        </canvas>
    )
}