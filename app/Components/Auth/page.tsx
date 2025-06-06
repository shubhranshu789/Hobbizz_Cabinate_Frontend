"use client"
import SignIn from "./files/sign-in"
import SignUp from "./files/sign-up"
import { Toaster } from 'react-hot-toast';

export default function Page() {
  return (
    <div>
      {/* You can choose to render either the sign-in or sign-up component here */}
      {/* <SignIn /> */}
       <Toaster position="top-right" reverseOrder={false} />
      <SignUp />
    </div>
  )
}
