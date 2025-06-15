"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import Navbar from "../../../../Components/Navbar/page"



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

// const [member, setmember] = useState([])

const members = [
  { id: 1, name: "Emma Wilson", role: "President", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Michael Chen", role: "Vice President", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "Sophia Rodriguez", role: "Treasurer", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 4, name: "James Kim", role: "Secretary", avatar: "/placeholder.svg?height=40&width=40" },
  { id: 5, name: "Olivia Patel", role: "Event Coordinator", avatar: "/placeholder.svg?height=40&width=40" },

]

export default function ArtClubPage() {
  const [hasRequested, setHasRequested] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("about")


  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    const checkRequestStatus = async () => {
      setTimeout(() => {
        setHasRequested(localStorage.getItem("artClubRequested") === "true")
      }, 500)
    }

    checkRequestStatus()

    const fetchClubStatus = async () => {
      try {
        const res = await fetch("http://localhost:5000/artclub/status", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        });
        const data = await res.json();

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user._id;

        if (data.members.includes(userId)) {
          setIsMember(true);
        } else if (data.memberRequests.includes(userId)) {
          setHasRequested(true);
        }
      } catch (err) {
        console.error("Failed to fetch club status", err);
      }
    };

    fetchClubStatus();
  }, [])

  const handleJoinRequest = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:5000/artclub/requestjoin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
      })
      const data = await response.json()

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
      const response = await fetch("http://localhost:5000/artclub/withdrawjoin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
      })
      const data = await response.json()

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
    <div>
      <Navbar/>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div style={{ padding: "20px", marginTop: "60px" }} className="container py-6">
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

                  {isMember ? (
                    <Button disabled className="mt-4 w-full bg-green-600 text-white hover:bg-green-700">
                      Already a Member of this Club
                    </Button>
                  ) : hasRequested ? (
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
    </div>
  )
}
