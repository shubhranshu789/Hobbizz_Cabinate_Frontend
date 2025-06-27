"use client"

import { useSearchParams } from "next/navigation"
import { SetStateAction, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react"
// import type { Competition } from "@/types/competition"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Trophy, Upload, Calendar } from "lucide-react"
import Image from "next/image"

import Navbar from "../../JudgeNavBar/page"

export default function CompetitionPage() {
    const searchParams = useSearchParams()
    const competitionId = searchParams.get("id")

    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedUpload, setSelectedUpload] = useState(null);
    const [markInput, setMarkInput] = useState(0);

    const handleOpenModal = (upload: SetStateAction<null>) => {
        setSelectedUpload(upload);
        setMarkInput(0); // reset or prefill with existing mark if needed
    };

    const handleCloseModal = () => {
        setSelectedUpload(null);
        setMarkInput(0);
    };

    useEffect(() => {
        const fetchCompetition = async () => {
            if (!competitionId) {
                setError("No competition ID provided")
                setLoading(false)
                return
            }

            try {
                const response = await fetch(`http://localhost:5000/getCompitition/${competitionId}`)

                if (!response.ok) {
                    throw new Error("Failed to fetch competition")
                }

                const data = await response.json()
                setCompetition(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchCompetition()
    }, [competitionId])

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-64 w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-600">{error}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!competition) {
        return (
            <div>
                <Navbar />
                <div className="container mx-auto p-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Competition Not Found</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>The requested competition could not be found.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const handleSubmitMark = async () => {
        const storedJudge = localStorage.getItem("user");
        const judgeId = storedJudge ? JSON.parse(storedJudge)._id : null;

        if (!judgeId || !selectedUpload?._id || isNaN(markInput)) {
            alert("Missing required fields");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/assign-mark", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uploadId: selectedUpload._id,
                    judgeId,
                    mark: markInput,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Mark submitted successfully");
                handleCloseModal();
            } else {
                alert(data.error || "Failed to submit mark");
            }
        } catch (err) {
            console.error("Error submitting mark:", err);
            alert("Something went wrong");
        }
    };


    return (
        <div>
            <Navbar />
            <div style={{ marginTop: "60px" }} className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{competition.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant={competition.isLive ? "default" : "secondary"}>
                                {competition.isLive ? "Live" : "Inactive"}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(competition.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Competition Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>About</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {competition.pic && (
                                        <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                            <Image
                                                src={competition.pic || "/placeholder.svg"}
                                                alt={competition.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <p className="text-muted-foreground">{competition.desc}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Uploads */}
                        {competition.uploads.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                        <Upload className="w-5 h-5 text-blue-600" />
                                        Submissions ({competition.uploads.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {competition.uploads.map((upload: { _id: Key | null | undefined; pic: any; uploadedBy: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; email: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined } }) => (
                                            <div
                                                key={upload._id}
                                                onClick={() => handleOpenModal(upload)}
                                                className="relative aspect-square rounded-xl overflow-hidden shadow-md group cursor-pointer"
                                            >
                                                <Image
                                                    src={upload.pic || "/placeholder.svg"}
                                                    alt="Submission"
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                />

                                                {upload.uploadedBy && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent px-4 py-3 text-white text-sm space-y-0.5 backdrop-blur-sm">
                                                        <p className="font-semibold truncate">{upload.uploadedBy.name}</p>
                                                        <p className="text-xs opacity-80 truncate">{upload.uploadedBy.email}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {selectedUpload && (
                                            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-4">
                                                <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">
                                                    <button
                                                        onClick={handleCloseModal}
                                                        className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
                                                    >
                                                        &times;
                                                    </button>

                                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Assign Marks</h3>

                                                    <div className="mb-4">
                                                        <p className="text-sm text-gray-700 mb-1">Uploaded By:</p>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {selectedUpload.uploadedBy?.name} ({selectedUpload.uploadedBy?.email})
                                                        </p>
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Marks (out of 10)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={markInput}
                                                            onChange={(e) => {
                                                                const value = parseInt(e.target.value);
                                                                if (value >= 0 && value <= 10) {
                                                                    setMarkInput(value);
                                                                }
                                                            }}
                                                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            min={0}
                                                            max={10}
                                                        />
                                                    </div>

                                                    <button
                                                        onClick={handleSubmitMark}
                                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                                                    >
                                                        Submit Mark
                                                    </button>
                                                </div>
                                            </div>
                                        )}






                                    </div>
                                </CardContent>
                            </Card>
                        )}


                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Competition Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">Registrations</span>
                                    </div>
                                    <Badge variant="outline">{competition.Registrations.length}</Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">Judges</span>
                                    </div>
                                    <Badge variant="outline">{competition.judges.length}</Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Upload className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">Submissions</span>
                                    </div>
                                    <Badge variant="outline">{competition.uploads.length}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium">Created:</span>
                                    <p className="text-muted-foreground">{new Date(competition.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Last Updated:</span>
                                    <p className="text-muted-foreground">{new Date(competition.updatedAt).toLocaleString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>

    )
}
