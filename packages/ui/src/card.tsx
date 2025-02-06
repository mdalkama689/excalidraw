"use client"

import { ReactNode } from "react"

interface CardProps {
  children : ReactNode,
 className: string 
}
export const Card = ({children, className}: CardProps) => {
  return (
<div
className={className}
>
  {children}
</div>
  )
}