"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, Users, Calendar } from "lucide-react"

// import "../../../Components/CABINATE/JoinClub/art"

const clubs = [
  {
    id: "art",
    name: "Art Club",
    description: "Express yourself through colors and canvas",
    members: 120,
    meetingDays: "Tue, Thu",
    image: "/placeholder.svg?height=200&width=300",
    popular: true,
  },
  {
    id: "music",
    name: "Music Club",
    description: "Create melodies that move hearts",
    members: 85,
    meetingDays: "Mon, Wed, Fri",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "photography",
    name: "Photography Club",
    description: "Capture moments, create memories",
    members: 64,
    meetingDays: "Sat, Sun",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "dance",
    name: "Dance Club",
    description: "Move to the rhythm of your heart",
    members: 92,
    meetingDays: "Tue, Thu, Sat",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "robotics",
    name: "Robotics Club",
    description: "Build the future with innovation",
    members: 79,
    meetingDays: "Wed, Fri",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "debate",
    name: "Debate Club",
    description: "Voice your thoughts, shape opinions",
    members: 58,
    meetingDays: "Mon, Thu",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function ClubsGrid() {
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState("popular")

  const filteredClubs = filter === "all" ? clubs : clubs.filter((club) => club.id === filter)
  const sortedClubs = [...filteredClubs].sort((a, b) => {
    if (sort === "popular") return b.members - a.members
    if (sort === "newest") return 0 // Would use date in real implementation
    return a.name.localeCompare(b.name)
  })

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Available Clubs</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Button variant="outline" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 5h10" />
                <path d="M11 9h7" />
                <path d="M11 13h4" />
                <path d="M3 17h18" />
                <path d="M3 21h15" />
                <path d="m8 9-5 5 5 5" />
              </svg>
              Sort
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedClubs.map((club) => (
          <div
            key={club.id}
            className="group overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative">
              <img
                src={club.image || "/placeholder.svg"}
                alt={club.name}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {club.popular && (
                <div className="absolute right-2 top-2 rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                  Popular
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{club.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{club.description}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{club.members} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{club.meetingDays}</span>
                </div>
              </div>
              <Link href={`../../../Components/CABINATE/JoinClub/${club.id}`}>
                <Button variant="outline" className="mt-4 w-full">
                  View Club
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
