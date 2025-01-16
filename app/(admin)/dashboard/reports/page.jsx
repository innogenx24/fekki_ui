"use client"

import React from 'react'
import { useUser  } from '@clerk/nextjs'

const ProductLibrary = () => {

  const { isLoaded, isSignedIn, user } = useUser()


   // In case the user signs out while on the page.
   if (!isLoaded || !isSignedIn) {
    return null
  }

  console.log(user);
  

  return (
    <div>Hello, {user?.username} , welcome to Fekki</div>
  )
}

export default ProductLibrary