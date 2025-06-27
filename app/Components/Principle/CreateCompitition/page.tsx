"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Sparkles } from "lucide-react"
import { useRouter } from 'next/navigation';


import Navbar from "../PrincipleNavBar/page"

// import "../../../Components/Principle/PrincipleDashBoard"

export default function ActivityForm() {
   

    const token = localStorage.getItem('jwt');

      const router = useRouter();
    
      const gotohome = () => {
        router.push('/Components/Principle/PrincipleDashBoard');
      };
    
    



    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (file.type.startsWith("image/")) {
                handleFileChange(file)
            }
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileChange(file); // make sure handleFileChange(file: File) is defined
        }
    };


    const handleFileChange = (file: File) => {
        setSelectedFile(file)
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result as string)
        }
        fileReader.readAsDataURL(file)
    }

    const removeFile = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }


    const [url, setUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    // const [category, setCategory] = useState("")


    useEffect(() => {

    const token = localStorage.getItem("jwt");
    if (!token) {
    //   navigate('/signin')
    }





    if (url) {
      fetch("http://localhost:5000/create-compitition", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title: title,
          desc: desc,
          // category: category,
          pic: url,
          
          
        })
      }).then(res => res.json())
        .then(data => {
          if (data.error) {
            // notifyA(data.error)
            alert(data.error)
            console.log(data.error);
            
          } else {
            // notifyB(data.message)
            console.log(data.message);
            //  alert(data.message)
            // alert(data.message)
            gotohome();
            // navigate('/')
          }
          console.log(data)
        })
        .catch(err => console.log(err))
    }

  }, [url]);



  const post = () => {

    if (selectedFile == null || title == "" || desc == "") {
    //   notifyA("Please add a picture and other fields too!!!");
      alert("Please add a picture and other fields too!!!")
      return;
    }

    // console.log(heading,desc,price,pic)
    const data = new FormData()
    data.append("file", selectedFile)
    data.append("upload_preset", "hobbizz")
    data.append("cloud_name", "dvg17xl1i")
    fetch("https://api.cloudinary.com/v1_1/dvg17xl1i/image/upload", {
      method: "post",
      body: data
    }).then(res => (res.json()))
      .then(data => setUrl(data.url))
      .catch(err => console.log(err))
  }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile || !title || !desc ) {
            alert("All fields are required.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("desc", desc);
        // formData.append("category", category);
        formData.append("pic", selectedFile); 

       
    };





    return (

        <div>
            <Navbar />
            <div style={{ marginTop: "60px" }} className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 p-4 flex items-center justify-center">
                <div className="w-full max-w-2xl">
                    <Card className="backdrop-blur-sm bg-white/10 border-white/20 shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                        <CardHeader className="text-center space-y-4">
                            <div className="flex items-center justify-center gap-2 animate-in fade-in duration-1000 delay-300">
                                <Sparkles className="h-8 w-8 text-white animate-pulse" />
                                <CardTitle className="text-3xl font-bold text-white">Add New Compitition</CardTitle>
                                <Sparkles className="h-8 w-8 text-white animate-pulse" />
                            </div>
                            <p className="text-white/80 animate-in fade-in duration-1000 delay-500">
                                Share your creative work with the community
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Photo Upload Section */}
                                <div className="space-y-2 animate-in slide-in-from-left duration-700 delay-200">
                                    <Label htmlFor="photo" className="text-white font-medium">
                                        Upload Photo
                                    </Label>

                                    {!previewUrl ? (
                                        <div
                                            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${dragActive
                                                ? "border-white bg-white/20 scale-105"
                                                : "border-white/40 hover:border-white/60 hover:bg-white/5"
                                                }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <input
                                                type="file"
                                                id="photo"
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={handleFileSelect}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="space-y-4">
                                                <div className="flex justify-center">
                                                    <Upload className="h-12 w-12 text-white/60 animate-bounce" />
                                                </div>
                                                <div className="text-white">
                                                    <p className="text-lg font-medium">Drop your photo here</p>
                                                    <p className="text-white/60">or click to browse</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative animate-in zoom-in duration-300">
                                            <div className="aspect-video relative rounded-lg overflow-hidden border-2 border-white/40 group">
                                                <img
                                                    src={previewUrl || "/placeholder.svg"}
                                                    alt="Selected preview"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                                    <p className="text-white text-sm truncate">{selectedFile?.name}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeFile}
                                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors duration-200"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Title Section */}
                                <div className="space-y-2 animate-in slide-in-from-right duration-700 delay-300">
                                    <Label htmlFor="title" className="text-white font-medium">
                                        Title
                                    </Label>
                                    <Input
                                        value={title}
                                        onChange={(e) => { setTitle(e.target.value) }}
                                        id="title"
                                        placeholder="Enter activity title..."
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/60 focus:bg-white/20 transition-all duration-300"
                                        required
                                    />
                                </div>

                                {/* Description Section */}
                                <div className="space-y-2 animate-in slide-in-from-left duration-700 delay-400">
                                    <Label htmlFor="description" className="text-white font-medium">
                                        Description
                                    </Label>
                                    <Textarea
                                        value={desc}
                                        onChange={(e) => { setDesc(e.target.value) }}
                                        id="description"
                                        placeholder="Describe your activity..."
                                        rows={4}
                                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/60 focus:bg-white/20 transition-all duration-300 resize-none"
                                        required
                                    />
                                </div>

                                {/* Category Dropdown */}
                                {/* <div className="space-y-2 animate-in slide-in-from-right duration-700 delay-500">
                                    <Label htmlFor="category" className="text-white font-medium">
                                        Category
                                    </Label>
                                    <Select value={category} onValueChange={(value) => setCategory(value)} required>
                                        <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-white/60 focus:bg-white/20 transition-all duration-300">
                                            <SelectValue placeholder="Select a category" className="text-white/50" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-blue-600 border-white/20">
                                            <SelectItem value="art" className="text-white hover:bg-white/10 focus:bg-white/10">
                                                🎨 Art
                                            </SelectItem>
                                            <SelectItem value="dance" className="text-white hover:bg-white/10 focus:bg-white/10">
                                                💃 Dance
                                            </SelectItem>
                                            <SelectItem value="singing" className="text-white hover:bg-white/10 focus:bg-white/10">
                                                🎤 Singing
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div> */}

                                {/* Submit Button */}
                                <div className="pt-4 animate-in slide-in-from-bottom duration-700 delay-600">
                                    <Button
                                        onClick = {() => {post()}}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold py-3 text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-70"
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                                                Submitting...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="h-5 w-5" />
                                                Submit Activity
                                                <Sparkles className="h-5 w-5" />
                                            </div>
                                        )}
                                    </Button>
                                </div>



                            </form>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}
