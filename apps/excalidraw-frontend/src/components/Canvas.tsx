'use client'

import { statSync } from "fs"
import { useEffect, useRef } from "react"
import { buffer } from "stream/consumers"

export default function CanVas(){
const canvasRef  = useRef<HTMLCanvasElement>(null)

useEffect(() => {

    const canvas = canvasRef.current
    if(!canvas) return
    const ctx = canvas.getContext('2d')
if(!ctx) return

let clicked = false
let startX = 0;
let startY = 0;

const handleMouseDown  = (e: MouseEvent) => {
// get starting point 
clicked = true
startX = e.offsetX
startY = e.offsetY

}

const handleMouseUp  = (e: MouseEvent) => {
    clicked = false
}
const handleMouseMove  = (e: MouseEvent) => {
    
    if(!clicked) return

    const width = e.offsetX  - startX
    const height= e.offsetY  - startY
    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.strokeStyle = "white"
    ctx.strokeRect(startX, startY, width, height)
}


canvas.addEventListener('mousedown', handleMouseDown)
canvas.addEventListener('mouseup', handleMouseUp)
canvas.addEventListener('mousemove', handleMouseMove)

return () => {
    canvas.removeEventListener('mousedown', handleMouseDown)
canvas.removeEventListener('mouseup', handleMouseUp)
canvas.removeEventListener('mousemove', handleMouseMove)

}
}, [])

    return(
        <canvas
        height={600}
        width={800}
        ref={canvasRef}
        className="border border-white"
        ></canvas>
    )
}