import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, MapPin, Trophy, Clock, Globe, Building } from 'lucide-react'
import Link from "next/link"

export default function WatercolorCompetitionOverview() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Watercolor Painting Competition</h1>
            <p className="text-xl md:text-2xl opacity-90">Express your creativity through the beauty of watercolors.</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { name: "Overview", active: true },
              { name: "My submissions", active: false },
              { name: "Participants (127)", active: false },
              { name: "Resources", active: false },
              { name: "Rules", active: false },
              { name: "Gallery", active: false },
              { name: "Updates", active: false },
              { name: "Discussions", active: false },
            ].map((tab) => (
              <button
                key={tab.name}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Watercolor Painting Competition</h2>
              <p className="text-xl text-gray-600 mb-6">Paint. Create. Win Amazing Prizes.</p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Join Competition
              </Button>
            </div>

            {/* Who can participate */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Who can participate</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="mb-2">• Artists of all skill levels welcome</p>
                    <p className="mb-2">• Age 16 and above</p>
                    <p className="mb-2">• Residents of Ghaziabad and nearby areas</p>
                  </div>
                  <div>
                    <p className="mb-2">• Original artwork only</p>
                    <p className="mb-2">• Individual participation</p>
                    <p className="mb-2">• Must bring own materials</p>
                  </div>
                </div>
                <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View full rules →
                </Link>
              </CardContent>
            </Card>

            {/* Competition Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Competition Details</h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Join us for an exciting watercolor painting competition where artists will showcase their creativity
                    and skill. Participants will have 3 hours to create their masterpiece on the theme "Nature's
                    Beauty".
                  </p>
                  <p>
                    All necessary materials including watercolor paper, brushes, and paints will be provided. However,
                    participants are welcome to bring their preferred brushes and additional supplies.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Theme: "Nature's Beauty"</h4>
                    <p className="text-blue-800 text-sm">
                      Express the beauty of nature through your watercolor paintings. This can include landscapes,
                      flowers, animals, or any natural elements that inspire you.
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
                  <Badge className="bg-green-100 text-green-800 px-3 py-1">
                    <Clock className="w-4 h-4 mr-1" />
                    23 more days to deadline
                  </Badge>
                  <Link href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                    View schedule
                  </Link>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Deadline</h4>
                    <p className="text-gray-600 flex items-center">
                      <CalendarDays className="w-4 h-4 mr-2" />
                      28 Jul 2025 @ 1:00pm GMT+5:30
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-4 h-4 mr-2" />
                      <span>Offline</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      <span>Public</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₹15,000</span>
                      <p className="text-sm text-gray-500">in prizes</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">127</span>
                      <p className="text-sm text-gray-500">participants</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Building className="w-4 h-4 mr-2" />
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Ghaziabad Art Club
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Watercolor
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Painting
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      Competition
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
                      <p className="font-medium">RDC, Ghaziabad</p>
                      <p className="text-sm">Raj Nagar District Centre, Ghaziabad, Uttar Pradesh</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>10:00 AM - 1:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prizes */}
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                  Prize Distribution
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">1st Place:</span>
                    <span className="font-semibold text-yellow-600">₹8,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">2nd Place:</span>
                    <span className="font-semibold text-gray-600">₹5,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">3rd Place:</span>
                    <span className="font-semibold text-orange-600">₹2,000</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-xs text-gray-500">+ Certificates for all participants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}