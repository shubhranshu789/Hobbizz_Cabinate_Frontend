"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, MapPin, Tag } from "lucide-react"
import Image from "next/image"

import Navbar from "../../../EditorNavbar/page"

import Footer from "../../../../Footer/page"

interface HeritageData {
  _id: string
  title: string
  category: string
  origin: string
  imageUrl: string
  description: string
  period: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function ViewParticularHeritage() {
  const [heritage, setHeritage] = useState<HeritageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  useEffect(() => {
    const fetchHeritage = async () => {
      if (!id) {
        setError("No heritage ID provided")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`http://localhost:5000/artHeritage/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch heritage data")
        }

        const data = await response.json()
        setHeritage(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchHeritage()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!heritage) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg font-semibold">Heritage not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (

    <div>
      <Navbar/>
      <div style={{marginTop : "60px"}} className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{heritage.category}</Badge>
                {heritage.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {heritage.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <CardTitle className="text-3xl font-bold">{heritage.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Origin: {heritage.origin}</span>
                </div>
                {/* <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Period: {heritage.period}</span>
                </div> */}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {heritage.imageUrl && (
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <Image
                  src={heritage.imageUrl || "/placeholder.svg"}
                  alt={heritage.title}
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            )}

            <div>
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <div className="prose prose-sm max-w-none">
                {heritage.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-3 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Created:</span> {new Date(heritage.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span> {new Date(heritage.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer/>
    </div>

  )
}
