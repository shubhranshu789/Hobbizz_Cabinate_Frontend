"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, MapPin, Clock, Globe, Building, Users } from "lucide-react"
import Navbar from "../Navbar/page"

interface Event {
  event_id: string
  title: string
  date: string
  venue: string
  description?: string
  status: string
  created_at: string
  updated_at: string
  club: string
  director: {
    name: string
    email: string
  }
  district: string
  head: {
    name: string
    email: string
  }
}

function LocalEventOverviewContent() {
  const searchParams = useSearchParams()
  const event_id = searchParams.get("event_id")
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch event details
  useEffect(() => {
    if (!event_id) {
      setError("Event ID is missing")
      setIsLoading(false)
      return
    }

    const fetchEvent = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/event-details?event_id=${encodeURIComponent(event_id)}`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        // Since API returns a single event document, use it directly
        if (data) {
          setEvent(data)
        } else {
          throw new Error("Event not found or invalid response format")
        }
      } catch (err) {
        console.error("Error fetching event:", err)
        setError(err instanceof Error ? err.message : "Failed to load event details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [event_id])

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }

  const handleRetry = () => {
    if (event_id) {
      setError(null)
      setIsLoading(true)
      // The useEffect will automatically re-run and fetch the data
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <span className="text-lg font-semibold text-gray-700">Loading event details...</span>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <span className="text-red-500 font-semibold block mb-2 text-xl">Failed to load event details</span>
          <p className="text-gray-600 mb-2">{error}</p>
          {event_id && <p className="text-gray-500 text-sm mb-4">Event ID: {event_id}</p>}
          <div className="flex gap-2 justify-center">
            <Button onClick={handleGoBack} variant="outline" className="bg-gray-100 hover:bg-gray-200">
              Go Back
            </Button>
            <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const dateObj = new Date(event.date)
  const prettyDate = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
  const prettyTime = dateObj.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const isPast = dateObj < new Date()
  const daysUntilEvent = Math.ceil((dateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Upcoming"
      case "inactive":
        return "Past Event"
      default:
        return status
    }
  }

  const statusText = getStatusText(event.status)

  return (
    <div>
      <Navbar />
      <div className="min-h-screen mt-16 bg-gray-50">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{event.title}</h1>
              <p className="text-xl md:text-2xl opacity-90">
                {event.description || "Join this exciting local event and showcase your talent."}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex space-x-8 overflow-x-auto">
              {[
                { name: "Overview", active: true },
                { name: "Event Details", active: false },
                { name: "Organizers", active: false },
                { name: "Contact", active: false },
              ].map((tab) => (
                <button
                  key={tab.name}
                  className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    tab.active
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h2>
                <p className="text-xl text-gray-600 mb-6">
                  {event.description || "Join this amazing local event and be part of the community."}
                </p>
                <Button
                  size="lg"
                  className={`px-8 py-3 transition-colors ${
                    isPast ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={isPast}
                >
                  {isPast ? "Event Ended" : "Register for Event"}
                </Button>
              </div>

              {/* Event Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Event Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="mb-2">• Open to all skill levels</p>
                      <p className="mb-2">• Local community event</p>
                      <p className="mb-2">• Organized by {event.club}</p>
                    </div>
                    <div>
                      <p className="mb-2">• District: {event.district}</p>
                      <p className="mb-2">• Status: {statusText}</p>
                      <p className="mb-2">• Registration required</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Event Details */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">About This Event</h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      {event.description ||
                        `Join us for ${event.title}, an exciting community event organized by ${event.club}. 
                      This is a great opportunity to connect with fellow community members and participate in 
                      local activities.`}
                    </p>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Event Organizer</h4>
                      <p className="text-blue-800 text-sm">
                        <strong>{event.club}</strong>
                        <br />
                        Director: {event.director.name}
                        <br />
                        Contact: {event.director.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Event Info */}
            <div className="space-y-6">
              {/* Countdown */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge
                      className={`px-3 py-1 ${isPast ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800"}`}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      {isPast ? "Event Ended" : `${daysUntilEvent} days to go`}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Event Date</h4>
                      <p className="text-gray-600 flex items-center">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        {prettyDate} @ {prettyTime}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Globe className="w-4 h-4 mr-2" />
                        <span>Offline Event</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Building className="w-4 h-4 mr-2" />
                        <span>Public</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        {event.club}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        Local Event
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Community
                      </Badge>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        {event.district}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Venue Information */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Venue Details</h4>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{event.venue}</p>
                        <p className="text-sm">{event.district}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{prettyTime} onwards</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Contact Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">Club Director</p>
                      <p className="text-gray-600">{event.director.name}</p>
                      <p className="text-blue-600">{event.director.email}</p>
                    </div>
                    <div className="border-t pt-3">
                      <p className="font-medium text-gray-900">District Head</p>
                      <p className="text-gray-600">{event.head.name}</p>
                      <p className="text-blue-600">{event.head.email}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LocalEventOverviewPage() {
  return (
    <div>
      <LocalEventOverviewContent />
    </div>
  )
}
