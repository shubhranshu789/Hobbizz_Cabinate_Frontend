"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ThumbsUp, ThumbsDown, Search, Bell, LogOut, Home, PlusCircle, User, Info, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Sample data - replace with your actual data
const sampleActivities = [
  {
    _id: "1",
    pic: "/placeholder.svg?height=300&width=500",
    title: "Educational Workshop",
    desc: "Learn the fundamentals of digital marketing for educational institutions",
    category: "Workshop",
  },
  {
    _id: "2",
    pic: "/placeholder.svg?height=300&width=500",
    title: "Content Strategy Seminar",
    desc: "Develop effective content strategies for your educational platform",
    category: "Seminar",
  },
  {
    _id: "3",
    pic: "/placeholder.svg?height=300&width=500",
    title: "Social Media for Schools",
    desc: "Leverage social media to increase enrollment and engagement",
    category: "Training",
  },
]

export default function ActivityListing() {
  const [activities, setActivities] = useState(sampleActivities)
  const [approvals, setApprovals] = useState({})
  const [selectedActivity, setSelectedActivity] = useState(null)

  const handleApproval = (id, isApproved) => {
    setApprovals((prev) => ({
      ...prev,
      [id]: isApproved,
    }))
  }

  const openActivityModal = (activity) => {
    setSelectedActivity(activity)
  }

  const closeActivityModal = () => {
    setSelectedActivity(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-400">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", ease: "linear" }}
            className="bg-blue-600 text-white p-1 rounded-md"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L4 6V18L12 22L20 18V6L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
          <span className="font-bold text-xl text-blue-600">BOOSTUP</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="flex items-center gap-2">
            <Home size={18} />
            <span>Home</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <PlusCircle size={18} />
            <span>Add Activity</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Info size={18} />
            <span>About</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Phone size={18} />
            <span>Contact</span>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Search size={20} />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" className="hidden md:flex items-center gap-2">
            <User size={18} />
            <span>Profile</span>
          </Button>
          <Button variant="primary" className="bg-blue-600 text-white hidden md:flex items-center gap-2">
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </nav>

      {/* Welcome Banner */}
      <div className="text-center text-white py-12 px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-2"
        >
          Good Afternoon! Welcome Back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-3xl font-semibold"
        >
          Shubhranshu
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-2 text-blue-100"
        >
          Sunday, June 8, 2025
        </motion.p>
      </div>

      {/* Activities Grid */}
      <div className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-white mb-6">Recent Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <motion.div
              key={activity._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="overflow-hidden h-full bg-white/95 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <div className="relative cursor-pointer" onClick={() => openActivityModal(activity)}>
                  <img
                    src={activity.pic || "/placeholder.svg"}
                    alt={activity.title}
                    className="w-full h-48 object-cover hover:opacity-90 transition-opacity duration-200"
                  />
                  <Badge className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700">{activity.category}</Badge>
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                    <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V8L15 3Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 3V8H19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 12L12 14L16 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                  <p className="text-gray-600 mb-4">{activity.desc}</p>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-2">
                      <Button
                        variant={approvals[activity._id] === true ? "default" : "outline"}
                        size="sm"
                        className={approvals[activity._id] === true ? "bg-green-600 hover:bg-green-700" : ""}
                        onClick={() => handleApproval(activity._id, true)}
                      >
                        <ThumbsUp size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant={approvals[activity._id] === false ? "default" : "outline"}
                        size="sm"
                        className={approvals[activity._id] === false ? "bg-red-600 hover:bg-red-700" : ""}
                        onClick={() => handleApproval(activity._id, false)}
                      >
                        <ThumbsDown size={16} className="mr-1" />
                        Disapprove
                      </Button>
                    </div>
                    <span className="text-xs text-gray-500">ID: {activity._id}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>


      {/* Activity Detail Modal */}
      <Dialog open={!!selectedActivity} onOpenChange={closeActivityModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-600">{selectedActivity?.title}</DialogTitle>
          </DialogHeader>

          {selectedActivity && (
            <div className="space-y-6">
              {/* Enlarged Image */}
              <div className="relative w-full">
                <img
                  src={selectedActivity.pic || "/placeholder.svg"}
                  alt={selectedActivity.title}
                  className="w-full max-h-96 object-contain rounded-lg shadow-lg"
                />
                <Badge className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 text-sm">
                  {selectedActivity.category}
                </Badge>
              </div>

              {/* Activity Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedActivity.desc}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Category</h4>
                    <p className="text-gray-600">{selectedActivity.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Activity ID</h4>
                    <p className="text-gray-600 font-mono">{selectedActivity._id}</p>
                  </div>
                </div>

                {/* Additional Details Section */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Additional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="ml-2 text-gray-600">
                        {approvals[selectedActivity._id] === true
                          ? "Approved"
                          : approvals[selectedActivity._id] === false
                            ? "Disapproved"
                            : "Pending Review"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Date Added:</span>
                      <span className="ml-2 text-gray-600">June 8, 2025</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons in Modal */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant={approvals[selectedActivity._id] === true ? "default" : "outline"}
                    className={approvals[selectedActivity._id] === true ? "bg-green-600 hover:bg-green-700" : ""}
                    onClick={() => handleApproval(selectedActivity._id, true)}
                  >
                    <ThumbsUp size={16} className="mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant={approvals[selectedActivity._id] === false ? "default" : "outline"}
                    className={approvals[selectedActivity._id] === false ? "bg-red-600 hover:bg-red-700" : ""}
                    onClick={() => handleApproval(selectedActivity._id, false)}
                  >
                    <ThumbsDown size={16} className="mr-2" />
                    Disapprove
                  </Button>
                  <Button variant="outline" onClick={closeActivityModal}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>





      
    </div>
  )
}
