"use client"

// Import necessary React hooks
import { useState, useMemo } from "react"
// Import Next.js navigation
import { useRouter } from "next/navigation"
// Import UI components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Import icons
import { Search, Filter, ArrowLeft, MapPin, Users, Star, Clock } from "lucide-react"
// Import data context and components
import { useData } from "@/context/DataContext"
import StadiumCard from "@/components/StadiumCard"
// Import authentication context
import { useAuth } from "@/context/AuthContext"

/**
 * Public Stadiums Page Component
 * This page allows anyone (authenticated or not) to browse available stadiums
 * Includes search, filter, and sort functionality
 * Encourages non-authenticated users to sign up for booking
 */
export default function StadiumsPage() {
  // Get router for navigation
  const router = useRouter()
  // Get stadiums data from context
  const { stadiums } = useData()
  // Get authentication state
  const { user } = useAuth()

  // State for search and filter functionality
  const [searchTerm, setSearchTerm] = useState("") // Search input value
  const [selectedLocation, setSelectedLocation] = useState("all") // Location filter
  const [sortBy, setSortBy] = useState("name") // Sort criteria
  const [showFilters, setShowFilters] = useState(false) // Toggle filter panel visibility

  // Get unique locations from stadiums for filter dropdown
  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(stadiums.map((stadium) => stadium.location))]
    return uniqueLocations.sort()
  }, [stadiums])

  // Filter and sort stadiums based on current search and filter criteria
  const filteredAndSortedStadiums = useMemo(() => {
    const filtered = stadiums.filter((stadium) => {
      // Only show active stadiums on public page
      if (stadium.status !== "active") return false

      // Filter by search term (name or location)
      const matchesSearch =
        stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stadium.location.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by selected location
      const matchesLocation = selectedLocation === "all" || stadium.location === selectedLocation

      return matchesSearch && matchesLocation
    })

    // Sort stadiums based on selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "location":
          return a.location.localeCompare(b.location)
        case "price-low":
          return a.pricePerHour - b.pricePerHour
        case "price-high":
          return b.pricePerHour - a.pricePerHour
        case "capacity":
          return b.capacity - a.capacity
        default:
          return 0
      }
    })

    return filtered
  }, [stadiums, searchTerm, selectedLocation, sortBy])

  // Handle back navigation to homepage
  const handleBack = () => {
    router.push("/")
  }

  // Handle sign up navigation for non-authenticated users
  const handleSignUp = () => {
    router.push("/register")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Header Section - Page title and navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Back button and page title */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Browse Stadiums</h1>
                <p className="text-gray-600 mt-1">Discover premium football stadiums for your next match</p>
              </div>
            </div>

            {/* Call-to-action for non-authenticated users */}
            {!user && (
              <div className="hidden md:block">
                <Button onClick={handleSignUp} className="bg-green-600 hover:bg-green-700 text-white">
                  Sign Up to Book
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search stadiums by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>

            {/* Filter Panel - Collapsible */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                      <SelectItem value="price-low">Price (Low to High)</SelectItem>
                      <SelectItem value="price-high">Price (High to Low)</SelectItem>
                      <SelectItem value="capacity">Capacity (Largest First)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Count */}
                <div className="flex items-end">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{filteredAndSortedStadiums.length}</span> stadiums found
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Call-to-action banner for non-authenticated users */}
        {!user && (
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Ready to Book Your Stadium?</h3>
                  <p className="text-green-700">
                    Sign up now to access instant booking, secure payments, and exclusive deals.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Button onClick={handleSignUp} className="bg-green-600 hover:bg-green-700 text-white">
                    Get Started Free
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stadiums Grid */}
        {filteredAndSortedStadiums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedStadiums.map((stadium) => (
              <StadiumCard
                key={stadium.id}
                stadium={stadium}
                showBookButton={false} // Don't show booking button on public page
              />
            ))}
          </div>
        ) : (
          // No results state
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <MapPin className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stadiums found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters to find more stadiums.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedLocation("all")
                  setSortBy("name")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Bottom Call-to-action for non-authenticated users */}
        {!user && (
          <div className="bg-gray-900 text-white py-12 mt-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Book Your Perfect Stadium?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of satisfied customers who trust KickBooking for their stadium needs.
              </p>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center">
                  <Clock className="h-8 w-8 text-green-400 mb-2" />
                  <h3 className="font-semibold mb-1">Instant Booking</h3>
                  <p className="text-gray-400 text-sm">Book and confirm in seconds</p>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="h-8 w-8 text-green-400 mb-2" />
                  <h3 className="font-semibold mb-1">Premium Quality</h3>
                  <p className="text-gray-400 text-sm">Only the best stadiums</p>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="h-8 w-8 text-green-400 mb-2" />
                  <h3 className="font-semibold mb-1">Trusted by Thousands</h3>
                  <p className="text-gray-400 text-sm">Join our community</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={handleSignUp}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                >
                  Sign Up Free
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3"
                >
                  Already have an account?
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
