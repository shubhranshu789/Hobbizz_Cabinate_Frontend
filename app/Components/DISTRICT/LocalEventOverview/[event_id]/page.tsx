"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin } from "lucide-react";

interface Event {
  event_id: string;
  title: string;
  date: string;
  venue: string;
  description?: string;
  status: string;
  image?: string;
}

const LocalEventOverviewPage = () => {
  const { event_id } = useParams<{ event_id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!event_id) return;
    setIsLoading(true);
    fetch(`http://localhost:5000/overview/event/${event_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch event details");
        return res.json();
      })
      .then((data) => {
        setEvent(data.event || null);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load event details");
        setIsLoading(false);
      });
  }, [event_id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg font-semibold">Loading event details...</span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-500 font-semibold">{error || "Event not found"}</span>
      </div>
    );
  }

  const dateObj = new Date(event.date);
  const prettyDate = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const isPast = dateObj < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{event.title}</h1>
            <p className="text-xl md:text-2xl opacity-90">{event.description}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto mt-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Badge className={isPast ? "bg-gray-500 text-white" : "bg-green-500 text-white"}>
                {isPast ? "Past Event" : "Upcoming"}
              </Badge>
              <span className="text-sm text-gray-400">
                <CalendarDays className="w-4 h-4 inline mr-1" />
                {prettyDate}
              </span>
            </div>
            {event.image && (
              <div className="mb-4 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={event.image}
                  alt={event.title}
                  className="rounded-xl shadow-lg max-h-72 object-cover"
                />
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Venue: {event.venue}</span>
              </div>
              <div className="text-gray-600">
                <span>
                  Status:{" "}
                  <span className={isPast ? "text-gray-500" : "text-green-600"}>
                    {isPast ? "Past Event" : "Upcoming"}
                  </span>
                </span>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-gray-800">{event.description || "No description provided."}</p>
              </div>
            </div>
            {/* Add more details/sections as you wish */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LocalEventOverviewPage;