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
import { useSearchParams } from "next/navigation"

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
  district: string
  school: string
  createdAt: string
  profilePicture?: string
}
interface ArtClub {
  _id: string
  memberRequests: MemberRequest[]
}

export default function MemberRequests() {
  const [clubName, setClub] = useState<string | null>(null);
  const [memberRequests, setMemberRequests] = useState<MemberRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("");

  const searchParams = useSearchParams();
  const district= searchParams.get("district");

  const filteredRequests = memberRequests.filter((req) => {
    const q = searchQuery.toLowerCase();
    return (
      req.name.toLowerCase().includes(q) ||
      req.email.toLowerCase().includes(q) ||
      req.district?.toLowerCase().includes(q)
    );
  });

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.clubName) {
      setClub(parsedUser.clubName);
    }
  }
}, []);




  useEffect(() => {
  if(!clubName)  return;  

    const fetchMemberRequests = async () => {
      
      try {
        const response = await fetch(`http://localhost:5000/${clubName}/head-request?district=${district}`, {
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
  }, [clubName]);


  const handleApprove = async (userId: string) => {
    setProcessingIds((prev) => new Set(prev).add(userId));

    try {
      const response = await fetch(`http://localhost:5000/${clubName}/approve-head/?district=${district}&userid=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt"),
        },
      });

      if (response.ok) {
        setMemberRequests((prev) => prev.filter((request) => request._id !== userId));
        toast.success("Member approved successfully");
      } else {
        const errorData = await response.json();
        console.error("Approval failed:", errorData);
        toast.error(errorData.message || "Failed to approve member");
        alert(errorData.message)
      }
    } catch (error) {
      console.error("Network/Unknown error:", error);
      toast.error("Failed to approve member");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };


  const handleDisapprove = async (userId: string) => {
    setProcessingIds((prev) => new Set(prev).add(userId))

    try {
      const response = await fetch(`http://localhost:5000/${clubName}/disapprove-head/?district=${district}&userid=${userId}`, {
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


  const groupedBySchool = filteredRequests.reduce((groups, request) => {
    const school = request.school || "Unknown School";
    if (!groups[school]) groups[school] = [];
    groups[school].push(request);
    return groups;
  }, {} as Record<string, typeof memberRequests>);


  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "60px" }} className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Art Club Member Requests</h1>
          <p className="text-muted-foreground mt-2">Review and manage pending membership requests for the Art Club</p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, email, or district"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          <div>
            {Object.entries(groupedBySchool).map(([school, requests]) => (
              <div key={school}>
                <h2 className="text-xl font-bold mb-2">{school}</h2>

                {requests.map((request, index) => (
                  <Card key={request._id} className="transition-all hover:shadow-md mb-4">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={request.profilePicture || "/placeholder.svg"} alt={request.name} />
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{request.name}</h3>
                              <Badge variant="outline" className="text-xs">New Request</Badge>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm">{request.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm">{request.district}</span>
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
                    {index < requests.length - 1 && <Separator />}
                  </Card>
                ))}
              </div>
            ))}

          </div>
        )}





      </div>
    </div>
  )
}
