"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, User, Bell, Locate, Search, Sparkles, Home as HomeIcon, Settings, Star } from "lucide-react"
import { useRouter } from 'next/navigation';

function Navbar() {
  const [user, setUser] = useState(null)
  const [clubHead, setClubHead] = useState(null)
  const [navType, setNavType] = useState("default") // 'default' | 'head' | 'member'
  const router = useRouter();


  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("jwt")

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      // If user has a club assigned
      if (parsedUser.club) {
        fetch(`http://localhost:5000/${parsedUser.club}/gethead?district=${parsedUser.district}`)
          .then(res => res.json())
          .then(data => {
            // If there's a head set in club and compare with logged-in user id
            if (data.head && data.head._id === parsedUser._id) {
              setNavType("head")
            } else {
              setNavType("council")
            }
          })
          .catch(err => {
            console.error("Failed to fetch club info", err)
            setNavType("default")
          })
      } else {
        setNavType("default")
      }
    }
  }, [])

  const logout = () => {
    router.push('/Components/Auth/SignIn')
    localStorage.clear()
  }

  const navOptions = {
    default: [
      { name: "Home", icon: HomeIcon, action: () => router.push('/Components/home') },
      { name: "Local Chapters", icon: Locate, action: () => router.push('/Components/DISTRICT/LocalChapters') },
      { name: "Participate", icon: User, action: () => router.push('/Components/ParticipateInActivity') },
      { name: "Apply for Club", icon: Bell, action: () => router.push('/Components/CABINATE/JoinClub') },
    ],
    head: [
      { name: "Home", icon: HomeIcon, action: () => router.push('/Components/home') },
      { name: "Local Chapters", icon: Locate, action: () => router.push('/Components/DISTRICT/LocalChapters') },
      { name: "Manage Council", icon: Settings, action: () => router.push(`/Components/DISTRICT/ManageCouncil`) },
      { name: "Manage Roles", icon: Star, action: () => router.push('/Components/CABINATE/ManageRoles') },
    ],
    council: [
      { name: "Home", icon: HomeIcon, action: () => router.push('/Components/home') },
      { name: "Local Chapters", icon: Locate, action: () => router.push('/Components/DISTRICT/LocalChapters') },
      { name: "Club Info", icon: Sparkles, action: () => router.push('/Components/CABINATE/ClubInfo') },
    ],
  }

  const currentNavItems = navOptions[navType]

  return (
    <div>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span onClick={() => router.push('/Components/home')} className="text-xl font-bold text-gray-800 cursor-pointer">HOBBIZZ</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {currentNavItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={item.action}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-blue-600">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-blue-600">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button onClick={logout} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {currentNavItems.map((item) => (
                    <Button key={item.name} variant="ghost" className="justify-start text-left" onClick={item.action}>
                      <item.icon className="w-5 h-5 mr-2" />
                      {item.name}
                    </Button>
                  ))}

                  <div className="border-t pt-4 space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button onClick={logout} className="w-full justify-start bg-gradient-to-r from-blue-600 to-blue-500">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </motion.nav>
    </div>
  )
}

export default Navbar;
