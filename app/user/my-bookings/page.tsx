"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Sidebar from "@/components/Sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, DollarSign, FileText } from "lucide-react"
import { useData } from "@/context/DataContext"

export default function MyBookingsPage() {
  const { bookings, updateBooking, refreshData } = useData()
  const [userBookings, setUserBookings] = useState<any[]>([])

  // Get current user from localStorage (in a real app, this would come from auth context)
  const getCurrentUser = () => {
    try {
      const user = localStorage.getItem("currentUser")
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  }

  // Filter bookings for current user
  useEffect(() => {
    const currentUser = getCurrentUser()
    console.log("[MyBookings] Current user:", currentUser)
    if (currentUser && bookings.length > 0) {
      bookings.forEach((booking) => {
        console.log(`[MyBookings] Booking ${booking.id}: userId=${booking.userId}, userName=${booking.userName}, status=${booking.status}`)
      })
      const filteredBookings = bookings.filter((booking) => {
        const matchesUserId = booking.userId === currentUser.id
        const matchesUserName = booking.userName === currentUser.name
        console.log(`[MyBookings] Booking ${booking.id}: userId match: ${matchesUserId}, userName match: ${matchesUserName}`)
        return matchesUserId || matchesUserName
      })

      console.log("Filtered user bookings:", filteredBookings)
      setUserBookings(filteredBookings)
    } else {
      setUserBookings([])
    }
  }, [bookings])

  // Data is now managed in-memory and automatically synchronized
  // through React's state management, so no refresh is needed

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleCancelBooking = (bookingId: string) => {
    updateBooking(bookingId, {
      status: "cancelled",
    })
  }

  const totalSpent = userBookings
    .filter((booking) => booking.status === "confirmed")
    .reduce((sum, booking) => sum + (booking.totalPrice || 0), 0)

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    } else {
      return `$${amount.toLocaleString()}`
    }
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <main className="flex-1 md:ml-64 p-4 md:p-8 text-black">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
              <p className="text-gray-600">Manage and track all your stadium bookings.</p>
            </div>

            {/* Debug Info */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Debug: Found {userBookings.length} bookings for current user out of {bookings.length} total bookings
              </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userBookings.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                  <Calendar className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {userBookings.filter((b) => b.status === "confirmed").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {userBookings.filter((b) => b.status === "pending").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold break-words" title={`$${totalSpent.toLocaleString()}`}>
                    {formatCurrency(totalSpent)}
                  </div>
                  {totalSpent >= 1000 && (
                    <p className="text-xs text-muted-foreground mt-1">${totalSpent.toLocaleString()}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Bookings List */}
            <div className="space-y-6">
              {userBookings.length > 0 ? (
                userBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{booking.stadiumName}</CardTitle>
                          <CardDescription>Booking ID: {booking.id}</CardDescription>
                        </div>
                        <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{booking.date}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{booking.timeSlot || booking.time}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">${booking.totalPrice?.toLocaleString() || 0}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{booking.duration}h duration</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">Notes:</span>
                          </div>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Booked on {new Date(booking.createdAt).toLocaleDateString()}
                        </span>

                        {booking.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Cancel Booking
                          </Button>
                        )}

                        {booking.status === "confirmed" && booking.approvedAt && (
                          <span className="text-xs text-green-600">
                            Approved on {new Date(booking.approvedAt).toLocaleDateString()}
                          </span>
                        )}

                        {booking.status === "cancelled" && booking.cancelledAt && (
                          <span className="text-xs text-red-600">
                            Cancelled on {new Date(booking.cancelledAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-4">Start by booking your first stadium!</p>
                    <Button onClick={() => (window.location.href = "/user/book-stadium")}>Book Stadium</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
