"use client"
import React, { useEffect, useState } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

interface Event {
  event_id: string
  title: string
  date: string
  venue: string
  description?: string
  status: string
  // Add other fields as needed
}

const LocalEventsDisplayPage = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const storedUserData = localStorage.getItem("user")
    if (storedUserData) setUserData(JSON.parse(storedUserData))
  }, [])

  useEffect(() => {
    if (!userData) return
    fetch(`http://localhost:5000/get-events?club=${userData.club}&district=${userData.district}`)
      .then(res => res.json())
      .then(data => setEvents(data.events as Event[] || []))
      .catch(err => console.error(err))
  }, [userData])

  return (
    <div>
      {/* ...header... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.event_id} className="card">
            <h3>{event.title}</h3>
            <p>{event.date}</p>
            <p>{event.venue}</p>
            <a href={`/Components/DISTRICT/LocalEventOverview/${event.event_id}`}>View Details</a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LocalEventsDisplayPage