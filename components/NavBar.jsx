"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Menu from "./Menu";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from 'next/link';

export default function NavBar() {
  const [clientData, setClientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.client_id;

  useEffect(() => {
    if (userId && token) {
      const fetchClientData = async () => {
        try {
          const response = await fetch(
            `http://localhost:3002/api/client/${userId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch client data");
          }

          const data = await response.json();
          setClientData(data.data); // Set client data
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchClientData();
    } else {
      setIsLoading(false);
    }
  }, [userId, token]);

  const handleNavToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleUsernameClick = () => {
    router.push(`/dashboard/profile-details?id=${userId}`);
  };

  const handleSignOut = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
      router.push("/sign-in");
    }
  };
  

  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 p-4">
      <div className="px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-2">
            <button onClick={goBack}>
              <Image
                src="/images/leftside.png"
                alt="Left Arrow"
                width={50}
                height={40}
                className="cursor-pointer hover:bg-gray-100"
              />
            </button>
            <button onClick={goForward}>
              <Image
                src="/images/rightside.png"
                alt="Right Arrow"
                width={50}
                height={40}
                className="cursor-pointer hover:bg-gray-100"
              />
            </button>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Image
                  src="/images/fekki-logo.png"
                  alt="Fekki Logo"
                  width={100}
                  height={60}
                  className="cursor-pointer"
                />
              </Link>
              <div className="hidden md:flex space-x-6">
                <Menu isOpen={isOpen} />
              </div>
            </div>
          </div>
          {/* Right Side: Settings and Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard/settings">
              <Image
                src="/setting-images/setting.png"
                alt="Settings"
                width={36}
                height={36}
                className="cursor-pointer"
              />
            </Link>
            <div className="flex items-center space-x-2">
              {!clientData ? (
                <SignedOut>
                  <SignInButton />
                </SignedOut>
              ) : (
                <>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={
                        clientData?.image
                          ? `http://localhost:3002/uploads/${clientData.image}`
                          : "/default-avatar.png"
                      }
                      alt="User Avatar"
                      width={40}
                      height={30}
                      className="rounded-full"

                    />
                    <span
                      className="text-lg font-medium text-gray-800 cursor-pointer"
                      onClick={handleUsernameClick}
                    >
                      {clientData?.firstName} {clientData?.lastName}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-red-600"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={handleNavToggle}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Menu isOpen={isOpen} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
