"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Zap, Star } from "lucide-react"
import Link from "next/link"

import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

// import "../../../Components/Auth/JudgeSignup"





const FloatingElement = ({
  children,
  delay = 0,
  duration = 3,
}: { children: React.ReactNode; delay?: number; duration?: number }) => (
  <motion.div
    className="absolute opacity-20"
    animate={{
      y: [-20, 20, -20],
      x: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration,
      repeat: Number.POSITIVE_INFINITY,
      delay,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
)

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })


  const router = useRouter();

  const handleClick1 = () => {
    router.push('./SignUp');
  };


  const GotoDashBoard = () => {
    router.push('/Components/EDITOR/EditorDashboard');
  }
  const GotoDashBoardDirector = () => {
    router.push('/Components/EDITOR/EditorDashboard');
  }
  const GotoDistrictSignup = () => {
    router.push('/Components/Auth/DistricctSignUp');
  }


  const GotoJudgeDashBoard = () => {
    router.push('/Components/Judge/JudgeDashBoard');
  }


  const GotoJudgeSignUp = () => {
    router.push('/Components/Auth/JudgeSignup');
  }

  const postData = () => {


        //sending data to server
        fetch("http://localhost:5000/judge-signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: formData.email.toLowerCase(),
                password: formData.password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    // notifyA(data.error);
                    // toast.error('Signup failed!');
                    alert("Invalid Credentials!")
                } else {
                    // notifyB("Signed In successfullly");
                    toast.success('Signup success!');
                    // alert('Signup success!');
                    console.log(data);
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    // setUserLogin(true);
                    GotoJudgeDashBoard();
                }

                console.log(data);
            });
    };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <FloatingElement delay={0} duration={4}>
          <div className="top-20 left-20">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </FloatingElement>
        <FloatingElement delay={1} duration={5}>
          <div className="top-40 right-32">
            <Zap className="w-6 h-6 text-blue-200" />
          </div>
        </FloatingElement>
        <FloatingElement delay={2} duration={3.5}>
          <div className="bottom-40 left-16">
            <Star className="w-7 h-7 text-blue-100" />
          </div>
        </FloatingElement>
        <FloatingElement delay={0.5} duration={4.5}>
          <div className="top-60 left-1/3">
            <div className="w-4 h-4 bg-white rounded-full" />
          </div>
        </FloatingElement>
        <FloatingElement delay={1.5} duration={3.8}>
          <div className="bottom-60 right-20">
            <div className="w-3 h-3 bg-blue-200 rounded-full" />
          </div>
        </FloatingElement>
      </div>

      {/* Animated Background Shapes */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-blue-300 rounded-full opacity-10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
            <CardHeader className="space-y-1 text-center pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900">Judge Login</CardTitle>
              <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
              <CardDescription className="text-gray-600">Sign in to your BOOSTUP account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between"
                >
                  {/* <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </Link> */}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => {postData()}}
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          Signing in...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="signin"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          Sign In
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center"
                >
                  <p className="text-sm text-gray-600">
                    {"Don't have an account? "}
                    <span onClick={() => {GotoJudgeSignUp()}} style={{cursor : "pointer"}} className="text-blue-600 hover:text-blue-700 font-medium">
                      Sign up
                    </span>
                  </p>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
