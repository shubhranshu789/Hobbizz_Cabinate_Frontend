"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Mail, Phone, GraduationCap } from "lucide-react"
import { SchoolIcon } from "lucide-react"
import Navbar from "../../Navbar/page"

interface User {
  _id: string
  name: string
  email: string
  phone?: string
}

interface School {
  _id: string
  school: string
  district: string
  club: string
  ambassador?: User
  captain?: User
  correspondent?: User
}

interface UserData {
  club: string
  district: string
  name: string
}

// Mock user data - replace with actual user context/auth
const mockUserData: UserData = {
  club: "artclub",
  district: "Varanasi",
  name: "Tony Stark",
}

export default function ManageSchool() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userdata] = useState<UserData>(mockUserData)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    fetchSchools()
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100)
  }, [userdata.club, userdata.district])

  const fetchSchools = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `http://localhost:5000/get-school?club=${encodeURIComponent(userdata.club)}&district=${encodeURIComponent(userdata.district)}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch schools")
      }

      const data = await response.json()
      console.log(data)

      // Sort schools alphabetically by name
      if (data.schools && Array.isArray(data.schools)) {
      const sortedSchools = data.schools.sort((a: School, b: School) => a.school.localeCompare(b.school))
      
      setSchools(sortedSchools)
      }
      else{
        setSchools([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const ContactInfo = ({ user, role, roleIcon }: { user?: User; role: string; roleIcon: React.ReactNode }) => {
    if (!user) {
      return (
        <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-slate-400 mb-1">{roleIcon}</div>
          <div className="text-sm text-slate-500">No {role} assigned</div>
        </div>
      )
    }

    return (
      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200 hover:shadow-md transition-all duration-300">
        <div className="text-blue-600 mb-2">{roleIcon}</div>
        <div className="font-semibold text-lg text-slate-800 mb-2">{user.name}</div>
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
            <Mail className="h-3 w-3 text-blue-500" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phone && (
            <div className="flex items-center justify-center gap-1 text-sm text-slate-600">
              <Phone className="h-3 w-3 text-blue-500" />
              {user.phone}
            </div>
          )}
        </div>
      </div>
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
          <Skeleton className="h-20 w-full bg-blue-100" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div>
      <Navbar />
    <div className="min-h-screen mt-6 bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="container mx-auto p-4 space-y-4">
        {/* Header Section */}
        <div
          className={`space-y-2 mt-6  mb-2 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Manage Schools
          </h1>
          <p className="text-slate-600 text-lg">
            {userdata.club} • {userdata.district}
          </p>
        </div>

        {/* Total Count Card */}
        <Card
          className={`border-blue-200 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg transform transition-all duration-1000 delay-200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <CardContent className="p-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <SchoolIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{schools.length}</p>
                <p className="text-blue-100">Total Schools in {userdata.district}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schools List */}
        <div className="space-y-3">
          {schools.length === 0 ? (
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <SchoolIcon className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2 text-slate-700">No Schools Found</h3>
                  <p className="text-slate-500">
                    No schools are registered for {userdata.club} in {userdata.district}.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            schools.map((school, index) => (
              <Card
                key={school._id}
                className={`border-slate-200 bg-white hover:shadow-lg transition-all duration-500 transform ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{
                  transitionDelay: `${300 + index * 100}ms`,
                }}
              >
                <CardHeader className="p-3 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-800">{school.school}</CardTitle>
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      School
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Ambassador */}
                    <ContactInfo
                      user={school.ambassador}
                      role="ambassador"
                      roleIcon={<Users className="h-5 w-5 mx-auto" />}
                    />

                    {/* School Captain */}
                    <ContactInfo
                      user={school.captain}
                      role="captain"
                      roleIcon={<GraduationCap className="h-5 w-5 mx-auto" />}
                    />

                    {/* School Correspondent */}
                    <ContactInfo
                      user={school.correspondent}
                      role="correspondent"
                      roleIcon={<Mail className="h-5 w-5 mx-auto" />}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
    </div>
  )
}
