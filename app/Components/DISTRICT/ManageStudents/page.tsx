"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Phone, GraduationCap, Eye, Crown, UserCheck } from "lucide-react"

import Navbar from "../../Navbar/page"

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  class?: string
}

interface Student {
  _id: string
  name: string
  email: string
  phone?: string
  class: string
  school: string
  club: string
  district: string
}

interface UserData {
  club: string
  district: string
  school: string
  name: string
  email: string
}

export default function Students() {
  const [userdata, setUserdata] = useState<UserData | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [captain, setCaptain] = useState<User | null>(null)
  const [correspondent, setCorrespondent] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [makingCaptain, setMakingCaptain] = useState<string | null>(null)

  useEffect(() => {
    // Get user data from localStorage
    const UserData = localStorage.getItem("user")
    const token = localStorage.getItem("jwt")
    if (UserData && token) {
      const parsedUserData = JSON.parse(UserData)
      setUserdata(parsedUserData)
    } else {
      // Mock data for development
      setUserdata({
        club: "artclub",
        district: "Varanasi",
        school: "St. Mary's High School",
        name: "Tony Stark",
        email: "tony@example.com",
      })
    }
  }, [])

  useEffect(() => {
    if (userdata) {
      fetchAllData()
      // Trigger animation after component mounts
      setTimeout(() => setIsVisible(true), 100)
    }
  }, [userdata])

  const fetchAllData = async () => {
    if (!userdata) return

    try {
      setLoading(true)
      setError(null)

      // Fetch all data concurrently
      const [studentsRes, captainRes, correspondentRes] = await Promise.all([
        fetch(
          `http://localhost:5000/get-students?club=${encodeURIComponent(userdata.club)}&district=${encodeURIComponent(userdata.district)}&school=${encodeURIComponent(userdata.school)}`,
        ),
        fetch(
          `http://localhost:5000/get-captain?club=${encodeURIComponent(userdata.club)}&district=${encodeURIComponent(userdata.district)}&school=${encodeURIComponent(userdata.school)}`,
        ),
        fetch(
          `http://localhost:5000/get-correspondent?club=${encodeURIComponent(userdata.club)}&district=${encodeURIComponent(userdata.district)}&school=${encodeURIComponent(userdata.school)}`,
        ),
      ])

      // Process students data
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json()
        const sortedStudents =
          studentsData.students?.sort((a: Student, b: Student) => a.name.localeCompare(b.name)) || []
        setStudents(sortedStudents)
      }

      // Process captain data
      if (captainRes.ok) {
        const captainData = await captainRes.json()
        setCaptain(captainData.captain || null)
      }

      // Process correspondent data
      if (correspondentRes.ok) {
        const correspondentData = await correspondentRes.json()
        setCorrespondent(correspondentData.correspondent || null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleViewProfile = (studentId: string) => {
    // Implement view profile logic
    console.log("View profile for student:", studentId)
  }

  const handleMakeCaptain = async (studentId: string) => {
    if (!userdata) return

    try {
      setMakingCaptain(studentId)

      const response = await fetch("http://localhost:5000/set-captain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          club: userdata.club,
          district: userdata.district,
          school: userdata.school,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to set captain")
      }

      const result = await response.json()

      // Update the captain state with the new captain data
      setCaptain(result.captain)

      // Optional: Show success message
      console.log("Captain set successfully:", result.message)
    } catch (err) {
      console.error("Error setting captain:", err)
      setError(err instanceof Error ? err.message : "Failed to set captain")
    } finally {
      setMakingCaptain(null)
    }
  }

  const LeaderCard = ({
    user,
    role,
    icon,
    bgGradient,
  }: {
    user?: User | null
    role: string
    icon: React.ReactNode
    bgGradient: string
  }) => {
    return (
      <Card
        className={`border-blue-200 ${bgGradient} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">{icon}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">{role}</h3>
              {user ? (
                <div className="space-y-1">
                  <div className="font-medium text-white">{user.name}</div>
                  <div className="flex items-center gap-2 text-blue-100 text-sm">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-blue-100">No {role.toLowerCase()} assigned</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        <div className="container mx-auto p-4 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 bg-blue-100" />
            <Skeleton className="h-6 w-96 bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 bg-blue-100" />
            <Skeleton className="h-32 bg-blue-100" />
          </div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        
      </div>
    )
  }

  if (!userdata) {
    return (
      <div className=" min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
        
      </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
       <Navbar />
      <div className="container mt-6 mx-auto p-4 space-y-4">
        {/* Header Section */}
        <div
          className={`space-y-2 mt-6 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
        >
          <h4 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Students Management
          </h4>
          <p className="text-slate-600 text-md">
            {userdata.school} • {userdata.club} • {userdata.district}
          </p>
        </div>

        {/* Leader Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 transform transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <LeaderCard
            user={captain}
            role="Club Captain"
            icon={<Crown className="h-6 w-6 text-white" />}
            bgGradient="bg-gradient-to-r from-blue-600 to-blue-700"
          />
          <LeaderCard
            user={correspondent}
            role="Club Correspondent"
            icon={<UserCheck className="h-6 w-6 text-white" />}
            bgGradient="bg-gradient-to-r from-blue-700 to-blue-800"
          />
        </div>

        {/* Students Count */}
        <div
          className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{students.length}</p>
                    <p className="text-slate-600">Total Students</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students List */}
        <div
          className={`space-y-2 transform transition-all duration-1000 delay-400 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {students.length === 0 ? (
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <GraduationCap className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2 text-slate-700">No Students Found</h3>
                  <p className="text-slate-500">No students are registered in {userdata.school}.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-1">
              {students.map((student, index) => (
                <Card
                  key={student._id}
                  className={`border-slate-200 bg-white hover:shadow-md hover:border-blue-300 transition-all duration-300 transform ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${500 + index * 50}ms`,
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <GraduationCap className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                          <div>
                            <div className="font-semibold text-slate-800">{student.name}</div>
                            <Badge variant="outline" className="text-xs mt-1 border-blue-200 text-blue-700">
                              Class {student.class}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Mail className="h-3 w-3 text-blue-500" />
                            <span className="truncate">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Phone className="h-3 w-3 text-blue-500" />
                            {student.phone || "N/A"}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewProfile(student._id)}
                              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleMakeCaptain(student._id)}
                              disabled={makingCaptain === student._id}
                              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                            >
                              {makingCaptain === student._id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                  Setting...
                                </>
                              ) : (
                                <>
                                  <Crown className="h-3 w-3 mr-1" />
                                  Captain
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
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
