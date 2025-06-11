import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Filter,
  Search,
  Users,
  Calendar,
  Palette,
  Music,
  Camera,
  Zap,
  Cpu,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ChevronLeft,
  ChevronRight,
  SortAsc,
} from "lucide-react"

function page() {
  return (
    <div>
        {/* Footer */}
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/80 backdrop-blur-md border-t mt-16"
        >
            <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">H</span>
                    </div>
                    <span className="text-xl font-bold">Hobbizz</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                    Discover and join exciting hobby clubs that match your interests. Explore, learn, and connect with
                    like-minded students.
                </p>
                <div className="flex gap-3">
                    {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm" className="w-8 h-8 p-0">
                        <Icon className="w-4 h-4" />
                        </Button>
                    </motion.div>
                    ))}
                </div>
                </div>

                <div>
                <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                        Home
                    </a>
                    </li>
                    <li>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                        Explore Clubs
                    </a>
                    </li>
                    <li>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                        Events
                    </a>
                    </li>
                    <li>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                        Create a Club
                    </a>
                    </li>
                </ul>
                </div>

                <div>
                <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                        Help Center
                    </a>
                    </li>
                    <li>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                        Contact Us
                    </a>
                    </li>
                    <li>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                        FAQ
                    </a>
                    </li>
                    <li>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                        Community Guidelines
                    </a>
                    </li>
                </ul>
                </div>

                <div>
                <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                        Terms of Service
                    </a>
                    </li>
                    <li>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                        Privacy Policy
                    </a>
                    </li>
                    <li>
                    <a href="#" className="hover:text-blue-600 transition-colors">
                        Cookie Policy
                    </a>
                    </li>
                </ul>
                </div>
            </div>

            <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
                © 2023 Hobbizz. All rights reserved.
            </div>
            </div>
        </motion.footer>
    </div>
  )
}

export default page