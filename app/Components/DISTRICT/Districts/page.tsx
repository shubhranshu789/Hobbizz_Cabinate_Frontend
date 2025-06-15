"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Users, Landmark, Loader2, AlertCircle } from "lucide-react"

interface DistrictInfo {
  name: string
  totalMembers: number
  students: number
  teachers: number

  maxMembers: number
}

interface DistrictState {
  data: DistrictInfo | null
  loading: boolean
  error: string | null
}

const districts = ["Varanasi", "Lucknow", "Kanpur", "Prayagraj", "Agra", "Noida", "Ghaziabad", "Jaunpur"]

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function DistrictPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [districtStates, setDistrictStates] = useState<Record<string, DistrictState>>({})
  const [dialogOpen, setDialogOpen] = useState(false)

  const router = useRouter()
  // Ref to track active requests for cleanup
  const activeRequests = useRef<Set<string>>(new Set())

  const filteredDistricts = districts.filter((district) => district.toLowerCase().includes(searchTerm.toLowerCase()))

  const fetchDistrictData = useCallback(async (name: string) => {
    // Cancel if request is already in progress
    if (activeRequests.current.has(name)) {
      return
    }

    activeRequests.current.add(name)

    // Set loading state
    setDistrictStates((prev) => ({
      ...prev,
      [name]: {
        data: prev[name]?.data || null,
        loading: true,
        error: null,
      },
    }))

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

      const response = await fetch(`${API_BASE_URL}/districtinfo?name=${encodeURIComponent(name)}`, {
        signal: controller.signal,
      })

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
        [name]: {
          data: data,
          loading: false,
          error: null,
        },
      }))
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Request aborted for:", name)
        return
      }

      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      console.error("Error fetching district data:", error)

      setDistrictStates((prev) => ({
        ...prev,
        [name]: {
          data: prev[name]?.data || null,
          loading: false,
          error: errorMessage,
        },
      }))
    } finally {
      activeRequests.current.delete(name)
    }
  }, [])

  const handleDistrictClick = useCallback(
    (district: string) => {
      setSelectedDistrict(district)
      setDialogOpen(true)

      // Only fetch if we don't have data or if there was an error
      const currentState = districtStates[district]
      if (!currentState?.data && !currentState?.loading) {
        fetchDistrictData(district)
      }
    },
    [districtStates, fetchDistrictData],
  )

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
    // Don't clear selectedDistrict immediately to avoid flash
    setTimeout(() => setSelectedDistrict(null), 150)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-500 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">District Directory</h1>
          <div className="flex justify-center items-center gap-2">
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-blue-700 text-center">
                {selectedDistrict || "District Details"}
              </DialogTitle>
            </DialogHeader>

            {currentDistrictState?.loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <span className="text-blue-600">Loading district details...</span>
              </div>
            )}

         

            {currentDistrictState?.data && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>Total Members:</div>
                  <div className="font-semibold flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {currentDistrictState.data.total_members}
                  </div>

                  <div>Students:</div>
                  <div className="font-semibold">{currentDistrictState.data.students}</div>

                  <div>Teachers:</div>
                  <div className="font-semibold">{currentDistrictState.data.teachers}</div>

                 <div>chapters :</div>
                  <div className="font-semibold">{currentDistrictState.data.chapters}</div>

                  <div>Max Members:</div>
                  <div className="font-semibold">{currentDistrictState.data.Max_members}</div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button className="w-full">View Chapters</Button>
                  <Button variant="outline" className="w-full"
                   onClick={() => {
                      router.push(
                        `../../../Components/DISTRICT/AssignHead?district=${encodeURIComponent(selectedDistrict)}`,
                      )
                    }} >
                    Assign Head
                  </Button>
                </div>
              </div>
            )}

            {!currentDistrictState && selectedDistrict && (
              <div className="text-center py-4">
                <Button onClick={() => fetchDistrictData(selectedDistrict)}>Load District Data</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
