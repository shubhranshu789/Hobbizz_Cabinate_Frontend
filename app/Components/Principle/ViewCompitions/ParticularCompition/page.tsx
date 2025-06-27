"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import Image from "next/image"

import Navbar from "../../PrincipleNavBar/page"

import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast"

interface Competition {
  _id: string
  title: string
  desc: string
  pic: string
  postedBy: string[]
  isLive: boolean
}

interface CompetitionDisplayProps {
  competitionId: string
  apiBaseUrl?: string
}

export default function CompetitionDisplay({
}) {
  const [competition, setCompetition] = useState<Competition | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams();
  const id = searchParams.get("id");


  const [judges, setJudges] = useState([]);
  const [selectedJudge, setSelectedJudge] = useState("");
  const [assignedJudges, setAssignedJudges] = useState([]);

  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const res = await fetch("http://localhost:5000/allJudges"); // adjust if needed
        const data = await res.json();
        setJudges(data);
      } catch (err) {
        console.error("Failed to fetch judges:", err);
      }
    };


    // const fetchAssignedJudges = async () => {
    //   const res = await fetch(`http://localhost:5000/competition/${id}`); // make sure this route returns populated judges
    //   const data = await res.json();
    //   setAssignedJudges(data.judges || []);
    // };

    fetchJudges();
    // fetchAssignedJudges();


    const fetchAssignedJudges = async () => {
      try {
        const res = await fetch(`http://localhost:5000/competition/${id}/judges`);
        const data = await res.json();
        setAssignedJudges(data.judges);
      } catch (err) {
        console.error("Failed to fetch assigned judges", err);
      }
    };

    fetchAssignedJudges();
  }, []);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`http://localhost:5000/getCompitition/${id}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setCompetition(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch competition")
        console.error("Error fetching competition:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCompetition()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading competition...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <h3 className="text-lg font-semibold mb-2">Error Loading Competition</h3>
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!competition) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-gray-600">
            <h3 className="text-lg font-semibold mb-2">Competition Not Found</h3>
            <p>No competition data available.</p>
          </div>
        </CardContent>
      </Card>
    )
  }


  const toggleLive = async (value: any) => {
    const res = await fetch(`http://localhost:5000/activity/set-live/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isLive: value }),
    });

    const data = await res.json();
    console.log(data.message);
  };

  const handleAssignJudge = async (judgeId: any) => {
    if (!judgeId) return;

    const res = await fetch("http://localhost:5000/assignJudge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, judgeId }),
    });

    const data = await res.json();

    if (res.ok) {
      setAssignedJudges(data.competition.judges); // update UI
      setSelectedJudge(""); // reset selection
    } else {
      alert(data.error || "Failed to assign judge");
    }
  };


  const handleRemoveJudge = async (judgeId: any) => {
  try {
    const res = await fetch("http://localhost:5000/removeJudge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id, // make sure this variable is available in your component
        judgeId,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setAssignedJudges(data.competition.judges); // update the list after deletion
    } else {
      alert(data.error || "Failed to remove judge");
    }
  } catch (err) {
    console.error("Error removing judge:", err);
    alert("Something went wrong");
  }
};


  return (
    <div style={{ marginTop: "80px" }}>
      <Navbar />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">{competition.title}</CardTitle>
            <Badge variant={competition.isLive ? "default" : "secondary"}>
              {competition.isLive ? "🔴 Live" : "⏸️ Not Live"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {competition.pic && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={competition.pic || "/placeholder.svg"}
                alt={competition.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{competition.desc}</p>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={() => toggleLive(true)}
              className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition-all duration-200"
            >
              ✅ Make Live
            </button>

            <button
              onClick={() => toggleLive(false)}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition-all duration-200"
            >
              ❌ Make Offline
            </button>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Select Judge</label>
            <select
              value={selectedJudge}
              onChange={(e) => {
                const judgeId = e.target.value;
                setSelectedJudge(judgeId);
                handleAssignJudge(judgeId);
              }}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a Judge --</option>
              {judges
                .filter((j) => !assignedJudges.find((aj) => aj._id === j._id)) // filter out already assigned
                .map((judge) => (
                  <option key={judge._id} value={judge._id}>
                    {judge.name} ({judge.clubName})
                  </option>
                ))}
            </select>

            {/* Display Assigned Judges */}
            <div className="mt-4">
              <h4 className="font-medium text-sm mb-2">Assigned Judges:</h4>

              {assignedJudges && assignedJudges.length > 0 ? (
                <ul className="space-y-2">
                  {assignedJudges.map((judge) => (
                    <li
                      key={judge._id}
                      className="flex justify-between items-center border p-3 rounded-md bg-gray-50 text-sm"
                    >
                      <div>
                        <p className="font-medium">{judge.name}</p>
                        <p className="text-gray-500">{judge.clubName}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveJudge(judge._id)}
                        className="text-red-600 hover:underline text-xs"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No judges assigned yet.</p>
              )}
            </div>


          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
            <span>Competition ID: {competition._id}</span>
            <span>Posted by: {competition.postedBy.length} user(s)</span>
          </div>
        </CardContent>
      </Card>
    </div>

  )
}
