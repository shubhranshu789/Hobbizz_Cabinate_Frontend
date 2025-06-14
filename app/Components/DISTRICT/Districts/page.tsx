"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Search, Users, Landmark } from "lucide-react";

interface DistrictInfo {
  name: string;
  totalMembers: number;
  students: number;
  teachers: number;
  head: string;
  maxMembers: number;
}

const districts = [
  "Varanasi",
  "Lucknow",
  "Kanpur",
  "Prayagraj",
  "Agra",
  "Noida",
  "Ghaziabad",
  "Jaunpur",
];

export default function DistrictPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [districtData, setDistrictData] = useState<DistrictInfo | null>(null);

  const filteredDistricts = districts.filter((district) =>
    district.toLowerCase().includes(searchTerm.toLowerCase())
  );

 const fetchDistrictData = async (name: string) => {
  try {
    const response = await fetch(`http://localhost:5000/routes/districtinfo?name=${encodeURIComponent(name)}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    setDistrictData(data);
  } catch (error) {
    console.error("Error fetching district data:", error);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-500 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            District Directory
          </h1>
          <div className="flex justify-center items-center gap-2">
            <Search className="text-white" />
            <Input
              placeholder="Search District..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredDistricts.map((district) => (
            <Dialog key={district}>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  onClick={() => {
                    setSelectedDistrict(district);
                    fetchDistrictData(district);
                  }}
                  className="cursor-pointer p-6 bg-white rounded-xl shadow-lg text-center text-blue-700 font-semibold text-xl hover:bg-blue-50"
                >
                  <Landmark className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  {district}
                </motion.div>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                {districtData ? (
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-blue-700 text-center">
                      {districtData.name}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>Total Members:</div>
                      <div className="font-semibold">{districtData.totalMembers}</div>

                      <div>Students:</div>
                      <div className="font-semibold">{districtData.students}</div>

                      <div>Teachers:</div>
                      <div className="font-semibold">{districtData.teachers}</div>

                      <div>Head:</div>
                      <div className="font-semibold">{districtData.head}</div>

                      <div>Max Members:</div>
                      <div className="font-semibold">{districtData.maxMembers}</div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button className="w-full">View Chapters</Button>
                      <Button variant="outline" className="w-full">Assign Head</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-blue-600">Loading details...</div>
                )}
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  );
}
