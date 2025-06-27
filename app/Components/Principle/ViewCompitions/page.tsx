"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Calendar, Users, Eye, Trash2 } from "lucide-react"
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

import axios from "axios";

import Navbar from "../PrincipleNavBar/page"

// import "../../../Components/Principle/ViewCompitions/ParticularCompition"
// import "../../../Components/Principle/ViewCompitions/ParticularCompitionParticipants"

interface Competition {
  _id: string
  title: string
  desc: string
  pic: string
  isLive: boolean
}

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCompetitions()
  }, [])

  const fetchCompetitions = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:5000/allCompitition", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch competitions")
      }

      const data = await response.json()
      setCompetitions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error loading competitions</div>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchCompetitions}>Try Again</Button>
        </div>
      </div>
    )
  }


  const router = useRouter();

  const handleClickSubmitId = (id: any) => {
    router.push(`/Components/Principle/ViewCompitions/ParticularCompition?id=${id}`);

  };
  const handleClickSubmitId2 = (id: any) => {
    router.push(`/Components/Principle/ViewCompitions/ParticularCompitionParticipants?id=${id}`);
  };




  return (

    <div>
      <Navbar />
      <div style={{ marginTop: "60px" }} className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-yellow-500 mr-2" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Competitions
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover exciting competitions and showcase your skills. Join live events or explore upcoming challenges.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{competitions.length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Total Competitions</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2 animate-pulse" />
                  <span className="text-2xl font-bold">{competitions.filter((c) => c.isLive).length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Live Now</p>
              </CardContent>
            </Card>
            {/* <Card className="text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                  <span className="text-2xl font-bold">{competitions.filter((c) => !c.isLive).length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </CardContent>
            </Card> */}
          </div>

          {/* Competitions Grid */}
          {competitions.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No competitions found</h3>
              <p className="text-muted-foreground">Check back later for new competitions!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {competitions.map((competition) => (
                <Card
                  key={competition._id}
                  className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={competition.pic || "/placeholder.svg?height=200&width=400"}
                      alt={competition.title}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      {competition.isLive ? (
                        <Badge className="bg-green-500 hover:bg-green-600 text-white animate-pulse">
                          <div className="h-2 w-2 bg-white rounded-full mr-1" />
                          Live
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                          Upcoming
                        </Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {competition.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">{competition.desc}</CardDescription>
                  </CardHeader>

                  {/* <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button className="flex-1" variant={competition.isLive ? "default" : "outline"}>
                        <Eye className="h-4 w-4 mr-2" />
                        {competition.isLive ? "Join Live" : "View Details"}
                      </Button>
                    </div>
                  </CardContent> */}
                  <CardContent className="pt-0">
                    <div className="flex gap-2" style={{ flexDirection: "column" }}>
                      <Button
                        onClick={() => {
                          handleClickSubmitId(competition._id);
                        }}
                        className="flex-1"
                        variant={competition.isLive ? "default" : "outline"}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>

                      <Button
                        onClick={() => {
                          handleClickSubmitId2(competition._id);
                        }}
                        className="flex-1"
                        variant={competition.isLive ? "default" : "outline"}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Participants
                      </Button>

                      <Button
                        onClick={async () => {
                          const confirmed = window.confirm("Are you sure you want to delete this event?");
                          if (!confirmed) return;

                          try {
                            const res = await fetch(`http://localhost:5000/competition/${competition._id}`, {
                              method: "DELETE",
                            });

                            const data = await res.json();

                            if (res.ok) {
                              toast.success("Event deleted successfully");

                              // Remove from UI if you're using a list
                              setCompetitions((prev) => prev.filter((e) => e._id !== competition._id));
                            } else {
                              toast.error(data?.error || "Failed to delete event");
                            }
                          } catch (error) {
                            console.error(error);
                            toast.error("Something went wrong");
                          }
                        }}
                        className="flex-1"
                        variant="destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
