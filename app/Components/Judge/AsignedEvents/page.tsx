"use client"

import { useEffect, useState } from "react";
import Navbar from "../JudgeNavBar/page"
import Footer from "../../Footer/page"

import { Calendar, Users, Trophy, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from 'next/navigation';

// import "../../../Components/Judge/AsignedEvents/ParticularEvent"

export default function AssignedEventsPage() {
    const [events, setEvents] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const storedJudge = localStorage.getItem("user");
        const judgeId = storedJudge ? JSON.parse(storedJudge)._id : null;

        const fetchEvents = async () => {
            try {
                const res = await fetch(`http://localhost:5000/competitions/judge/${judgeId}`);
                const data = await res.json();
                setEvents(data.competitions);
            } catch (err) {
                console.error("Error fetching assigned events:", err);
            }
        };

        if (judgeId) fetchEvents();
    }, []);


    const gotoParticularEvent = (id: any) => {
        router.push(`/Components/Judge/AsignedEvents/ParticularEvent?id=${id}`);
    };

    return (

        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-8 md:py-16">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                            Assigned Live Competitions
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Showcase your skills and compete with the best developers around the world
                        </p>
                    </div>

                    {/* Content */}
                    {events.length === 0 ? (
                        <Card className="max-w-md mx-auto">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Calendar className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Competitions Yet</h3>
                                <p className="text-gray-500 text-center">
                                    You haven't been assigned to any competitions yet. Check back soon!
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                            {events.map((event, index) => (
                                <Card
                                    key={event._id}
                                    className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <div onClick={() => {gotoParticularEvent(event._id)}} className="relative overflow-hidden">
                                        <img
                                            src={event.pic || "/placeholder.svg"}
                                            alt={event.title}
                                            className="w-full h-48 sm:h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <div className="absolute top-4 right-4">
                                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                                    {event.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{event.desc}</p>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Users className="w-4 h-4" />
                                                    <span className="font-medium">Judges ({event.judges.length})</span>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {event.judges.map((judge) => (
                                                        <Badge
                                                            key={judge._id}
                                                            variant="secondary"
                                                            className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300"
                                                        >
                                                            {judge.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Stats Section */}
                    {/* {events.length > 0 && (
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{events.length}</div>
                                <div className="text-gray-600 font-medium">Active Competitions</div>
                            </div>
                            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div className="text-3xl font-bold text-indigo-600 mb-2">
                                    {events.reduce((total, event) => total + event.judges.length, 0)}
                                </div>
                                <div className="text-gray-600 font-medium">Expert Judges</div>
                            </div>
                            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
                                <div className="text-3xl font-bold text-purple-600 mb-2">Live</div>
                                <div className="text-gray-600 font-medium">Competition Status</div>
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
            <Footer />
        </div>

    );
}
