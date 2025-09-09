"use client"
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

function Header() {

    const {data:session }=useSession();
    
    const handleSignOut=async()=>{
        try{
            await signOut();
        }
        catch(error){
            throw new Error("Failed to sign out");
        }
    }
  return (
    <div>
      <button onClick={handleSignOut}>SignOut</button>
    </div>
  )
}

export default Header
