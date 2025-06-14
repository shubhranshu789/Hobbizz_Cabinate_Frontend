"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// import "../../../../Components/CABINATE/JoinClub"

import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Palette,
  Brush,
  PaintBucket,
  EraserIcon as Easel,
  ChevronLeft,
  Heart,
  Share2,
} from "lucide-react"

// Mock data - in a real app, this would come from an API
const activities = [
  {
    id: 1,
    title: "Watercolor Workshop",
    date: "June 15, 2025",
    time: "3:00 PM - 5:00 PM",
    location: "Art Studio 3B",
    image: "/placeholder.svg?height=200&width=300",
    description: "Learn watercolor techniques from professional artists. All materials provided.",
  },
  {
    id: 2,
    title: "Life Drawing Session",
    date: "June 18, 2025",
    time: "4:00 PM - 6:00 PM",
    location: "Main Gallery",
    image: "/placeholder.svg?height=200&width=300",
    description: "Practice drawing from a live model. Bring your own sketchbook and pencils.",
  },
  {
    id: 3,
    title: "Art Exhibition Preparation",
    date: "June 22, 2025",
    time: "2:00 PM - 7:00 PM",
    location: "Student Center",
    image: "/placeholder.svg?height=200&width=300",
    description: "Help set up for our end-of-semester exhibition. All club members welcome!",
  },
]

