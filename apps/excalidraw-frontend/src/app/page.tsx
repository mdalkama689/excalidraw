'use client'
import HomePage from "@/components/Home";
import LandingPage from "@/components/Landing";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function Home() {
  const {isAuthenticated}  = useContext(AuthContext)


  return (
    <>
{isAuthenticated ? <HomePage /> : <LandingPage />}
 </>
  );
}
