'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from "next/image";

export default function SignInPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError('')

    // Send POST request to login API
    try {
      const response = await fetch('http://localhost:3002/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Save login data to localStorage
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token)

        // If login is successful, redirect to dashboard
        router.push('/dashboard/settings')
      } else {
        // Handle error (user not found, invalid password, etc.)
        setError(data.message || 'An error occurred')
      }
    } catch (err) {
      setError('An error occurred while logging in')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side: Image and Illustration */}
      <div className="w-1/2 flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <img
            src="/images/leftside-logo.png"
            alt="Illustration"
            className="w-3/4 mx-auto"
          />
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-4xl flex flex-col items-center ml-[-170px]">
          {/* FEKKI Logo */}
          <header className="w-full text-center py-6">
            <Image
              src="/images/fekki-logo.png" // Ensure this path is correct
              alt="Fekki Logo"
              width={200}
              height={200}
              className="mx-auto"
            />
          </header>

          {/* Login Form */}
          <div className= "bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
              FEKKI
            </h2>
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username*
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    placeholder="Enter Username"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password*
                </label>
                <div className="relative mt-1">
                  <input
                    type="password"
                    placeholder="Enter Password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Remember Me and Submit Button */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember Me</span>
                </label>
              </div>

              {/* Sign-In Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Sign In
              </button>

              {/* Forgot Password */}
              <p className="mt-4 text-center text-sm text-gray-600">
                Forgot Your Password?{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Click Here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
