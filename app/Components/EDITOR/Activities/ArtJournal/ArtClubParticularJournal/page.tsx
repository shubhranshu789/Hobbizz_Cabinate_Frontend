"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, User, BookOpen, Tag, Star } from "lucide-react"
import Image from "next/image"

import Navbar from "../../../EditorNavbar/page"

import { useSearchParams } from "next/navigation";

interface Journal {
  _id: string
  title: string
  content: string
  category: string
  author: string
  imageUrl: string
  tags: string[]
  isFeatured: boolean
  publishedAt: string
  __v: number
}

export default function JournalDetail() {
  const params = useParams()
  const [journal, setJournal] = useState<Journal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await fetch(`http://localhost:5000/artJournal/${id}`)
        if (!response.ok) {
          throw new Error("Journal not found")
        }
        const data = await response.json()
        setJournal(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch journal")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchJournal()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="animate-pulse">
            <CardHeader className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!journal) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (

    <div>
      <Navbar/>
      <div style={{marginTop : "60px"}} className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Card */}
          <Card className="overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader style={{borderRadius : "10px"}} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div style={{padding : "10px" }} className="flex items-start justify-between">
                <div  className="flex-1">
                  <CardTitle className="text-3xl font-bold mb-2">{journal.title}</CardTitle>
                  <div className="flex items-center gap-4 text-blue-100">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{journal.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" />
                      <span>{formatDate(journal.publishedAt)}</span>
                    </div>
                  </div>
                </div>
                {journal.isFeatured && (
                  <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              {journal.imageUrl && (
                <Card className="overflow-hidden shadow-md">
                  <CardContent className="p-0">
                    <div className="relative aspect-video">
                      <Image
                        src={journal.imageUrl || "/placeholder.svg"}
                        alt={journal.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=400&width=600"
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Content */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{journal.content}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Journal Info */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Journal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${journal.author}`} />
                      <AvatarFallback>{journal.author.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{journal.author}</p>
                      <p className="text-sm text-gray-500">Author</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Category</p>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {journal.category}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {journal.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Published</p>
                      <p className="text-sm text-gray-700">{formatDate(journal.publishedAt)}</p>
                    </div>

                    {/* <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Journal ID</p>
                      <p className="text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">{journal._id}</p>
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              {/* Data Structure Reference */}
              {/* <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">Data Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Image
                      src="/images/journal-data.png"
                      alt="Journal data structure"
                      width={300}
                      height={200}
                      className="rounded border"
                    />
                    <p className="text-xs text-gray-500 mt-2">API Response Structure</p>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
