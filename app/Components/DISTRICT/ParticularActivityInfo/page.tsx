"use client";
import React from 'react'
import { useSearchParams } from "next/navigation";
import NavBar from "../../../Components/DISTRICT/DirectorNavbar/page"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, Clock, User, Users } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"



function page() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const [event, setEvent] = useState(); // <- initialize your event state
  const [hasUploaded, setHasUploaded] = useState(false);

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openImage, setOpenImage] = useState(null);



  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    setToken(storedToken);

    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setUserId(user._id);
      } catch (err) {
        console.error("Error parsing user from localStorage", err);
      }
    }

    fetch(`http://localhost:5000/getactivity/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setEvent(result);
      });
  }, [id]);

  // Separate effect to check registration once both event & userId are set
  useEffect(() => {
    if (event && userId) {
      const registered = event.Registrations?.includes(userId);
      setIsRegistered(registered);
    }
  }, [event, userId]);




  // useEffect(() => {
  //   const fetchUploadStatus = async () => {
  //     if (!isRegistered) return;

  //     try {
  //       const token = localStorage.getItem("jwt");
  //       const res = await fetch(`http://localhost:5000/has-uploaded/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       const data = await res.json();
  //       setHasUploaded(data.hasUploaded);
  //     } catch (error) {
  //       console.error("Failed to fetch upload status", error);
  //     }
  //   };

  //   fetchUploadStatus();
  // }, [isRegistered, id]);


  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const res = await fetch(`http://localhost:5000/event-participants/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setParticipants(data.participants || []);
      } catch (error) {
        console.error("Failed to fetch participants", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [id]);


  const [approvedUploads, setApprovedUploads] = useState([]);
  const [loadingApproved, setLoadingApproved] = useState(true);

  useEffect(() => {
    const fetchApprovedUploads = async () => {
      try {
        setLoadingApproved(true);
        const res = await fetch(`http://localhost:5000/activity/approved-uploads/${event?._id}`);
        const data = await res.json();
        setApprovedUploads(data.approvedUploads || []);
      } catch (error) {
        console.error("Error fetching approved uploads", error);
      } finally {
        setLoadingApproved(false);
      }
    };

    if (event?._id) {
      fetchApprovedUploads();
    }
  }, [event?._id]);






  // const handleRegister = (activityId: string) => {
  //   if (!token) {
  //     alert("You must be logged in to register.");
  //     return;
  //   }

  //   registerForActivity(activityId);
  // };






  // const registerForActivity = async (activityId: string) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/register-activity/${activityId}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`, // send JWT token
  //       },
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       alert("Successfully registered for the activity!");
  //       console.log("Activity:", data.activity);
  //       window.location.reload();
  //     } else {
  //       alert(data.message || "Registration failed.");
  //     }
  //   } catch (error) {
  //     console.error("Registration error:", error);
  //     alert("An error occurred while registering.");
  //   }
  // };

  // const unregisterFromActivity = async (activityId: string) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/unregister-activity/${activityId}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       alert("You have been unregistered from the event.");
  //       console.log("Updated activity:", data.activity);
  //       window.location.reload();
  //     } else {
  //       alert(data.message || "Failed to unregister.");
  //     }
  //   } catch (error) {
  //     console.error("Unregister error:", error);
  //     alert("An error occurred while unregistering.");
  //   }
  // };



  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const post = async () => {
    if (!selectedFile) return alert("Please select a file.");

    setIsUploading(true);

    const data = new FormData();
    data.append("file", selectedFile);
    data.append("upload_preset", "hobbizz");
    data.append("cloud_name", "dvg17xl1i");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dvg17xl1i/image/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      if (result.url) {
        const token = localStorage.getItem("jwt");
        const response = await fetch(`http://localhost:5000/upload-photo/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ pic: result.url }),
        });

        const backendRes = await response.json();
        if (response.ok) {
          alert("Photo uploaded successfully!");
        } else {
          alert(backendRes.error || "Failed to save photo.");
        }
      } else {
        alert("Cloudinary upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setIsUploading(false);
    }
  };






  return (
    <div style={{ marginTop: "50px" }}>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section with Event Image */}
          <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-xl">
            <Image src={event?.pic || "/placeholder.svg"} alt={event?.title || "/placeholder.svg"} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/30 flex items-end">
              <div className="p-6 w-full">
                <Badge className="mb-2 bg-primary hover:bg-primary/90 capitalize">{event?.category}</Badge>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{event?.title}</h1>
              </div>
            </div>
          </div>

          {/* Event Details Card */}
          <Card className="mb-8 shadow-lg">
            <CardHeader className="pb-3">
              <h2 className="text-2xl font-semibold">Event Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Description</h3>
                  <p className="text-muted-foreground">{event?.desc}</p>
                </div>





                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>Posted by: {event?.postedBy[0].substring(0, 8)}...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>{event?.Registrations.length} Registrations</span>
                  </div>
                </div>



              </div>
            </CardContent>
            {/* <CardFooter>
              <Button
                onClick={() =>
                  isRegistered
                    ? unregisterFromActivity(event?._id)
                    : registerForActivity(event?._id)
                }
                className="w-full"
              >
                {isRegistered ? "Unregister" : "Register for Event"}
              </Button>



            </CardFooter> */}
          </Card>


          {/* <div style={{ marginBottom: "30px" }}>
            {isRegistered ? (
              hasUploaded ? (
                <div className="w-full max-w-md mx-auto p-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                  <p className="text-center text-green-500 font-semibold">
                    You have already uploaded your photo for this event.
                  </p>
                </div>
              ) : (
                <div className="w-full max-w-md mx-auto p-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg space-y-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-white">
                    Upload Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0
          file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />

                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-contain rounded-lg border border-gray-200"
                    />
                  )}

                  <button
                    onClick={post}
                    disabled={isUploading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              )
            ) : (
              <div className="w-full max-w-md mx-auto p-4 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                <p className="text-center text-red-500 font-semibold">
                  You must register for the event to upload a photo.
                </p>
              </div>
            )}
          </div> */}


          {/* Registration Status Card */}
     









          {/* Event ID Display */}
          {/* <div className="mt-6 text-center">
                      <p className="text-xs text-muted-foreground">Event ID: {event._id}</p>
                    </div> */}


        </div>



        <div>
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">✅ Approved Uploads</h2>

            {loadingApproved ? (
              <p className="text-sm text-muted-foreground">Loading approved uploads...</p>
            ) : approvedUploads?.length === 0 ? (
              <p className="text-sm text-muted-foreground">No uploads approved yet.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {approvedUploads.map((upload) => (
                  <li
                    key={upload._id}
                    className="bg-white rounded-lg shadow-md border p-4 space-y-2"
                  >
                    <div className="w-full h-48 overflow-hidden rounded">
                      <img
                        src={upload.pic}
                        alt="Approved Upload"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{upload.name}</p>
                      <p className="text-sm text-gray-600">{upload.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded on {new Date(upload.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default page