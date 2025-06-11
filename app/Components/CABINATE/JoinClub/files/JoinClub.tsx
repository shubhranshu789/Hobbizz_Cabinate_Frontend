"use client"

import Navbar from "../../../Navbar/page"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import Footer from "../../Footer/page"





import {
  Filter,
  Search,
  Users,
  Calendar,
  Palette,
  Music,
  Camera,
  Zap,
  Cpu,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ChevronLeft,
  ChevronRight,
  SortAsc,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const clubs = [
  {
    id: 1,
    name: "Art Club",
    description: "Express yourself through colors and canvas",
    members: 120,
    schedule: "Tue, Thu",
    image: "/AllPics/ClubPics/1.JPG?height=200&width=300",
    icon: Palette,
    color: "bg-orange-100 text-orange-600",
    popular: true,
  },
  {
    id: 2,
    name: "Music Club",
    description: "Create melodies that move hearts",
    members: 85,
    schedule: "Mon, Wed, Fri",
    image: "/AllPics/ClubPics/6.JPG?height=200&width=300",
    icon: Music,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 3,
    name: "Photography Club",
    description: "Capture moments, create memories",
    members: 94,
    schedule: "Sat, Sun",
    image: "/AllPics/ClubPics/5.JPG?height=200&width=300",
    icon: Camera,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 4,
    name: "Dance Club",
    description: "Move to the rhythm of your heart",
    members: 92,
    schedule: "Tue, Thu, Sat",
    image: "/AllPics/ClubPics/2.JPG?height=200&width=300",
    icon: Zap,
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: 5,
    name: "Robotics Club",
    description: "Build the future with innovation",
    members: 78,
    schedule: "Wed, Fri",
    image: "/AllPics/ClubPics/4.JPG?height=200&width=300",
    icon: Cpu,
    color: "bg-green-100 text-green-600",
  },
  {
    id: 6,
    name: "Debate Club",
    description: "Voice your thoughts, shape opinions",
    members: 56,
    schedule: "Mon, Thu",
    image: "/AllPics/ClubPics/3.JPG?height=200&width=300",
    icon: MessageSquare,
    color: "bg-indigo-100 text-indigo-600",
  },
]

export default function Component() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const sortedClubs = [...filteredClubs].sort((a, b) => {
    if (sortBy === "members") return b.members - a.members
    if (sortBy === "name") return a.name.localeCompare(b.name)
    return b.popular ? 1 : -1
  })

  return (

    <div>
        <Navbar/>
        <div style={{marginTop : "80px"}} className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Available Clubs</h2>
            <p className="text-gray-600">Discover and join exciting hobby clubs that match your interests</p>
            </motion.div>

            {/* Clubs Grid */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12" layout>
            <AnimatePresence>
                {sortedClubs.map((club, index) => {
                const IconComponent = club.icon
                return (
                    <motion.div
                    key={club.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.1}
                    onDragStart={() => setDraggedItem(club.id)}
                    onDragEnd={() => setDraggedItem(null)}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileDrag={{ scale: 1.05, rotate: 5 }}
                    className={`cursor-grab active:cursor-grabbing ${draggedItem === club.id ? "z-50" : ""}`}
                    >
                    <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="relative">
                        <img
                            src={club.image || "/placeholder.svg"}
                            alt={club.name}
                            className="w-full h-48 object-cover"
                        />
                        {club.popular && (
                            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-400 to-red-500 text-white border-0">
                            Popular
                            </Badge>
                        )}
                        <div
                            className={`absolute top-3 left-3 w-10 h-10 rounded-full ${club.color} flex items-center justify-center`}
                        >
                            <IconComponent className="w-5 h-5" />
                        </div>
                        </div>

                        <CardContent className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{club.name}</h3>
                        <p className="text-gray-600 mb-4 text-sm">{club.description}</p>

                        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{club.members} members</span>
                            </div>
                            <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{club.schedule}</span>
                            </div>
                        </div>

                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                            View Club
                            </Button>
                        </motion.div>
                        </CardContent>
                    </Card>
                    </motion.div>
                )
                })}
            </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2"
            >
            {/* <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">4 / 9</span>
            <Button variant="outline" size="sm">
                <ChevronRight className="w-4 h-4" />
            </Button> */}
            </motion.div>
        </main>

        <Footer/>
        
        </div>
    </div>
  )
}
