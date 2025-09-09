"use client"

import { error } from 'console';
import { set } from 'mongoose';
import { useRouter } from 'next/navigation';
import React, { FormEvent } from 'react'

function Register() {
    const [email,setEmail] = React.useState<string>("");
    const [password,setPassword] = React.useState<string>("");
    const [confirmPassword,setConfirmPassword] = React.useState<string>("");
    const [error,setError] = React.useState<string>("");
    const router = useRouter();

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        if(password !== confirmPassword){
            setError("Passwords do not match");
            return;
        }
        try{
           const res = await fetch('/api/auth/register',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({email,password})
           });

           const data = await res.json();

           if(!res.ok){
            setError(data.error || "APi error");
            return;
           }
        }
        catch(error){
            setError("Failed to register");
            return;
        }
    }
  return (
    <div>
        Register
    </div>
  )
}

export default Register
