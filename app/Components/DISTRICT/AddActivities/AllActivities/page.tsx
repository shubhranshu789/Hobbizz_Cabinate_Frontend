'use client'
import { Button } from "@/components/ui/button"
import { Sparkles, Upload, Settings, Users } from "lucide-react"

import { useRouter } from 'next/navigation';

import Navbar from "../../../DISTRICT/DirectorNavbar/page"

// import "../../../../Components/DISTRICT/AddActivities/ViewCompitions"

export default function FullScreenButtons() {

    const router = useRouter();
  return (

    

    <div>
        <Navbar/>
        <div style={{marginTop : "60px"}} className="min-h-screen w-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-4 md:p-8">
        <div className="h-full min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Button 1 */}
            <Button
            variant="outline"
            className="h-full min-h-[200px] md:min-h-[300px] bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-lg md:text-xl font-semibold shadow-lg hover:shadow-xl group"
            onClick={() => {router.push("/Components/DISTRICT/AddActivities")}}
            >
            <Sparkles className="w-12 h-12 md:w-16 md:h-16 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-center">Create New Affair</span>
            <span className="text-sm md:text-base opacity-80 text-center max-w-xs">
                Share your creative work with the community
            </span>
            </Button>

            {/* Button 2 */}
            <Button
            variant="outline"
            className="h-full min-h-[200px] md:min-h-[300px] bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-lg md:text-xl font-semibold shadow-lg hover:shadow-xl group"
            onClick={() => {router.push("/Components/DISTRICT/ReviewActivity")}}
            >
            <Upload className="w-12 h-12 md:w-16 md:h-16 group-hover:-translate-y-2 transition-transform duration-300" />
            <span className="text-center">All Affairs</span>
            <span className="text-sm md:text-base opacity-80 text-center max-w-xs">Drop your photos and files here</span>
            </Button>

            {/* Button 3 */}
            {/* <Button
            variant="outline"
            className="h-full min-h-[200px] md:min-h-[300px] bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-lg md:text-xl font-semibold shadow-lg hover:shadow-xl group"
            onClick={() => {router.push("/Components/DISTRICT/AddActivities/AddCompitition")}}
            >
            <Users className="w-12 h-12 md:w-16 md:h-16 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-center">Add Competition</span>
            <span className="text-sm md:text-base opacity-80 text-center max-w-xs">Connect with other creators</span>
            </Button> */}

            {/* Button 4 */}
            <Button
            variant="outline"
            className="h-full min-h-[200px] md:min-h-[300px] bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-lg md:text-xl font-semibold shadow-lg hover:shadow-xl group"
            onClick={() => {router.push("/Components/DISTRICT/AddActivities/ViewCompitions")}}
            >
            <Settings className="w-12 h-12 md:w-16 md:h-16 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-center">View all Compititions</span>
            <span className="text-sm md:text-base opacity-80 text-center max-w-xs">Customize your experience</span>
            </Button>
        </div>
        </div>
    </div>
  )
}
