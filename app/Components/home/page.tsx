"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, Home, Settings, User, Bell, Search, Sparkles, Zap, Star } from "lucide-react"
import Link from "next/link"

import Navabr from "../Navbar/page"
import { useRouter } from 'next/navigation';



export default function Component() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

    const router = useRouter();
  
    const gotoreviewactivity = () => {
      router.push('../../Components/ReviewActivity');
    };
  

  const userData = localStorage.getItem('user');

  let currName = '';

  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      currName = parsedUser.name;
      // console.log('User name:', currName);
    } catch (error) {
      console.error('Failed to parse user data:', error);
    }
  } else {
    console.warn('No user found in localStorage');
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(timer)
    }
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const floatingElements = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute opacity-20"
      initial={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }}
      animate={{
        x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
        y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
        rotate: 360,
      }}
      transition={{
        duration: 10 + Math.random() * 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "linear",
      }}
    >
      {i % 3 === 0 ? (
        <Sparkles className="w-6 h-6 text-white" />
      ) : i % 3 === 1 ? (
        <Zap className="w-5 h-5 text-blue-200" />
      ) : (
        <Star className="w-4 h-4 text-blue-100" />
      )}
    </motion.div>
  ))

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">{floatingElements}</div>

      {/* Animated Background Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
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
        className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"
        animate={{
          scale: [1, 0.8, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Navigation */}
      <Navabr />


      {/* Main Content */}
      <div className="pt-16 flex items-center justify-center min-h-screen px-4">
        <div className="text-center text-white max-w-4xl mx-auto">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.h1
              className="text-2xl md:text-3xl font-light mb-2"
              animate={{
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.5)",
                  "0 0 20px rgba(255,255,255,0.8)",
                  "0 0 10px rgba(255,255,255,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              {getGreeting()}! Welcome Back <p>{currName}</p>
            </motion.h1>
            <p className="text-blue-100 text-lg">
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="bg-gradient-to-r from-white via-blue-100 to-white bg-[length:200%_100%] bg-clip-text text-transparent"
              >
                HOBBIZZ
              </motion.span>
            </h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-xl md:text-2xl text-blue-100 mb-4"
            >
              Where Education Meets Smart Marketing
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="text-lg text-blue-200 mb-12"
            >
              Strategy. Creativity. Results. All Under One Roof.
            </motion.p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => {gotoreviewactivity()}}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold shadow-lg"
              >
                Get Started
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
              >
                Learn More
              </Button>
            </motion.div> */}
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
          >
            {[
              { number: "2000+", label: "Connections in educational domain" },
              { number: "20+", label: "Educational Institutions" },
              { number: "30+", label: "Years of Experience" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <motion.h3
                  className="text-3xl md:text-4xl font-bold mb-2"
                  animate={{
                    color: ["#ffffff", "#bfdbfe", "#ffffff"],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-blue-100 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

