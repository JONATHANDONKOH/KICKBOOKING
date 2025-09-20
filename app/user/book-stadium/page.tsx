"use client"
import { createBrowserClient } from "@supabase/ssr"
import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Sidebar from "@/components/Sidebar"
import StadiumCard from "@/components/StadiumCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import { Search, AlertCircle, Building2, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

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

export default function BookStadiumPage() {
  // Use Supabase SSR browser client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  // You can fetch user with supabase.auth.getUser() if needed
  // Example: const { data: { user } } = await supabase.auth.getUser()
  const { stadiums, refreshData } = useData()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterBy, setFilterBy] = useState("all")
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState({
    price: 0,
    bookingDate: "",
    startTime: "",
    endTime: "",
    transferName: "",
    transferNumber: "0242737247"
  })
  const [totalAmount, setTotalAmount] = useState(0)
  const [loading, setLoading] = useState(false)

  const activeStadiums = stadiums.filter((stadium) => stadium.isActive)

  const filteredStadiums = activeStadiums
    .filter((stadium) => {
      const matchesSearch =
        stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stadium.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterBy === "all" || stadium.availability.toLowerCase() === filterBy
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.pricePerHour - b.pricePerHour
        case "capacity":
          return b.capacity - a.capacity
        case "rating":
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })


  const calculateTotalAmount = () => {
    if (paymentData.startTime && paymentData.endTime) {
      const start = new Date(paymentData.startTime)
      const end = new Date(paymentData.endTime)
      if (end > start) {
        const durationInHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
        const amount = durationInHours * Number(paymentData.price)
        setTotalAmount(amount)
      } else {
        setTotalAmount(0)
      }
    } else {
      setTotalAmount(0)
    }
  }

  useEffect(() => {
    calculateTotalAmount()
  }, [paymentData.startTime, paymentData.endTime, paymentData.price])

  const handleBookStadium = (stadium: Stadium) => {
    if (!user) return alert("You must be logged in to book a stadium.")

    setSelectedStadium(stadium)
    // Set the current date as default for booking date
    const today = new Date().toISOString().split('T')[0]
    setPaymentData({
      price: stadium.pricePerHour,
      bookingDate: today,
      startTime: "",
      endTime: "",
      transferName: "",
      transferNumber: "0242737247"
    })
    setShowPaymentModal(true)
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStadium || !user) return;

    setLoading(true);
    try {
      if (!paymentData.bookingDate || !paymentData.startTime || !paymentData.endTime) {
        throw new Error("Please select booking date, start time, and end time");
      }

      if (!paymentData.transferName || !paymentData.transferNumber) {
        throw new Error("Please provide transfer details");
      }

      const startTime = new Date(paymentData.startTime);
      const endTime = new Date(paymentData.endTime);

      if (endTime <= startTime) {
        throw new Error("End time must be after start time");
      }

      const bookingDateFormatted = new Date(paymentData.bookingDate).toISOString().split('T')[0];
      const startTimeFormatted = new Date(paymentData.startTime).toISOString();
      const endTimeFormatted = new Date(paymentData.endTime).toISOString();

      // ✅ Call your API route instead of Supabase directly
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_price: totalAmount,
          booking_date: bookingDateFormatted,
          start_time: startTimeFormatted,
          end_time: endTimeFormatted,
          user_id: user.id,
          stadium_id: selectedStadium.id,
          transaction_name: paymentData.transferName,
          transaction_number: paymentData.transferNumber
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create booking');
      }

      const data = await response.json();
      console.log('Booking created via API:', data);

      alert(`✅ Booking confirmed for ${selectedStadium.name} (GHS ${totalAmount.toFixed(2)})`);
      setShowPaymentModal(false);
      refreshData();
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.message || "An error occurred during payment processing");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
  <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 text-black">
          <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 px-4 lg:px-6 py-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Book Stadium
              </h1>
              <p className="text-slate-600 mt-1 text-sm lg:text-base">
                Find and book from available stadiums activated by administrators.
              </p>
            </div>
          </header>

          <ScrollArea className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
              {activeStadiums.length === 0 && (
                <Card className="border-yellow-200 bg-yellow-50/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-yellow-800">No Active Stadiums</h3>
                        <p className="text-sm text-yellow-700">
                          There are currently no stadiums activated for booking. Please contact an administrator or
                          check back later.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeStadiums.length > 0 && (
                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardContent className="p-4 lg:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <div className="lg:col-span-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search stadiums by name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white/80"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-0 lg:contents">
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="bg-white/80">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="price">Price (Low to High)</SelectItem>
                            <SelectItem value="capacity">Capacity (High to Low)</SelectItem>
                            <SelectItem value="rating">Rating (High to Low)</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={filterBy} onValueChange={setFilterBy}>
                          <SelectTrigger className="bg-white/80">
                            <SelectValue placeholder="Filter by availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Active Stadiums</SelectItem>
                            <SelectItem value="available">Available Now</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeStadiums.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing {filteredStadiums.length} of {activeStadiums.length} active stadiums
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {filteredStadiums.length > 0 ? (
                  filteredStadiums.map((stadium) => (
                    <StadiumCard
                      key={stadium.id}
                      stadium={stadium}
                      onBook={() => handleBookStadium(stadium)}
                      showBookButton={true}
                      currency="GHS"
                    />
                  ))
                ) : activeStadiums.length > 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No stadiums found matching your criteria.</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setFilterBy("all")
                        setSortBy("name")
                      }}
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No stadiums available for booking.</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Stadiums must be activated by an administrator before they can be booked.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Payment Modal */}
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogContent className="sm:max-w-md bg-gray-900 text-white">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center text-white">
                <span>Payment for {selectedStadium?.name}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowPaymentModal(false)} 
                  className="text-white hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handlePaymentSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right text-white">
                  Price (GHS/hr)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={paymentData.price}
                  onChange={handleInputChange}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder-white"
                  placeholder="Enter price per hour"
                  required
                  min="1"
                  step="0.01"
                  disabled
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bookingDate" className="text-right text-white">
                  Booking Date
                </Label>
                <Input
                  id="bookingDate"
                  name="bookingDate"
                  type="date"
                  value={paymentData.bookingDate}
                  onChange={handleInputChange}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder-white"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startTime" className="text-right text-white">
                  Start Time
                </Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  value={paymentData.startTime}
                  onChange={handleInputChange}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder-white"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endTime" className="text-right text-white">
                  End Time
                </Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  value={paymentData.endTime}
                  onChange={handleInputChange}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder-white"
                  required
                />
              </div>
              
              {totalAmount > 0 && (
                <div className="grid grid-cols-4 items-center gap-4 bg-gray-800 p-3 rounded-md">
                  <Label className="text-right text-white font-bold">
                    Total Amount:
                  </Label>
                  <div className="col-span-3 text-lg font-bold text-green-400">
                    GHS {totalAmount.toFixed(2)}
                  </div>
                  <div className="col-start-2 col-span-3 text-sm text-gray-400">
                    Based on {((new Date(paymentData.endTime).getTime() - new Date(paymentData.startTime).getTime()) / (1000 * 60 * 60)).toFixed(1)} hours
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transferName" className="text-right text-white">
                  Transfer Name
                </Label>
                <Input
                  id="transferName"
                  name="transferName"
                  value={paymentData.transferName}
                  onChange={handleInputChange}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder-white"
                  placeholder="Enter transfer name"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transferNumber" className="text-right text-white">
                  Transfer Number
                </Label>
                <Input
                  id="transferNumber"
                  name="transferNumber"
                  value={paymentData.transferNumber}
                  onChange={handleInputChange}
                  className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder-white"
                  placeholder="Enter transfer number"
                  required
                />
                <p className="col-start-2 col-span-3 text-xs text-gray-400">
                  Default number: 0242737247
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                disabled={totalAmount <= 0 || loading}
              >
                {loading ? "Processing..." : (totalAmount > 0 ? `Pay GHS ${totalAmount.toFixed(2)}` : 'Confirm Payment')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}