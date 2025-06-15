"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Users, Mail, Phone, MapPin, Loader2, AlertCircle, CheckCircle2, Crown } from "lucide-react"

interface Teacher {
  _id: string
  name: string
  email: string
  phone: string
  district: string
  club: string
  role: string
  status: string
  interest: string
  experience?: string
  qualification?: string
}

interface AssignHeadState {
  teachers: Teacher[]
  loading: boolean
  error: string | null
  assigningId: string | null
  showConfirmation: boolean
  assignedTeacher: Teacher | null
}

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function AssignHeadPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const district = searchParams.get("district")
  const club = searchParams.get("club")

  const [state, setState] = useState<AssignHeadState>({
    teachers: [],
    loading: false,
    error: null,
    assigningId: null,
    showConfirmation: false,
    assignedTeacher: null,
  })

  const fetchTeachers = useCallback(async () => {
    if (!district) return

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(`${API_BASE_URL}/getteachers?district=${encodeURIComponent(district)}`)

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("No approved district heads found in this district")
        }
        throw new Error(`Failed to fetch teachers: ${response.status} ${response.statusText}`)
      }

      const teachers = await response.json()
      setState((prev) => ({ ...prev, teachers, loading: false }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }))
    }
  }, [district])

  const assignHead = useCallback(
    async (teacherId: string) => {
      setState((prev) => ({ ...prev, assigningId: teacherId, error: null }))

      try {
        const response = await fetch(`${API_BASE_URL}/sethead/${teacherId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to assign head: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()
        const assignedTeacher = state.teachers.find((t) => t._id === teacherId)

        setState((prev) => ({
          ...prev,
          assigningId: null,
          showConfirmation: true,
          assignedTeacher: assignedTeacher || null,
          teachers: prev.teachers.map((t) => (t._id === teacherId ? { ...t, role: "head" } : t)),
        }))

        // Auto redirect after 3 seconds
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        setState((prev) => ({
          ...prev,
          assigningId: null,
          error: errorMessage,
        }))
      }
    },
    [state.teachers, router],
  )

  useEffect(() => {
    if (district) {
      fetchTeachers()
    }
  }, [fetchTeachers, district])

  const handleBackClick = () => {
    router.push("../../../Components/DISTRICT/Districts")
  }

  const retryFetch = () => {
    fetchTeachers()
  }

  if (!district) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Invalid Request</h2>
            <p className="text-gray-600 mb-4">District information is missing.</p>
            <Button onClick={handleBackClick}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Districts
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-500 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={handleBackClick} className="text-white hover:bg-white/20 mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white">Assign District Head</h1>
            <p className="text-blue-100 mt-2">
              District: <span className="font-semibold">{district}</span>
              {club && (
                <>
                  {" • "}Club: <span className="font-semibold">{club}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {state.showConfirmation && state.assignedTeacher && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Head Assigned Successfully!</h2>
                <p className="text-gray-600 mb-4">
                  <span className="font-semibold">{state.assignedTeacher.name}</span> has been assigned as the district
                  head for {district}.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                  <Crown className="w-4 h-4" />
                  <span>Redirecting back to districts...</span>
                </div>
                <Button onClick={() => router.push("/")} className="w-full">
                  Continue
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {state.loading && (
          <div className="flex items-center justify-center py-12">
            <Card className="max-w-md w-full">
              <CardContent className="p-8 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Loading Teachers</h3>
                <p className="text-gray-600">Fetching available district heads...</p>
              </CardContent>
            </Card>
          </div>
        )}

        

        {/* Teachers Grid */}
        {!state.loading && state.teachers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.teachers.map((teacher) => (
              <motion.div
                key={teacher._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-blue-700 flex items-center gap-2">
                          {teacher.name}
                          {teacher.role === "head" && <Crown className="w-5 h-5 text-yellow-500" />}
                        </CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={teacher.role === "head" ? "default" : "secondary"}>{teacher.role}</Badge>
                          <Badge variant="outline">{teacher.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{teacher.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{teacher.district}</span>
                    </div>
                    {teacher.qualification && (
                      <div className="text-sm text-gray-600">
                        <strong>Qualification:</strong> {teacher.qualification}
                      </div>
                    )}
                    {teacher.experience && (
                      <div className="text-sm text-gray-600">
                        <strong>Experience:</strong> {teacher.experience}
                      </div>
                    )}

                    <div className="pt-4">
                      <Button
                        onClick={() => assignHead(teacher._id)}
                        disabled={
                          teacher.role === "head" || state.assigningId === teacher._id || state.assigningId !== null
                        }
                        className="w-full"
                        variant={teacher.role === "head" ? "outline" : "default"}
                      >
                        {state.assigningId === teacher._id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Assigning...
                          </>
                        ) : teacher.role === "head" ? (
                          <>
                            <Crown className="w-4 h-4 mr-2" />
                            Current Head
                          </>
                        ) : (
                          <>
                            <Users className="w-4 h-4 mr-2" />
                            Assign as Head
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!state.loading && !state.error && state.teachers.length === 0 && (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Teachers Found</h3>
              <p className="text-gray-600 mb-4">No approved district heads found in {district}.</p>
              <Button onClick={retryFetch} variant="outline">
                Refresh
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
