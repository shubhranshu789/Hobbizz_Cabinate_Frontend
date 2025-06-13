import Image from "next/image"
import { Search } from "lucide-react"
import Link from "next/link"



// Sample data for Indian districts with their landmarks
const districts = [
  {
    id: 1,
    name: "Hapur",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    name: "Ayodhya",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    name: "Jhansi",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 4,
    name: "Ghaziabad",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 5,
    name: "Bulandsahar",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 6,
    name: "Agra",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 7,
    name: "Lucknow",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 8,
    name: "Varanasi",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 9,
    name: "Kanpur",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen">


      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12">LOCAL CHAPTERS</h1>

        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">Districts</h2>
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search districts..."
              className="w-full px-4 py-2 border rounded-md bg-gray-100"
            />
            <Search className="absolute right-3 top-2.5 text-gray-500" size={20} />
          </div>
        </div>

        {/* Districts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {districts.map((district) => (
            <div key={district.id} className="relative rounded-lg overflow-hidden shadow-md h-64">
              <Image
                src={district.image || "/placeholder.svg"}
                alt={`${district.name} District`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute bottom-0 w-full bg-blue-500 text-white text-center py-3 text-xl font-medium">
                {district.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
