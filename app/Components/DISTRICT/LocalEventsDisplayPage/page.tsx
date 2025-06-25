import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const events = [
    {
      id: 2,
      title: "Art Exhibition",
      date: "25 July 2025",
      time: "02PM-05PM",
      status: "Upcoming",
      venue: "RDC, Ghaziabad",
      image: "/placeholder.svg?height=200&width=300",
      isPast: false,
    },
    {
      id: 3,
      title: "Watercolor Painting Competition",
      date: "28 July 2025",
      time: "10AM-01PM",
      status: "Upcoming",
      venue: "RDC, Ghaziabad",
      image: "/placeholder.svg?height=200&width=300",
      isPast: false,
    },
    {
      id: 5,
      title: "Digital Art Masterclass",
      date: "05 August 2025",
      time: "11AM-03PM",
      status: "Upcoming",
      venue: "Creative Hub, Ghaziabad",
      image: "/placeholder.svg?height=200&width=300",
      isPast: false,
    },
    {
      id: 6,
      title: "Portrait Sketching Session",
      date: "12 August 2025",
      time: "04PM-07PM",
      status: "Upcoming",
      venue: "Community Center, Ghaziabad",
      image: "/placeholder.svg?height=200&width=300",
      isPast: false,
    },
    {
      id: 4,
      title: "Sculpture Workshop",
      date: "15 June 2025",
      time: "09AM-04PM",
      status: "Past Event",
      venue: "Art Gallery, Ghaziabad",
      image: "/placeholder.svg?height=200&width=300",
      isPast: true,
    },
    {
      id: 1,
      title: "Drawing Competition",
      date: "01 July 2025",
      time: "10AM-12PM",
      status: "Past Event",
      venue: "RDC, Ghaziabad",
      image: "/placeholder.svg?height=200&width=300",
      isPast: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Local Events in Ghaziabad</h1>
          <p className="text-gray-600 text-lg">Discover and participate in local art events and competitions</p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Event Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
                <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                {/* Date Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <CalendarDays className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="text-xs text-gray-500">{event.time}</div>
                </div>
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <Badge
                    variant={event.isPast ? "secondary" : "default"}
                    className={event.isPast ? "bg-gray-500 text-white" : "bg-green-500 text-white"}
                  >
                    {event.status}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Event Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>

                {/* Venue */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Venue: {event.venue}</span>
                </div>

                {/* Register Button */}
                <Link href={event.id === 3 ? "/Components/DISTRICT/LocalEventOverview" : "#"}>
                  <Button
                    className={`w-full ${
                      event.isPast
                        ? "bg-gray-400 hover:bg-gray-500 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                    disabled={event.isPast}
                  >
                    {event.isPast ? "Event Ended" : "Register"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Our Art Community</h2>
            <p className="text-gray-600 mb-6">
              Connect with fellow artists, participate in competitions, and showcase your creativity in our local
              Ghaziabad chapter events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">View All Events</Button>
              <Button variant="outline" className="bg-white text-purple-600 border-purple-600 hover:bg-purple-50">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}