"use client";

import { AuthContext } from "@/context/AuthContext";
import { getAllDocs } from "@/draw/http";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function AllDocs() {
  const [allDocs, setAllDocs] = useState([]);
  const fetchAllDocs = async () => {
    const response = await getAllDocs();
    setAllDocs(response.allDocs);
  };
  const router = useRouter();
  const auth = useContext(AuthContext);
  if (!auth) return;
  const { isAuthenticated, loading } = auth;
  useEffect(() => {
    fetchAllDocs();
  }, []);

  if (loading) {
    return <div>loading...........</div>;
  }
  if (!isAuthenticated) {
    router.push("/login");
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center my-6">
        Your All Docs
      </h1>
      {allDocs.length > 0 ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {allDocs.map((docs) => (
            <div
              key={docs.chats[0].id}
              className="w-[400px] bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden dark:bg-gray-800 dark:border-gray-700"
            >
              <Link href={`/room/${docs.chats[0].roomId}`}>
                <img
                  className="w-full h-fit object-cover"
                  src="https://logowik.com/content/uploads/images/google-docs-icon6180.jpg"
                  alt="Document Image"
                />
              </Link>
              <div className="p-4">
                <Link
                  href={`/room/${docs.chats[0].roomId}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition"
                >
                  Show more
                  <svg
                    className="w-4 h-4 ml-2 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white flex items-center justify-center h-screen overflow-hidden">
          You dont have any docs
        </div>
      )}

      <Home />
    </div>
  );
}

function Home() {
  return (
    <div className="absolute left-2 top-3">
      <Link href="/">
        <ChevronLeft />
      </Link>
    </div>
  );
}
