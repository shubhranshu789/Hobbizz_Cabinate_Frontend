"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../Navbar/page"

interface Event {
  event_id: string;
  title: string;
  date: string;
  venue: string;
  description?: string;
  status: string;
  image?: string;
}

const LocalEventsDisplayPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) setUserData(JSON.parse(storedUserData));
    else setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!userData) return;
    setIsLoading(true);
    setError(null);
    fetch(
      `http://localhost:5000/get-events?club=${userData.club}&district=${userData.district}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setEvents(data.events || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load events");
        setIsLoading(false);
      });
  }, [userData]);

  if (isLoading) {
    return (
      <div>
        <Navbar />
      <div className="text-center py-10 text-lg font-semibold">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500 font-semibold">{error}</div>
    );
  }

  if (!events.length) {
    return (
      <div>
        <Navbar />
      
      <div className="text-center py-10 text-gray-500 font-semibold">
        No events found for your district/club.
      </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Navbar />
      <div className="max-w-6xl mt-6 mx-auto">
        {/* Header */}
        <div className="text-center mt-6 mb-12">
          <h1 className="text-3xl mt-6 md:text-4xl font-bold text-gray-900 mb-2">
            Local Events {userData?.district ? `in ${userData.district}` : ""}
          </h1>
          <p className="text-gray-600 text-lg">
            Discover and participate in local art events and competitions
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const dateObj = new Date(event.date);
            const prettyDate = dateObj.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            });
            const isPast = dateObj < new Date();
            const statusText =
              event.status === "Active"
                ? "Upcoming"
                : event.status === "Inactive"
                ? "Past Event"
                : event.status;

            return (
              <Card key={event.event_id} className="relative overflow-hidden">
                <div className="h-40 bg-gradient-to-tr from-blue-200 via-indigo-100 to-purple-100 flex items-center justify-center">
                  {/* Optionally show image */}
                  {event.image ? (
                    <Image
                      src={event.image}
                      alt={event.title}
                      width={240}
                      height={120}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-2xl text-gray-400">No image</span>
                  )}
                  {/* Date Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white text-gray-800 font-semibold flex items-center">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      {prettyDate}
                    </Badge>
                  </div>
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={isPast ? "secondary" : "default"}
                      className={
                        isPast
                          ? "bg-gray-500 text-white"
                          : "bg-green-500 text-white"
                      }
                    >
                      {statusText}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Venue: {event.venue}</span>
                  </div>
                  <Link href={`/Components/DISTRICT/LocalEventOverview?event_id=${encodeURIComponent(event.event_id)}`}>
                    <Button
                      className={`w-full ${
                        isPast
                          ? "bg-gray-400 hover:bg-gray-500 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                      disabled={isPast}
                    >
                      {isPast ? "Event Ended" : "Register"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LocalEventsDisplayPage;