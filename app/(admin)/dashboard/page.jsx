'use client'
import React from 'react'

const Dashboard = () => {
  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div>
      {user.username ? (
        <div>Welcome to Fekki, {user.username}</div>
      ) : (
        <div>Loading...</div> 
      )}
    </div>
  )
}

export default Dashboard
