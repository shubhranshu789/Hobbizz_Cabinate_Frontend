"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../EditorNavbar/page"
import Footer from "../../../Footer/page"

import { useRouter } from 'next/navigation';


// import "../../../../Components/EDITOR/Activities/AddHeritage/ViewParticularHeritage"

interface HallOfFameItem {
    _id: string;
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
    origin: string;
    publishedAt?: string;
    createdAt?: string;
}

const HallOfFameForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Other",
        origin: "",
        imageUrl: "",
    });

    const [items, setItems] = useState<HallOfFameItem[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.category) {
            toast.error(" Please fill all required fields!");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/heritage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Item Added Successfully!");
                setFormData({ title: "", description: "", category: "Other", origin: "", imageUrl: "" });
                fetchItems();
            } else {
                toast.error("Failed: " + data.message);
            }
        } catch (error: any) {
            toast.error("Error: " + error.message);
        }
    };

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/heritagegetallpost");
            const data = await res.json();
            if (res.ok) setItems(data.data || []);
            else toast.error(data.message || "Error fetching data");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClickSubmitId = (id: any) => {
        router.push(`/Components/EDITOR/Activities/AddHeritage/ViewParticularHeritage?id=${id}`);
    };

    useEffect(() => {
        fetchItems();
    }, []);
    return (
        <div style={{ padding: "2px" }}>
            <Navbar />

            <div className="bg-[#BCDAFB] h-[400px] flex flex-col justify-center items-center text-center">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
                    Club Heritage
                </h1>
                <p className="text-md sm:text-lg text-gray-700 max-w-xl">
                    Celebrating individuals whose passion and contributions have kept our traditions and heritage alive within the community.
                </p>
            </div>

            {/* Form Section */}
            <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-md border border-gray-200 p-6">
                <h2 className="text-center text-2xl font-bold text-blue-400 mb-2">
                    Create a Heritage
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Have a story or figure that celebrates our cultural roots? Share it with us for the Heritage.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name + Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter Title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                                <option value="Select" disabled>
                                    Select category
                                </option>
                                <option value="Traditional Art">Traditional Art</option>
                                <option value="Modern Art">Modern Art</option>
                                <option value="Sculpture">Sculpture</option>
                                <option value="Photography">Photography</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Origin */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Origin / Artist
                        </label>
                        <input
                            type="text"
                            name="origin"
                            placeholder="Enter origin or artist's name"
                            value={formData.origin}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Describe this heritage ..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            rows={3}
                        />
                    </div>

                    {/* Upload Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const data = new FormData();
                                    data.append("file", file);
                                    data.append("upload_preset", "hobbizz");
                                    data.append("cloud_name", "dvg17xl1i");

                                    try {
                                        const res = await fetch(
                                            "https://api.cloudinary.com/v1_1/dvg17xl1i/image/upload",
                                            { method: "POST", body: data }
                                        );

                                        const uploadResult = await res.json();
                                        if (uploadResult.secure_url) {
                                            setFormData((prev) => ({
                                                ...prev,
                                                imageUrl: uploadResult.secure_url,
                                            }));
                                            toast.success("Image uploaded successfully!");
                                        } else {
                                            toast.error("Image upload failed!");
                                        }
                                    } catch (err) {
                                        toast.error("Error uploading image");
                                        console.error(err);
                                    }
                                }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-400 text-white font-semibold text-sm py-2 rounded-lg hover:bg-blue-500 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>

            <hr style={{ margin: "40px 0" }} />

            {/* Hall of Fame Feed */}
            {/* <div className="max-w-6xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🏆 Heritage</h2>

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : items.length === 0 ? (
                    <p className="text-center text-gray-500">No items found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => {
                            const dateString = item.publishedAt || item.createdAt;
                            return (
                                <div key={item._id} className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg">
                                    {item.imageUrl && (
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
                                    )}
                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.title}</h3>
                                        <p className="text-xs text-gray-500 mb-1"><strong>Category:</strong> {item.category}</p>
                                        <p className="text-xs text-gray-500 mb-1"><strong>Origin:</strong> {item.origin}</p>
                                        <p className="text-sm text-gray-700 mt-2">{item.description}</p>
                                        <p className="mt-2 text-xs text-gray-400">
                                            🕒 {dateString ? new Date(dateString).toLocaleString() : "Date not available"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div> */}

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
                        🏆 Heritage
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-red-500 mx-auto rounded-full"></div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4"></div>
                        <p className="text-gray-600 text-lg">Loading heritage items...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🏛️</div>
                        <p className="text-gray-500 text-xl">No heritage items found.</p>
                        <p className="text-gray-400 text-sm mt-2">Check back later for new additions to our collection.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {items.map((item) => {
                            const dateString = item.publishedAt || item.createdAt
                            return (
                                <div
                                    key={item._id}
                                    className="group bg-white border border-gray-100 rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-amber-200"
                                >
                                    <div className="relative overflow-hidden">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl || "/placeholder.svg"}
                                                alt={item.title}
                                                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-56 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                                <div className="text-6xl text-amber-400">🏛️</div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors duration-200">
                                            {item.title}
                                        </h3>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                                📂 {item.category}
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                📍 {item.origin}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{item.description}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <span className="mr-1">🕒</span>
                                                <span>
                                                    {dateString
                                                        ? new Date(dateString).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })
                                                        : "Date not available"}
                                                </span>
                                            </div>
                                            <button
                                            style={{cursor : "pointer"}}
                                            onClick={() => { handleClickSubmitId(item._id) }} className="text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors duration-200">
                                                Learn more →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>


            <ToastContainer position="top-center" autoClose={2000} />
            <Footer />
        </div>
    );
};

export default HallOfFameForm;