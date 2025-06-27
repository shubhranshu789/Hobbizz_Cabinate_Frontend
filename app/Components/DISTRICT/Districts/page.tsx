"use client"

import { useEffect, useState, useCallback, useRef, Children } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Users, Landmark, Loader2, AlertCircle, Activity, Clock, FileText, School, SchoolIcon } from "lucide-react"

import Navbar from "../DirectorNavbar/page"



interface ClubDistrictInfo {
  district: string
  totalActivities: Number
  totalSchools: Number
  headRequests: Number
  totalStudents: Number
}
interface Number {
  length: number
}

interface DistrictState {
  data: ClubDistrictInfo | null
  loading: boolean
  error: string | null
}

interface UserInfo {
  clubName: string | null
  loading: boolean
  error: string | null
}

const districts = ["Varanasi", "Gurugram", "Ghaziabad", "Noida", "Gurgaon", "Muradabad", "Meerut", "Gautam Buddh Nagar", "Bulandshahr", "Faridabad", "Agra",   "Delhi"]

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function DistrictPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>(" ")
  const [districtStates, setDistrictStates] = useState<Record<string, DistrictState>>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>({
    clubName: "artclub",
    loading: false,
    error: null,
  })

  const router = useRouter()
  // Ref to track active requests for cleanup
  const activeRequests = useRef<Set<string>>(new Set())

  const filteredDistricts = districts.filter((district) => district.toLowerCase().includes(searchTerm.toLowerCase()))

  const fetchDistrictData = useCallback(
    async (districtName: string) => {
      if (!userInfo.clubName) {
        console.error("Club name not available")
        return
      }

      // Cancel if request is already in progress
      if (activeRequests.current.has(districtName)) {
        return
      }

      activeRequests.current.add(districtName)

      // Set loading state
      setDistrictStates((prev) => ({
        ...prev,
        [districtName]: {
          data: prev[districtName]?.data || null,
          loading: true,
          error: null,
        },
      }))

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

        const response = await fetch(
          `${API_BASE_URL}/${userInfo.clubName}/info?district=${encodeURIComponent(districtName)}`,
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          },
        )

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        // Validate response data
        if (!data || typeof data !== "object") {
          throw new Error("Invalid response format")
        }

        setDistrictStates((prev) => ({
          ...prev,
          [districtName]: {
            data: data,
            loading: false,
            error: null,
          },
        }))
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Request aborted for:", districtName)
          return
        }

        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        console.error("Error fetching district data:", error)

        setDistrictStates((prev) => ({
          ...prev,
          [districtName]: {
            data: prev[districtName]?.data || null,
            loading: false,
            error: errorMessage,
          },
        }))
      } finally {
        activeRequests.current.delete(districtName)
      }
    },
    [userInfo.clubName],
  )

  const handleDistrictClick = useCallback(
    (district: string) => {
      if (!userInfo.clubName) {
        console.error("Club name not available")
        return
      }

      setSelectedDistrict(district)
      setDialogOpen(true)

      // Only fetch if we don't have data or if there was an error
      const currentState = districtStates[district]
      if (!currentState?.data && !currentState?.loading) {
        fetchDistrictData(district)
      }
    },
    [districtStates, fetchDistrictData, userInfo.clubName],
  )

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
    // Don't clear selectedDistrict immediately to avoid flash
    setTimeout(() => setSelectedDistrict(""), 150)
  }, [])

  const retryFetch = useCallback(() => {
    if (selectedDistrict) {
      fetchDistrictData(selectedDistrict)
    }
  }, [selectedDistrict, fetchDistrictData])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeRequests.current.clear()
    }
  }, [])

  const currentDistrictState = selectedDistrict ? districtStates[selectedDistrict] : null

  return (
    <div>
      <Navbar />
    <div className="min-h-screen mt-8 bg-gradient-to-br from-blue-500 to-indigo-500 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-start mb-8">
          <h1 className="text-2xl font-bold text-white">District Directory</h1>
          {userInfo.clubName && (
            <p className="text-blue-100">
              Club: <span className="font-semibold">{userInfo.clubName}</span>
            </p>
          )}
          <div className="flex justify-end items-center gap-2">
            <Search className="text-white" />
            <Input
              placeholder="Search District..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredDistricts.map((district) => (
            <motion.div
              key={district}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDistrictClick(district)}
              className="cursor-pointer p-6 bg-white rounded-xl shadow-lg text-center text-blue-700 font-semibold text-xl hover:bg-blue-50 transition-colors"
            >
              <Landmark className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              {district}
            </motion.div>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-700 text-center">
                {selectedDistrict || "District Details"}
              </DialogTitle>
              {userInfo.clubName && <p className="text-center text-gray-600">Club: {userInfo.clubName}</p>}
            </DialogHeader>

            {currentDistrictState?.loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <span className="text-blue-600">Loading district details...</span>
              </div>
            )}

           

            {currentDistrictState?.data && (
              <div className="space-y-6">
                {/* Summary Cards - Only showing counts */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-6 rounded-lg text-center hover:bg-blue-100 transition-colors">
                    <SchoolIcon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                    <div className="text-3xl font-bold text-blue-700 mb-1">
                      {currentDistrictState.data.totalSchools.length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Total Schools</div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg text-center hover:bg-green-100 transition-colors">
                    <Activity className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <div className="text-3xl font-bold text-green-700 mb-1">
                      {currentDistrictState.data.totalActivities.length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Activities</div>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg text-center hover:bg-yellow-100 transition-colors">
                    <Users className="w-8 h-8 mx-auto mb-3 text-yellow-600" />
                    <div className="text-3xl font-bold text-yellow-700 mb-1">
                      {currentDistrictState.data.totalStudents.length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Total Students</div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg text-center hover:bg-purple-100 transition-colors">
                    <FileText className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                    <div className="text-3xl font-bold text-purple-700 mb-1">
                      {currentDistrictState.data.headRequests.length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Head Requests</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-8">
                  <Button 
                    className="w-half" 
                    size="lg"
                     
                  >
                    Activate Chapter
                  </Button>
                  <Button
                    // variant="outline"
                    className="w-half"
                    size="lg"
                    onClick={() => {
                      router.push(`../../../Components/DISTRICT/AssignHead?district=${encodeURIComponent(selectedDistrict)}`)
                    }}
                  >
                    Assign Head
                  </Button>
                </div>
              </div>
            )}

            {!currentDistrictState && selectedDistrict && (
              <div className="text-center py-8">
                <div className="mb-4">
                  <Landmark className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">No data loaded for this district</p>
                </div>
                <Button onClick={() => fetchDistrictData(selectedDistrict)}>Load District Data</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </div>
  )
}
