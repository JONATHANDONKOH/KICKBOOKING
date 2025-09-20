"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Sidebar from "@/components/Sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Search, CheckCircle, XCircle, Eye, Calendar, Clock, DollarSign, User, MapPin, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

interface Booking {
  id: string
  stadium_id: string
  stadiumName: string
  user_id: string
  userName: string
  booking_date: string
  start_time: string
  end_time: string
  duration: number
  total_price: number
  status: "pending" | "confirmed" | "cancelled"
  created_at: string
  approved_at?: string
  rejection_reason?: string
}

export default function BookingRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  // 🔹 join stadium name and user full name here
  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          booking_date,
          start_time,
          end_time,
          total_price,
          status,
          created_at,
          approved_at,
          rejection_reason,
          stadiums:stadium_id ( stadium_name ),
          users_profile:user_id ( full_name )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error

      const formatted: Booking[] = data.map((b: any) => ({
        id: b.id,
        stadium_id: b.stadium_id,
        stadiumName: b.stadiums?.stadium_name || "Unknown Stadium",
        user_id: b.user_id,
        userName: b.users_profile?.full_name || "Unknown User",
        booking_date: b.booking_date,
        start_time: b.start_time,
        end_time: b.end_time,
        duration: calculateDuration(b.start_time, b.end_time),
        total_price: b.total_price,
        status: b.status,
        created_at: b.created_at,
        approved_at: b.approved_at,
        rejection_reason: b.rejection_reason,
      }))

      setBookings(formatted)
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(`2000-01-01T${start}`)
    const endTime = new Date(`2000-01-01T${end}`)
    return Math.round((endTime.getTime() - startTime.getTime()) / 36e5)
  }

  const formatTimeRange = (start: string, end: string) => `${start} - ${end}`

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.stadiumName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApproveBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "confirmed", approved_at: new Date().toISOString() })
        .eq("id", id)
      
      if (error) {
        throw error
      }
      
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "confirmed", approved_at: new Date().toISOString() } : b))
      )
      
      toast({
        title: "Booking Approved",
        description: "The booking request has been approved successfully.",
      })
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleRejectBooking = async (id: string, reason: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled", rejection_reason: reason })
        .eq("id", id)
      
      if (error) {
        throw error
      }
      
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled", rejection_reason: reason } : b)))
      
      toast({
        title: "Booking Rejected",
        description: "The booking request has been rejected.",
        variant: "destructive",
      })
      
      setRejectionReason("")
      setIsDetailModalOpen(false)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

  const handleDeleteBooking = async (id: string) => {
    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id)
      
      if (error) {
        throw error
      }
      
      setBookings((prev) => prev.filter((b) => b.id !== id))
      
      toast({
        title: "Booking Deleted",
        description: "The booking has been deleted successfully.",
      })
      
      setIsDetailModalOpen(false)
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    }
  }

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

  const pendingCount = bookings.filter((b) => b.status === "pending").length
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 text-black overflow-hidden">
          {/* Header */}
          <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 px-4 lg:px-6 py-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Booking Requests
              </h1>
              <p className="text-slate-600 mt-1 text-sm lg:text-base">Manage and approve stadium booking requests.</p>
              <p className="text-green-700 mt-2 text-base font-medium">
                Every booking is a chance to create a memorable experience! Review, approve, or reject requests quickly to keep your users excited and your stadiums busy.
              </p>
            </div>
          </header>

          {/* Debug Info */}
          <div className="flex-shrink-0 bg-blue-50 px-4 lg:px-6 py-2">
            <p className="text-sm text-blue-800">
              Debug: Total bookings: {bookings.length}, Pending: {pendingCount}, Confirmed: {confirmedCount}
            </p>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden p-4 lg:p-6">
            <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4 lg:space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{bookings.length}</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{confirmedCount}</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                    <XCircle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{cancelledCount}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                <CardContent className="p-4 lg:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search by stadium, user, or booking ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/80"
                        />
                      </div>
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-white/80">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Bookings Table */}
              <Card className="bg-white/60 backdrop-blur-sm border-white/40 flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle>Booking Requests</CardTitle>
                  <CardDescription>
                    Showing {filteredBookings.length} of {bookings.length} booking requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-1 overflow-hidden">
                  <div className="h-full flex flex-col">
                    <ScrollArea className="flex-1">
                      <Table>
                        <TableHeader className="sticky top-0 bg-white z-10">
                          <TableRow>
                            <TableHead className="min-w-[100px]">Booking ID</TableHead>
                            <TableHead className="min-w-[150px]">Stadium</TableHead>
                            <TableHead className="min-w-[120px]">Customer</TableHead>
                            <TableHead className="min-w-[140px]">Date & Time</TableHead>
                            <TableHead className="min-w-[80px]">Duration</TableHead>
                            <TableHead className="min-w-[80px]">Amount</TableHead>
                            <TableHead className="min-w-[80px]">Status</TableHead>
                            <TableHead className="min-w-[120px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLoading ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8">
                                Loading bookings...
                              </TableCell>
                            </TableRow>
                          ) : filteredBookings.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8">
                                No bookings found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredBookings.map((booking) => (
                              <TableRow key={booking.id}>
                                <TableCell className="font-mono text-sm">#{booking.id.slice(0, 8)}...</TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{booking.stadiumName}</div>
                                    <div className="text-xs text-gray-500 flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      Stadium Location
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="truncate max-w-[100px]">{booking.userName}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="flex items-center text-sm">
                                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                      {booking.booking_date}
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatTimeRange(booking.start_time, booking.end_time)}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{booking.duration}h</TableCell>
                                <TableCell>
                                  <div className="flex items-center font-medium">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    {booking.total_price}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getStatusColor(booking.status)}>{booking.status}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedBooking(booking)
                                        setIsDetailModalOpen(true)
                                      }}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>

                                    {booking.status === "pending" && (
                                      <>
                                        <Button
                                          size="sm"
                                          onClick={() => handleApproveBooking(booking.id)}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-1" />
                                          Approve
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => {
                                            setSelectedBooking(booking)
                                            setRejectionReason("")
                                            setIsDetailModalOpen(true)
                                          }}
                                        >
                                          <XCircle className="h-4 w-4 mr-1" />
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                    
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteBooking(booking.id)}
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Detail Modal */}
          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>Review booking information and take action if needed.</DialogDescription>
              </DialogHeader>

              {selectedBooking && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Booking Information</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>ID:</strong> #{selectedBooking.id}
                        </div>
                        <div>
                          <strong>Stadium:</strong> {selectedBooking.stadiumName}
                        </div>
                        <div>
                          <strong>Date:</strong> {selectedBooking.booking_date}
                        </div>
                        <div>
                          <strong>Time:</strong> {formatTimeRange(selectedBooking.start_time, selectedBooking.end_time)}
                        </div>
                        <div>
                          <strong>Duration:</strong> {selectedBooking.duration} hours
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Customer Information</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Name:</strong> {selectedBooking.userName}
                        </div>
                        <div>
                          <strong>User ID:</strong> {selectedBooking.user_id}
                        </div>
                        <div>
                          <strong>Booking Date:</strong> {new Date(selectedBooking.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Payment Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span>Total Amount:</span>
                        <span className="font-bold text-lg">${selectedBooking.total_price}</span>
                      </div>
                    </div>
                  </div>

                  {selectedBooking.status === "pending" && (
                    <div>
                      <h4 className="font-semibold mb-2">Rejection Reason (Optional)</h4>
                      <Textarea
                        placeholder="Enter reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}

                  {selectedBooking.rejection_reason && (
                    <div>
                      <h4 className="font-semibold mb-2">Rejection Reason</h4>
                      <div className="bg-red-50 p-3 rounded-lg text-red-800">{selectedBooking.rejection_reason}</div>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>

                {selectedBooking?.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleApproveBooking(selectedBooking.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Booking
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleRejectBooking(selectedBooking.id, rejectionReason)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Booking
                    </Button>
                  </>
                )}
                
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteBooking(selectedBooking!.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  )
}