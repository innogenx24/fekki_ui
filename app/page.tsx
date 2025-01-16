"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation'; 

export default function Home() {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-white">
        {/* Top Logo */}
        <header className="w-full text-center py-6">
          <Image
            src="/images/fekki-logo.png" // Corrected path
            alt="Fekki Logo"
            width={200}
            height={200}
            className="mx-auto"
          />
        </header>
        <section className="w-full text-center py-4 px-6">
    <h2 className="text-lg font-bold text-gray-800 mb-2">Welcome to Fekki!</h2>
    <p className="text-gray-600">
      Explore the best user interface designs tailored to your needs.
    </p>
    <p className="text-gray-600">
      Our platform is here to help you innovate and grow.
    </p>
    <p className="text-gray-600">
      Dive in and experience the next level of design excellence.
    </p>
  </section>

        {/* Main Content */}
        <div className="flex flex-1 w-full max-w-6xl mx-auto px-4">
          <div className="flex-1 flex items-center justify-center">
            <Image
              src="/images/leftside-logo.png" 
              alt="VR Illustration"
              width={500}
              height={500}
              className="w-full max-w-sm border border-gray-300"
            />
          </div>

          {/* Right Side - Buttons */}
          <div className="flex-1 flex flex-col items-start justify-center">
            <div className="space-y-4">
              <button className="w-64 px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg flex justify-between items-center"
               onClick={() => router.push('/sign-in')}
              
              >
                Admin UI <span className="text-2xl">→</span>
              </button>
              <button className="w-64 px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg flex justify-between items-center"
              onClick={() => router.push('/sign-in')}
              >
                Client UI <span className="text-2xl">→</span>
              </button>
              {/* <button className="w-64 px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg flex justify-between items-center">
                Mobile UI <span className="text-2xl">→</span>
              </button>
              <button className="w-64 px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg flex justify-between items-center">
                B2B Mobile UI <span className="text-2xl">→</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="py-4">
          <p className="text-sm text-gray-500">
            "This screen is for testing the UI only and will not be included in
            the final version of the software."
          </p>
        </footer>
      </div>
    </>
  );
}