const members = [
  { id: 1, name: "Emma Wilson", role: "President", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Michael Chen", role: "Vice President", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "Sophia Rodriguez", role: "Treasurer", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "James Kim", role: "Secretary", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 5, name: "Olivia Patel", role: "Event Coordinator", avatar: "/placeholder.svg?height=40&width=40" },
  // More members would be here
]

export default function ArtClubPage() {
  const [hasRequested, setHasRequested] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("about")

  // Simulate checking if user has already requested to join
  useEffect(() => {
    // In a real app, this would be an API call to check status
    const checkRequestStatus = async () => {
      // Simulating API call delay
      setTimeout(() => {
        // This would be the result of an API call
        setHasRequested(localStorage.getItem("artClubRequested") === "true")
      }, 500)
    }

    checkRequestStatus()
  }, [])

  const handleJoinRequest = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an actual API call
      const response = await fetch("http://localhost:5000/artclub/requestjoin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
      })
      const data = await response.json()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setHasRequested(true)
      localStorage.setItem("artClubRequested", "true")
    } catch (error) {
      console.error("Failed to request join:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawRequest = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would be an actual API call
      const response = await fetch("http://localhost:5000/artclub/withdrawjoin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
      })
      const data = await response.json()

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setHasRequested(false)
      localStorage.setItem("artClubRequested", "false")
    } catch (error) {
      console.error("Failed to withdraw request:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-full bg-blue-500 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-puzzle"
                >
                  <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 3.17 9.5c0-.617.236-1.234.706-1.704L5.457 6.15a.98.98 0 0 1 .878-.288c.493.074.84.504 1.02.968a2.5 2.5 0 1 0 3.237-3.237c-.464-.18-.894-.527-.967-1.02a1.026 1.026 0 0 1 .289-.878l1.568-1.568A2.402 2.402 0 0 1 13.5 0c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Hobbizz</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/my-clubs" className="text-sm font-medium">
              My Clubs
            </Link>
            <Link href="/events" className="text-sm font-medium">
              Events
            </Link>
            <Link href="/profile" className="text-sm font-medium">
              Profile
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="search"
                placeholder="Search clubs..."
                className="w-64 rounded-full border border-gray-200 bg-white px-4 py-2 pl-10 text-sm"
              />
            </div>
            <button className="rounded-full bg-gray-100 p-2 md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <button className="rounded-full bg-gray-100 p-2 md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
            <Link href="/profile">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                <img
                  src="/placeholder.svg?height=32&width=32"
                  width={32}
                  height={32}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </header> */}

      <div style={{ padding: "20px" }} className="container py-6">
        <Link href="../../../../Components/CABINATE/JoinClub" className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
          <ChevronLeft className="h-4 w-4" />
          Back to clubs
        </Link>

        <div className="relative mb-8 overflow-hidden rounded-xl">
          <img
            src="/placeholder.svg?height=400&width=1200"
            alt="Art Club Banner"
            className="h-64 w-full object-cover sm:h-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500 hover:bg-blue-600">Popular</Badge>
              <Badge variant="outline" className="bg-white/80 text-gray-800 hover:bg-white">
                120 Members
              </Badge>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-white">Art Club</h1>
            <p className="mt-1 text-lg text-white/90">Express yourself through colors and canvas</p>
          </div>
          <div className="absolute right-4 top-4 flex gap-2">
            <Button size="icon" variant="outline" className="rounded-full bg-white/80 hover:bg-white">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favorite</span>
            </Button>
            <Button size="icon" variant="outline" className="rounded-full bg-white/80 hover:bg-white">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs defaultValue="about" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="mt-6">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold">About Art Club</h2>
                  <p className="mt-4 text-gray-700">
                    The Art Club is a vibrant community of creative individuals who share a passion for visual arts. We
                    welcome artists of all skill levels, from beginners to experienced creators. Our club provides a
                    supportive environment where members can explore various art forms, develop their skills, and
                    showcase their work.
                  </p>

                  <h3 className="mt-6 text-lg font-semibold">What We Offer</h3>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    <motion.li
                      className="flex items-center gap-2 rounded-md border bg-white p-3 shadow-sm"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="rounded-full bg-rose-100 p-2 text-rose-600">
                        <Palette className="h-5 w-5" />
                      </div>
                      <span>Weekly art workshops</span>
                    </motion.li>
                    <motion.li
                      className="flex items-center gap-2 rounded-md border bg-white p-3 shadow-sm"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="rounded-full bg-blue-100 p-2 text-blue-600">
                        <Brush className="h-5 w-5" />
                      </div>
                      <span>Professional guidance</span>
                    </motion.li>
                    <motion.li
                      className="flex items-center gap-2 rounded-md border bg-white p-3 shadow-sm"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="rounded-full bg-amber-100 p-2 text-amber-600">
                        <PaintBucket className="h-5 w-5" />
                      </div>
                      <span>Art supplies provided</span>
                    </motion.li>
                    <motion.li
                      className="flex items-center gap-2 rounded-md border bg-white p-3 shadow-sm"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                        <Easel className="h-5 w-5" />
                      </div>
                      <span>Exhibition opportunities</span>
                    </motion.li>
                  </ul>

                  <h3 className="mt-6 text-lg font-semibold">Meeting Schedule</h3>
                  <div className="mt-3 rounded-md border bg-gray-50 p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">Tuesday and Thursday</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <span>4:00 PM - 6:00 PM</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span>Art Studio, Building B, Room 305</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activities" className="mt-6">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold">Upcoming Activities</h2>
                  <p className="mt-2 text-gray-600">Join us for these exciting events and activities!</p>

                  <div className="mt-6 grid gap-6">
                    {activities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        className="overflow-hidden rounded-lg border bg-white shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="grid md:grid-cols-3">
                          <div className="overflow-hidden">
                            <img
                              src={activity.image || "/placeholder.svg"}
                              alt={activity.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-4 md:col-span-2">
                            <h3 className="text-lg font-semibold">{activity.title}</h3>
                            <p className="mt-2 text-gray-600">{activity.description}</p>
                            <div className="mt-4 grid gap-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>{activity.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span>{activity.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span>{activity.location}</span>
                              </div>
                            </div>
                            <Button className="mt-4" variant="outline">
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="members" className="mt-6">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Club Members</h2>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-gray-500" />
                      <span className="text-gray-600">120 members</span>
                    </div>
                  </div>

                  <h3 className="mt-6 font-semibold">Leadership Team</h3>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                    {members.slice(0, 5).map((member) => (
                      <motion.div
                        key={member.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                        whileHover={{ backgroundColor: "#f9fafb" }}
                      >
                        <Avatar>
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.role}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <h3 className="mt-6 font-semibold">Active Members</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <Avatar key={i}>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${i + 1}`} />
                        <AvatarFallback>M{i + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-600">
                      +100
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold">Join Art Club</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Interested in joining our creative community? Send a request to join and our club administrators will
                  review it.
                </p>

                {hasRequested ? (
                  <div className="mt-4">
                    <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
                      Your request to join has been sent! We'll review it soon.
                    </div>
                    <Button variant="outline" className="w-full" onClick={handleWithdrawRequest} disabled={isLoading}>
                      {isLoading ? "Processing..." : "Withdraw Request"}
                    </Button>
                  </div>
                ) : (
                  <Button className="mt-4 w-full" onClick={handleJoinRequest} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Request to Join"}
                  </Button>
                )}

                <div className="mt-6 border-t pt-4">
                  <h4 className="font-medium">Club Details</h4>
                  <div className="mt-3 grid gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>120 members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Founded: September 2023</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>Art Building, Room 305</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t pt-4">
                  <h4 className="font-medium">Contact</h4>
                  <p className="mt-2 text-sm">
                    Have questions? Contact the club president at{" "}
                    <a href="mailto:artclub@university.edu" className="text-blue-600 hover:underline">
                      artclub@university.edu
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <h3 className="mb-3 font-semibold">Recent Gallery</h3>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={i} className="overflow-hidden rounded-md" whileHover={{ scale: 1.05 }}>
                    <img
                      src={`/placeholder.svg?height=100&width=100&text=Art${i + 1}`}
                      alt={`Gallery item ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <Button variant="link" className="mt-2 h-auto p-0 text-sm">
                View full gallery →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
