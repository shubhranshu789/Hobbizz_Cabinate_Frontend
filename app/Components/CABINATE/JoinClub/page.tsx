import Link from "next/link"
import { ClubsGrid } from "../components/clubs-grid"

import Navbar from "../../../Components/Navbar/page"

export default function Home() {
  return (
    <div style={{padding : "20px"}} className="min-h-screen bg-gradient-to-b from-white to-gray-50">
     <Navbar/>
      <main style={{marginTop : "60px"}} className="container py-6">
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Welcome to Hobbizz</h1>
          <p className="mt-2 text-gray-600">
            Discover and join exciting hobby clubs that match your interests. Explore, learn, and connect with
            like-minded students.
          </p>
          <Link href="/explore">
            <button className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              Explore Clubs
            </button>
          </Link>
        </div>
        <ClubsGrid />
      </main>
      <footer className="border-t bg-white py-8">
        <div className="container grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-500 p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-puzzle"
                >
                  <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 3.17 9.5c0-.617.236-1.234.706-1.704L5.457 6.15a.98.98 0 0 1 .878-.288c.493.074.84.504 1.02.968a2.5 2.5 0 1 0 3.237-3.237c-.464-.18-.894-.527-.967-1.02a1.026 1.026 0 0 1 .289-.878l1.568-1.568A2.402 2.402 0 0 1 13.5 0c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
                </svg>
              </div>
              <span className="text-lg font-bold">Hobbizz</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Discover and join exciting hobby clubs that match your interests. Explore, learn, and connect with
              like-minded students.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-8">
            <div>
              <h3 className="font-medium">Platform</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/explore">Explore Clubs</Link>
                </li>
                <li>
                  <Link href="/events">Events</Link>
                </li>
                <li>
                  <Link href="/create">Create a Club</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium">Support</h3>
              <ul className="mt-2 space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/guidelines">Community Guidelines</Link>
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="font-medium">Legal</h3>
            <ul className="mt-2 space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/cookies">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mt-8 flex items-center justify-center gap-2">
          <button className="rounded-full border p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span className="text-sm">4 / 9</span>
          <button className="rounded-full border p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  )
}
