"use client";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import Link from "next/link";
import { useContext, useState } from "react";
import axios from "axios";
import { HTTP_BACKEND } from "../../config";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export function AuthPage({ type }) {
  const router = useRouter();
  const { setIsAuthenticated } = useContext(AuthContext);

  const [isLoading, setIsLaoding] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    try {
      const reqType = type === "signup" ? "signup" : "signin";
      e.preventDefault();
      setIsLaoding(true);
      const response = await axios.post(`${HTTP_BACKEND}/${reqType}`, formData);
      console.log(response);
      if (response.data.success) {
        router.push(type === "signup" ? "/signin" : "/");
      }
      if (type === "signin") {
        localStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(error?.response?.data?.message);
      const message = error?.response?.data?.message || "Something went wromg!";
      alert(message);
    } finally {
      setIsLaoding(false);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col">
      <div className=" w-[400px] bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            {type === "signup"
              ? "Create your account"
              : "Sign in to your account"}
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username
              </label>
              <Input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="username"
                name="username"
                id="username"
                onChange={handleInput}
                value={formData.username}
                disabled={isLoading}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <Input
                type="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                disabled={isLoading}
                name="password"
                id="password"
                placeholder="••••••••"
                onChange={handleInput}
                value={formData.password}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              text={type === "signup" ? "Sign In" : "Sign In"}
            />
            <div className="flex items-center justify-center">
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {type === "signup"
                  ? "Already have an account? "
                  : "Don’t have an account yet? "}
                <Link
                  href={type === "signup" ? "/signin" : "/signup"}
                  className="font-medium text-blue-300 text-primary hover:underline dark:text-primary-dark"
                >
                  {type === "signup" ? "Sign in" : "Sign up"}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
