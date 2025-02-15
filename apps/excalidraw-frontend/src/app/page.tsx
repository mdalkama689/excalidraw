'use client'
import HomePage from "@/components/Home";
import LandingPage from "@/components/Landing";
import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export default function Home() {
  const {isAuthenticated, loading }  = useContext(AuthContext)

  if(loading){
    return (
      <div>
        loading .......... 
      </div>
    )
  }

  return (
    <>
{isAuthenticated ? <HomePage /> : <LandingPage />}
 </>
  );
}
