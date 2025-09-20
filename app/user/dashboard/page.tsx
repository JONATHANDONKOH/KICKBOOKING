"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Sidebar from "@/components/Sidebar"
import StadiumCard from "@/components/StadiumCard"
import BookingModal from "@/components/BookingModal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import { Calendar, Clock, MapPin, Bell, AlertCircle, Building2 } from 'lucide-react'

interface Stadium {
  id: string
  name: string
  location: string
  capacity: number
  pricePerHour: number
  rating: number
  amenities: string[]
  description?: string
  imageUrl?: string
  availability: "Available" | "Booked" | "Inactive"
  isActive: boolean
}

export default function UserDashboard() {
  const { stadiums, bookings, refreshData } = useData()
  const { user } = useAuth()
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // Get user's bookings
  const userBookings = bookings.filter((booking) => booking.userId === user?.id || booking.userName === user?.name)
  const recentBookings = userBookings.slice(0, 3)
  // Only show active stadiums to users
  const availableStadiums = stadiums.filter((stadium) => stadium.isActive && stadium.availability === "Available")

  // Handle stadium booking
  const handleBookStadium = (stadium: Stadium) => {
    setSelectedStadium(stadium)
    setIsBookingModalOpen(true)
  }

  // Handle booking modal close
  const handleBookingModalClose = () => {
    setIsBookingModalOpen(false)
    setSelectedStadium(null)
  }

  // Handle successful booking
  const handleBookingSuccess = () => {
    setIsBookingModalOpen(false)
    setSelectedStadium(null)
    refreshData() // Refresh data to show new booking
  }

  // Data is now managed in-memory and automatically synchronized
  // through React's state management, so no refresh is needed on mount

  // Data is now managed in-memory and automatically synchronized
  // through React's state management, so no event listeners are needed

  return (
    <ProtectedRoute requiredRole="user">
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        <Sidebar userType="user" />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden text-black">
          {/* Header */}
          <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 px-4 lg:px-6 py-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 mt-1 text-sm lg:text-base">
                Welcome back, {user?.name}! Here's what's happening with your bookings.
              </p>
            </div>
          </header>

          {/* Main Content */}
          <ScrollArea className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
              {/* Alert for no active stadiums */}
              {availableStadiums.length === 0 && (
                <Card className="border-yellow-200 bg-yellow-50/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-yellow-800">No Stadiums Available</h3>
                        <p className="text-sm text-yellow-700">
                          There are currently no active stadiums available for booking. Please check back later or
                          contact an administrator.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <Card className="bg-white/60 backdrop-blur-sm border-white/40 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">My Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{userBookings.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {userBookings.filter((b) => b.status === "confirmed").length} confirmed
                    </p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width:
                              userBookings.length > 0
                                ? `${(userBookings.filter((b) => b.status === "confirmed").length / userBookings.length) * 100}%`
                                : "0%",
                          }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-white/40 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {userBookings.filter((b) => b.status === "pending").length}
                    </div>
                    <p className="text-xs text-muted-foreground">Awaiting admin approval</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-white/40 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Available Stadiums</CardTitle>
                    <MapPin className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{availableStadiums.length}</div>
                    <p className="text-xs text-muted-foreground">Ready to book</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
                {/* Recent Bookings */}
                <div className="xl:col-span-2">
                  <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                    <CardHeader>
                      <CardTitle>Recent Bookings</CardTitle>
                      <CardDescription>Your latest booking requests and confirmations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {recentBookings.length > 0 ? (
                        <div className="space-y-4">
                          {recentBookings.map((booking) => (
                            <div
                              key={booking.id}
                              className="flex items-center justify-between p-4 border rounded-lg bg-gray-50/50"
                            >
                              <div>
                                <h4 className="font-semibold">{booking.stadiumName}</h4>
                                <p className="text-sm text-gray-600">
                                  {booking.date} • {booking.time}
                                </p>
                                <p className="text-sm font-medium">${booking.totalPrice}</p>
                              </div>
                              <Badge
                                variant={
                                  booking.status === "confirmed"
                                    ? "default"
                                    : booking.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {booking.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No bookings yet</p>
                          <p className="text-sm text-gray-400">Start by booking a stadium!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Notifications */}
                <div>
                  <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bell className="h-5 w-5 mr-2" />
                        Notifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userBookings.filter((b) => b.status === "confirmed").length > 0 && (
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm font-medium text-green-900">Booking Confirmed</p>
                            <p className="text-xs text-green-700 mt-1">
                              {userBookings.filter((b) => b.status === "confirmed").length} booking(s) confirmed by
                              admin
                            </p>
                          </div>
                        )}
                        {userBookings.filter((b) => b.status === "pending").length > 0 && (
                          <div className="p-3 bg-yellow-50 rounded-lg">
                            <p className="text-sm font-medium text-yellow-900">Pending Approval</p>
                            <p className="text-xs text-yellow-700 mt-1">
                              {userBookings.filter((b) => b.status === "pending").length} booking(s) awaiting admin
                              approval
                            </p>
                          </div>
                        )}
                        {userBookings.filter((b) => b.status === "cancelled").length > 0 && (
                          <div className="p-3 bg-red-50 rounded-lg">
                            <p className="text-sm font-medium text-red-900">Booking Rejected</p>
                            <p className="text-xs text-red-700 mt-1">
                              {userBookings.filter((b) => b.status === "cancelled").length} booking(s) rejected by admin
                            </p>
                          </div>
                        )}
                        {availableStadiums.length > 0 && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm font-medium text-blue-900">Stadiums Available</p>
                            <p className="text-xs text-blue-700 mt-1">
                              {availableStadiums.length} stadium(s) activated and ready for booking
                            </p>
                          </div>
                        )}
                        {stadiums.length === 0 && (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">No Activity</p>
                            <p className="text-xs text-gray-700 mt-1">
                              Notifications will appear here when there's activity
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Available Stadiums */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Available Stadiums</h2>
                  <p className="text-gray-600">{availableStadiums.length} stadiums available</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {availableStadiums.length > 0 ? (
                    availableStadiums.slice(0, 6).map((stadium) => (
                      <StadiumCard 
                        key={stadium.id} 
                        stadium={stadium} 
                        onBook={handleBookStadium}
                        showBookButton={true}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No stadiums available yet.</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Stadiums need to be activated by an administrator before they can be booked.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Booking Modal */}
        {selectedStadium && (
          <BookingModal
            stadium={selectedStadium}
            isOpen={isBookingModalOpen}
            onClose={handleBookingModalClose}
            onBookingSuccess={handleBookingSuccess}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
