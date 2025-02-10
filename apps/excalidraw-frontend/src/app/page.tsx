"use client"

import HomePage from "@/components/Home";
import LandingPage from "@/components/Landing";
import { useEffect, useState } from "react"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
const token = localStorage.getItem('token')
if(token){
  setIsAuthenticated(true)
}

  }, [])

  const token = localStorage.getItem('token')

  return (
    <>
   {isAuthenticated? <HomePage/> : <LandingPage />}
    </>
  );
}
