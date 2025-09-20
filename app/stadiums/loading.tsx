// Import UI components for loading state
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Loading Component for Stadiums Page
 * Displays skeleton placeholders while the stadiums page is loading
 * Provides visual feedback to users during data fetching
 */
export default function StadiumsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Back button skeleton */}
              <Skeleton className="h-10 w-24" />
              <div>
                {/* Page title skeleton */}
                <Skeleton className="h-8 w-48 mb-2" />
                {/* Subtitle skeleton */}
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            {/* Sign up button skeleton */}
            <div className="hidden md:block">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Search bar skeleton */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <Skeleton className="flex-1 h-10" />
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>

        {/* Stadiums Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Generate 6 skeleton cards to simulate loading stadiums */}
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Stadium image skeleton */}
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  {/* Stadium name skeleton */}
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  {/* Location skeleton */}
                  <Skeleton className="h-4 w-1/2 mb-3" />

                  {/* Stadium details skeleton */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>

                  {/* Amenities skeleton */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-14" />
                  </div>

                  {/* Price and button skeleton */}
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
