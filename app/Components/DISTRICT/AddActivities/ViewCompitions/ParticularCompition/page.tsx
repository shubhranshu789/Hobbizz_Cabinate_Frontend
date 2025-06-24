"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import Image from "next/image"

import Navbar from "../../../DirectorNavbar/page"

import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast"

interface Competition {
  _id: string
  title: string
  desc: string
  pic: string
  postedBy: string[]
  isLive: boolean
}

interface CompetitionDisplayProps {
  competitionId: string
  apiBaseUrl?: string
}

export default function CompetitionDisplay({
}) {
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`http://localhost:5000/getCompitition/${id}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setCompetition(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch competition")
        console.error("Error fetching competition:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCompetition()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading competition...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <h3 className="text-lg font-semibold mb-2">Error Loading Competition</h3>
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!competition) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-gray-600">
            <h3 className="text-lg font-semibold mb-2">Competition Not Found</h3>
            <p>No competition data available.</p>
          </div>
        </CardContent>
      </Card>
    )
  }


  const toggleLive = async (value: any) => {
    const res = await fetch(`http://localhost:5000/activity/set-live/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLive: value }),
    });

    const data = await res.json();
    console.log(data.message);
  };


  return (
    <div style={{ marginTop: "80px" }}>
      <Navbar />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{competition.title}</CardTitle>
            <Badge variant={competition.isLive ? "default" : "secondary"}>
              {competition.isLive ? "🔴 Live" : "⏸️ Not Live"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {competition.pic && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={competition.pic || "/placeholder.svg"}
                alt={competition.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{competition.desc}</p>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={() => toggleLive(true)}
              className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition-all duration-200"
            >
              ✅ Make Live
            </button>

            <button
              onClick={() => toggleLive(false)}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition-all duration-200"
            >
              ❌ Make Offline
            </button>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
            <span>Competition ID: {competition._id}</span>
            <span>Posted by: {competition.postedBy.length} user(s)</span>
          </div>
        </CardContent>
      </Card>
    </div>

  )
}
