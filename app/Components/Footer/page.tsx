"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  User,
  ChevronDown,
  Palette,
  Brush,
  Camera,
  Trophy,
  Calendar,
  Users,
  Star,
  Heart,
  Eye,
  Upload,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Award,
  PaintBucket,
  ImageIcon,
  Clock,
} from "lucide-react"
function page() {
  return (
    <div>
        <footer
        className={`bg-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8 transition-all duration-1000 `}
        data-animate
        id="footer-section"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ userSelect: "text" }}>
                    EduBiz Network
                  </div>
                  <div className="text-sm text-blue-200" style={{ userSelect: "text" }}>
                    HOBBIZZ Platform
                  </div>
                </div>
              </div>
              <p className="text-blue-200" style={{ userSelect: "text" }}>
                Empowering students to explore their creative potential through art and community.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4" style={{ userSelect: "text" }}>
                Quick Links
              </h3>
              <div className="space-y-2">
                <Link href="#" className="block text-blue-200 hover:text-white transition-colors">
                  About Club
                </Link>
                <Link href="#" className="block text-blue-200 hover:text-white transition-colors">
                  Art Gallery
                </Link>
                <Link href="#" className="block text-blue-200 hover:text-white transition-colors">
                  Events
                </Link>
                <Link href="#" className="block text-blue-200 hover:text-white transition-colors">
                  Contests
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4" style={{ userSelect: "text" }}>
                Contact Info
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-blue-200">
                  <Mail className="w-4 h-4" />
                  <span style={{ userSelect: "text" }}>artclub@edubiz.com</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-200">
                  <Phone className="w-4 h-4" />
                  <span style={{ userSelect: "text" }}>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-200">
                  <MapPin className="w-4 h-4" />
                  <span style={{ userSelect: "text" }}>Mumbai, India</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4" style={{ userSelect: "text" }}>
                Follow Us
              </h3>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-300/50 border-2 border-transparent hover:border-blue-300"
                  onClick={() => window.open("https://facebook.com/artclub", "_blank")}
                >
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-300/50 border-2 border-transparent hover:border-blue-300"
                  onClick={() => window.open("https://instagram.com/artclub", "_blank")}
                >
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-300/50 border-2 border-transparent hover:border-blue-300"
                  onClick={() => window.open("https://twitter.com/artclub", "_blank")}
                >
                  <Twitter className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-800 mt-12 pt-8 text-center text-blue-200">
            <p style={{ userSelect: "text" }}>
              &copy; 2024 EduBiz Network. All rights reserved. | Art Club - HOBBIZZ Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default page