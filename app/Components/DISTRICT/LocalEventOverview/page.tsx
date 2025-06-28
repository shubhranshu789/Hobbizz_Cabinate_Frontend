import { Suspense } from "react"
import LocalEventOverviewPage from "../../DISTRICT/local-event-overview"

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <span className="text-lg font-semibold text-gray-700">Loading page...</span>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LocalEventOverviewPage />
    </Suspense>
  )
}
