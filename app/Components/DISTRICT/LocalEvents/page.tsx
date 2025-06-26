"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Navbar from "../../Navbar/page"

// Types
enum EventStatus {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

interface UserData {
  club: string
  district: string
}

interface Event {
  event_id: string
  title: string
  date: string
  venue: string
  description?: string
  status: EventStatus
  created_at: string
  updated_at: string
  club_name: string
  club_director_name: string
  club_director_email: string
  district_name: string
  district_head_name: string
  district_head_email: string
  council_members: Array<{
    name: string
    position: string
    email: string
    phone?: string
  }>
}

const LocalChapterPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    venue: "",
    description: "",
    status: EventStatus.ACTIVE,
  })

  // Get user data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem("user")
      if (storedUserData) {
        try {
          const parsedUserData = JSON.parse(storedUserData)
          setUserData(parsedUserData)
        } catch (error) {
          console.error("Error parsing user data from localStorage:", error)
        }
      }
    }
  }, [])

  // Fetch chapters from API
  const fetchChapters = async () => {
    if(!userData) return;
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`http://localhost:5000/get-events?club=${userData.club}&district=${userData.district}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch chapters: ${response.statusText}`)
      }

      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error("Error fetching events:", error)
      setError(error instanceof Error ? error.message : "Failed to load events")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchChapters()
  }, [userData])

  // Filter events based on search term
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Form handlers
  const openForm = (event?: Event) => {
    if (event) {
      setSelectedEvent(event)
      setFormData({
        title: event.title || "",
        date: event.date || "",
        venue: event.venue || "",
        description: event.description || "",
        status: event.status || EventStatus.ACTIVE,
      })
    } else {
      setSelectedEvent(null)
      setFormData({
        title: "",
        date: "",
        venue: "",
        description: "",
        status: EventStatus.ACTIVE,
      })
    }
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedEvent(null)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userData) {
      setError("User data not found. Please log in again.")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const isEditing = !!selectedEvent?.event_id
      const url = isEditing
        ? `http://localhost:5000/update-event/${selectedEvent.event_id}`
        : `http://localhost:5000/create-event`
      const method = isEditing ? "PUT" : "POST"

      const submitData = {
        ...formData,
        date: new Date(formData.date),
        club: userData.club,
        district: userData.district,
        
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? "update" : "create"} chapter`)
      }

      const result = await response.json()

      if (isEditing) {
        setEvents((prevEvents) =>
          prevEvents.map((c) => (c.event_id === selectedEvent.event_id ? result.event : c)),
        )
      } else {
        setEvents((prevEvents) => [result.event, ...prevEvents])
      }

      closeForm()
    } catch (error) {
      console.error("Error submitting event:", error)
      setError(error instanceof Error ? error.message : "Failed to save event")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Detail modal handlers
  const openDetail = (event: Event) => {
    setSelectedEvent(event)
    setIsDetailOpen(true)
  }

  const closeDetail = () => {
    setIsDetailOpen(false)
    setSelectedEvent(null)
  }

  // Delete handlers
  const openDeleteConfirm = (eventId: string) => {
    setEventToDeleteId(eventId)
    setIsDeleteConfirmOpen(true)
  }

  const closeDeleteConfirm = () => {
    setEventToDeleteId(null)
    setIsDeleteConfirmOpen(false)
  }

  const handleDelete = async () => {
    if (!eventToDeleteId) return

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch(`http://localhost:5000/delete-event/?eventId=${eventToDeleteId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      setEvents((prevEvents) => prevEvents.filter((c) => c.event_id !== eventToDeleteId))
      closeDeleteConfirm()
    } catch (error) {
      console.error("Error deleting event:", error)
      setError(error instanceof Error ? error.message : "Failed to delete event")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle status
  const toggleStatus = useCallback(
    async (eventId: string) => {
      const event = events.find((c) => c.event_id === eventId)
      if (!event) return

      const newStatus = event.status === EventStatus.ACTIVE ? EventStatus.INACTIVE : EventStatus.ACTIVE

      try {
        setError(null)

        const response = await fetch(`http://localhost:5000/update-chapter-status/${eventId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        })

        if (!response.ok) {
          throw new Error("Failed to update chapter status")
        }

        setEvents((prevEvents) =>
          prevEvents.map((c) => (c.event_id === eventId ? { ...c, status: newStatus } : c)),
        )

        if (selectedEvent && selectedEvent.event_id === eventId) {
          setSelectedEvent((prev) => (prev ? { ...prev, status: newStatus } : null))
        }
      } catch (error) {
        console.error("Error toggling status:", error)
        setError(error instanceof Error ? error.message : "Failed to update status")
      }
    },
    [events, selectedEvent],
  )

  return (
    <div> <Navbar />
    <div className="min-h-screen mt-6 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 mb-8 mt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Event Management</h1>
              <p className="text-lg text-gray-600">Manage your organization events efficiently</p>
              {userData && (
                <p className="text-sm text-blue-600 mt-2">
                  {userData.club} • {userData.district}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chapters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-80 pl-12 pr-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                onClick={() => openForm()}
                disabled={isSubmitting || !userData}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Event
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Content Section */}
        {isLoading ? (
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Events</h3>
            <p className="text-gray-600">Please wait while we fetch your events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "No chapters found" : "No chapters yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No chapters match "${searchTerm}". Try adjusting your search.`
                : "Get started by creating your first chapter."}
            </p>
            {!searchTerm && userData && (
              <button
                onClick={() => openForm()}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Event
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.event_id}
                className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-gray-600 flex items-center mb-1">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6"
                        />
                      </svg>
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {event.venue}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === EventStatus.ACTIVE
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openDetail(event)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => openForm(event)}
                    className="px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(event.event_id)}
                    className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedEvent ? "Edit Event" : "Create New Event"}
                  </h2>
                  <button
                    onClick={closeForm}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter chapter title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Venue *</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter venue location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter chapter description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value={EventStatus.ACTIVE}>Active</option>
                    <option value={EventStatus.INACTIVE}>Inactive</option>
                  </select>
                </div>

                {userData && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Auto-filled Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Club:</span>
                        <p className="text-gray-600">{userData.club}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">District:</span>
                        <p className="text-gray-600">{userData.district}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={isSubmitting}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </span>
                    ) : selectedEvent ? (
                      "Update Event"
                    ) : (
                      "Create Event"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {isDetailOpen && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
                  <button
                    onClick={closeDetail}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Date</h4>
                      <p className="text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6"
                          />
                        </svg>
                        {new Date(selectedEvent.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Venue</h4>
                      <p className="text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {selectedEvent.venue}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                      selectedEvent.status === EventStatus.ACTIVE
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedEvent.status}
                  </span>
                </div>

                {/* Club Information */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Club Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Club Name:</span>
                      <p className="text-gray-600">{selectedEvent.club_name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Club Director:</span>
                      <p className="text-gray-600">{selectedEvent.club_director_name}</p>
                      <p className="text-gray-600 text-sm">{selectedEvent.club_director_email}</p>
                    </div>
                  </div>
                </div>

                {/* District Information */}
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">District Information</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">District Name:</span>
                      <p className="text-gray-600">{selectedEvent.district_name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">District Head:</span>
                      <p className="text-gray-600">{selectedEvent.district_head_name}</p>
                      <p className="text-gray-600 text-sm">{selectedEvent.district_head_email}</p>
                    </div>
                  </div>
                </div>

                {/* Council Members */}
                {selectedEvent.council_members && selectedEvent.council_members.length > 0 && (
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Council Members</h4>
                    <div className="space-y-3">
                      {selectedEvent.council_members.map((member, index) => (
                        <div key={index} className="border-l-4 border-yellow-400 pl-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.position}</p>
                            </div>
                          </div>
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              {member.email}
                            </p>
                            {member.phone && (
                              <p className="text-sm text-gray-600 flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                {member.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500 space-y-1">
                  <p>Created: {new Date(selectedEvent.created_at).toLocaleDateString()}</p>
                  <p>Updated: {new Date(selectedEvent.updated_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button
                  onClick={() => toggleStatus(selectedEvent.event_id)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedEvent.status === EventStatus.ACTIVE
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {selectedEvent.status === EventStatus.ACTIVE ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={closeDetail}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
                  <button
                    onClick={closeDeleteConfirm}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">Delete Chapter</h3>
                    <p className="text-gray-600">
                      Are you sure you want to delete this chapter? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button
                  onClick={closeDeleteConfirm}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    "Delete Chapter"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default LocalChapterPage
