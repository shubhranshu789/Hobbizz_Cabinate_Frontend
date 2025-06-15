"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, X, Mail, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"

import Navbar from "../DirectorNavbar/page"

// interface MemberRequest {
//   _id: string
//   name: string
//   email: string
//   profilePicture?: string
//   createdAt?: string
// }


type MemberRequest = {
  _id: string
  name: string
  email: string
  createdAt: string
  profilePicture?: string
}
interface ArtClub {
  _id: string
  memberRequests: MemberRequest[]
}

export default function MemberRequests() {
  const [memberRequests, setMemberRequests] = useState<MemberRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchMemberRequests = async () => {
  try {
    const response = await fetch("http://localhost:5000/artclub/member-requests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch member requests");
    }

    const data: MemberRequest[] = await response.json();
    setMemberRequests(data);
  } catch (error) {
    console.error("Failed to fetch member requests:", error);
    toast.error("Failed to load member requests");
  } finally {
    setLoading(false);
  }
};


    fetchMemberRequests()
  }, [])


  const handleApprove = async (userId: string) => {
    setProcessingIds((prev) => new Set(prev).add(userId))

    try {
      const response = await fetch(`http://localhost:5000/artclub/approve/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
      })

      if (response.ok) {
        setMemberRequests((prev) => prev.filter((request) => request._id !== userId))
        toast.success("Member approved successfully")
      } else {
        throw new Error("Failed to approve member")
      }
    } catch (error) {
      console.error("Failed to approve member:", error)
      toast.error("Failed to approve member")
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleDisapprove = async (userId: string) => {
    setProcessingIds((prev) => new Set(prev).add(userId))

    try {
      const response = await fetch(`http://localhost:5000/artclub/disapprove/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
      })

      if (response.ok) {
        setMemberRequests((prev) => prev.filter((request) => request._id !== userId))
        toast.success("Member request declined")
      } else {
        throw new Error("Failed to disapprove member")
      }
    } catch (error) {
      console.error("Failed to disapprove member:", error)
      toast.error("Failed to decline member request")
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Member Requests...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div> 
      <Navbar/>
      <div style={{marginTop : "60px"}} className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Art Club Member Requests</h1>
          <p className="text-muted-foreground mt-2">Review and manage pending membership requests for the Art Club</p>
        </div>

        {memberRequests.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
              <p className="text-muted-foreground text-center">
                There are currently no pending membership requests to review.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="text-sm">
                {memberRequests.length} Pending Request{memberRequests.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            {memberRequests.map((request, index) => (
              <Card key={request._id} className="transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={request.profilePicture || "/placeholder.svg"} alt={request.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(request.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{request.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            New Request
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{request.email}</span>
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Clock className="h-4 w-4" />
                          <span>Requested on {formatDate(request.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleApprove(request._id)}
                        disabled={processingIds.has(request._id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        {processingIds.has(request._id) ? "Approving..." : "Approve"}
                      </Button>

                      <Button
                        onClick={() => handleDisapprove(request._id)}
                        disabled={processingIds.has(request._id)}
                        variant="destructive"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-1" />
                        {processingIds.has(request._id) ? "Declining..." : "Decline"}
                      </Button>
                    </div>
                  </div>
                </CardContent>

                {index < memberRequests.length - 1 && <Separator />}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
