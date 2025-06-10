"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ThumbsUp, ThumbsDown, Search, Bell, LogOut, Home, PlusCircle, User, Info, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import Navbar from "../../../../Components/DISTRICT/DirectorNavbar/page"


// import "../../../Components/ParticularActivityInfo"
// import "../../../../Components/DISTRICT/ParticularActivityInfo"


function ReviewActitvity() {
    const [pic, setPic] = useState([]);
    const token = localStorage.getItem("jwt");
    const [selectedActivity, setSelectedActivity] = useState(null)

    const router = useRouter();

    const gotohome = () => {
        router.push('../../../Components/home');
    };

    const [approvals, setApprovals] = useState({})

  const handleApproval = (id, isApproved) => {
    setApprovals((prev) => ({
      ...prev,
      [id]: isApproved,
    }))
  }

   const openActivityModal = (pic) => {
    setSelectedActivity(pic)
  }

  const closeActivityModal = () => {
    setSelectedActivity(null)
  }


  const handleClickSubmitId = (id) => {
   router.push(`../../../../Components/DISTRICT/ParticularActivityInfo?id=${id}`);
  };




    useEffect(() => {

        if (!token) {
            gotohome();
            return;
        }

        fetch("http://localhost:5000/allActivities", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                setPic(result);
                // setPosts(result)
                console.log(pic);
            });
    }, []);



    
    return (
        <div>
            <Navbar />
            {/* <div>
                {pic.map((activity) => (
                    <div key={activity._id} className="border p-4 rounded-lg shadow-md">
                        <img
                            src={activity.pic}
                            alt={activity.title}
                            className="w-full h-48 object-cover rounded"
                        />
                        <h2 className="text-xl font-bold mt-2">{activity.title}</h2>
                        <p>{activity.desc}</p>
                        <p className="text-sm text-gray-500">Category: {activity.category}</p>
                    </div>
                ))}

            </div> */}



            <div className="container mx-auto px-4 pb-16" style={{marginTop : "60px"}}>
                    <h2 className="text-2xl font-bold text-white mb-6">Recent Activities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pic.map((activity) => (
                        <motion.div
                          key={activity._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ y: -5 }}
                          className="h-full"
                        >
                          <Card className="overflow-hidden h-full bg-white/95 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                             <div className="relative cursor-pointer" 
                             onClick={() => handleClickSubmitId(activity._id)}
                             >
                              <img
                                src={activity.pic || "/placeholder.svg"}
                                alt={activity.title}
                                className="w-full h-48 object-cover hover:opacity-90 transition-opacity duration-200"
                              />
                              <Badge className="absolute top-3 right-3 bg-blue-600 hover:bg-blue-700">{activity.category}</Badge>
                              
                            </div>
                            <CardContent className="p-5">
                              <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                              <p className="text-gray-600 mb-4">{activity.desc}</p>
            
            
                              {/* <div className="flex justify-between items-center mt-4">
                                <div className="flex gap-2">
                                  <Button
                                    variant={approvals[activity._id] === true ? "default" : "outline"}
                                    size="sm"
                                    className={approvals[activity._id] === true ? "bg-green-600 hover:bg-green-700" : ""}
                                    onClick={() => handleApproval(activity._id, true)}
                                  >
                                    <ThumbsUp size={16} className="mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant={approvals[activity._id] === false ? "default" : "outline"}
                                    size="sm"
                                    className={approvals[activity._id] === false ? "bg-red-600 hover:bg-red-700" : ""}
                                    onClick={() => handleApproval(activity._id, false)}
                                  >
                                    <ThumbsDown size={16} className="mr-1" />
                                    Disapprove
                                  </Button>
                                </div>
                                <span className="text-xs text-gray-500">ID: {activity._id}</span>
                              </div> */}



                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
            </div>
            
            
                  {/* Activity Detail Modal */}
                  <Dialog open={!!selectedActivity} onOpenChange={closeActivityModal}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-blue-600">{selectedActivity?.title}</DialogTitle>
                      </DialogHeader>
            
                      {selectedActivity && (
                        <div className="space-y-6">
                          {/* Enlarged Image */}
                          <div className="relative w-full">
                            <img
                              src={selectedActivity.pic || "/placeholder.svg"}
                              alt={selectedActivity.title}
                              className="w-full max-h-96 object-contain rounded-lg shadow-lg"
                            />
                            <Badge className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 text-sm">
                              {selectedActivity.category}
                            </Badge>
                          </div>
            
                          {/* Activity Details */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                              <p className="text-gray-600 leading-relaxed">{selectedActivity.desc}</p>
                            </div>
            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Category</h4>
                                <p className="text-gray-600">{selectedActivity.category}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-1">Activity ID</h4>
                                <p className="text-gray-600 font-mono">{selectedActivity._id}</p>
                              </div>
                            </div>
            
                            {/* Additional Details Section */}
                            <div className="border-t pt-4">
                              <h4 className="font-semibold text-gray-800 mb-2">Additional Information</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Status:</span>
                                  <span className="ml-2 text-gray-600">
                                    {approvals[selectedActivity._id] === true
                                      ? "Approved"
                                      : approvals[selectedActivity._id] === false
                                        ? "Disapproved"
                                        : "Pending Review"}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Date Added:</span>
                                  <span className="ml-2 text-gray-600">June 8, 2025</span>
                                </div>
                              </div>
                            </div>
            
                            {/* Action Buttons in Modal */}
                            <div className="flex gap-3 pt-4 border-t">
                              <Button
                                variant={approvals[selectedActivity._id] === true ? "default" : "outline"}
                                className={approvals[selectedActivity._id] === true ? "bg-green-600 hover:bg-green-700" : ""}
                                onClick={() => handleApproval(selectedActivity._id, true)}
                              >
                                <ThumbsUp size={16} className="mr-2" />
                                Approve
                              </Button>
                              <Button
                                variant={approvals[selectedActivity._id] === false ? "default" : "outline"}
                                className={approvals[selectedActivity._id] === false ? "bg-red-600 hover:bg-red-700" : ""}
                                onClick={() => handleApproval(selectedActivity._id, false)}
                              >
                                <ThumbsDown size={16} className="mr-2" />
                                Disapprove
                              </Button>
                              <Button variant="outline" onClick={closeActivityModal}>
                                Close
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>



        </div>
    )
}

export default ReviewActitvity