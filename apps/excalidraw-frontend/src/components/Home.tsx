"use client";

import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import axios from "axios";
import React, { useContext, useState } from "react";
import { HTTP_BACKEND } from "../../config";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

  const [toggle, setToggle] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = useContext(AuthContext);
  if (!auth) return;

  const { setIsAuthenticated } = auth;

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const response = await axios.post(
        `${HTTP_BACKEND}/create-room`,
        { roomName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const roomId = response.data.room.id;
        router.push(`/room/${roomId}`);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const response = await axios.post(
        `${HTTP_BACKEND}/check-room`,
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        const roomId = response.data.room.id;
        router.push(`/room/${roomId}`);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const roomValue = toggle ? "room-id" : "room-name";

  return (
    <div>
      <div className="flex items-center justify-between mt-1 ml-1">
     <Link href='/my-docs'>
     <Button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          text="Your All Docs"
        />
     </Link>
        <Button
          onClick={handleLogout}
          type="button"
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          text="Logout"
        />
      </div>
      <div className="h-screen w-full flex items-center justify-center flex-col">
        <div className=" w-[400px] bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {toggle ? "Join the toom" : "Create your room"}
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={toggle ? handleJoinRoom : handleCreateRoom}
            >
              <div>
                <label
                  htmlFor={roomValue}
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                ></label>
                <Input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={roomValue}
                  name={roomValue}
                  id={roomValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    toggle
                      ? setRoomId(e.target.value)
                      : setRoomName(e.target.value)
                  }
                  value={toggle ? roomId : roomName}
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                text={toggle ? "Join Room" : "Create Room"}
              />
            </form>

            {toggle ? (
              <div className="flex items-center justify-center">
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Create your room?
                </p>

                <Button
                  className="font-medium text-sm ml-[-15px] text-blue-500 text-primary hover:underline dark:text-primary-dark"
                  type="button"
                  onClick={() => setToggle(!toggle)}
                  text="Create"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Want to join the room?{" "}
                </p>
                <Button
                  className="font-medium text-sm ml-[-15px] text-blue-500 text-primary hover:underline dark:text-primary-dark"
                  type="button"
                  text="Join"
                  onClick={() => setToggle(!toggle)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
