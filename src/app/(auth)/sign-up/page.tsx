"use client";
import React from 'react';

import callSignupApi from '@/services/signupService';
import { Button } from '@/components/ui/button';

export default function SignUp() {

  const handleSignUp = async () => {
    try {
      const apiResponse = await callSignupApi({
        username: "1aryanX23",
        fullname: "Aryan Rai",
        password: "qwerty123",
        email: "aryanrai2304@gmail.com"
      })
      console.log(apiResponse);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Sign Up</h1>
      <Button onClick={handleSignUp} >
        Sign Up
      </Button>
    </main>
  )
}