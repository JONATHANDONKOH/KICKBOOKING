"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Users, Star, Wifi, Car, Utensils, Shield, Zap, X } from "lucide-react"
import Image from "next/image"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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
  isActive?: boolean // Make isActive optional for compatibility
}

interface StadiumCardProps {
  stadium: Stadium
  onBook?: (stadium: Stadium) => void
  showBookButton?: boolean
}

const amenityIcons: { [key: string]: any } = {
  WiFi: Wifi,
  Parking: Car,
  "Food Court": Utensils,
  Security: Shield,
  Floodlights: Zap,
}

export default function StadiumCard({ stadium, onBook, showBookButton = true }: StadiumCardProps) {
  const imageUrl = stadium.imageUrl // Use only the passed imageUrl
  const { bookings } = useData()
  const { user } = useAuth()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState({
    price: stadium.pricePerHour,
    startTime: "",
    endTime: "",
    transferName: "",
    transferNumber: "0240528361"
  })

  // Check if current user has a confirmed booking for this stadium
  const userHasConfirmedBooking = bookings.some(
    (b) => b.stadiumId === stadium.id && b.userId === user?.id && b.status === "confirmed"
  )

  const handleBookClick = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle payment submission logic here
    console.log("Payment data:", paymentData)
    // Close modal after submission
    setShowPaymentModal(false)
    // Call the original onBook function if provided
    if (onBook) {
      onBook(stadium)
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
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border border-gray-200">
        {/* Stadium Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={stadium.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 right-4">
            <Badge
              variant={
                stadium.availability === "Available"
                  ? "default"
                  : stadium.availability === "Booked"
                    ? "destructive"
                    : "secondary"
              }
              className={`${
                stadium.availability === "Available"
                  ? "bg-green-500 hover:bg-green-600"
                  : stadium.availability === "Booked"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-500 hover:bg-gray-600"
              } text-white font-medium`}
            >
              {stadium.availability}
            </Badge>
          </div>
          <div className="absolute top-4 left-4">
            <div className="flex items-center bg-black/70 text-white px-2 py-1 rounded-full text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{stadium.rating}</span>
            </div>
          </div>
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-gray-900 mb-1">{stadium.name}</CardTitle>
              <CardDescription className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {stadium.location}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{stadium.capacity.toLocaleString()} capacity</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-green-600">${stadium.pricePerHour}</span>
              <span className="text-gray-500">/hour</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Description */}
          {stadium.description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{stadium.description}</p>}

          {/* Amenities */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {stadium.amenities.slice(0, 4).map((amenity) => {
                const IconComponent = amenityIcons[amenity]
                return (
                  <div
                    key={amenity}
                    className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                  >
                    {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                    <span>{amenity}</span>
                  </div>
                )
              })}
              {stadium.amenities.length > 4 && (
                <div className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                  <span>+{stadium.amenities.length - 4} more</span>
                </div>
              )}
            </div>
          </div>

          {/* Book Button */}
          {showBookButton && (
            <Button
              onClick={handleBookClick}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold transition-all duration-300"
              disabled={stadium.availability !== "Available" || userHasConfirmedBooking}
            >
              {userHasConfirmedBooking
                ? "Booked"
                : stadium.availability === "Available"
                  ? "Book Now"
                  : stadium.availability === "Booked"
                    ? "Currently Booked"
                    : "Unavailable"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md bg-gray-900 text-white">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center text-white">
              <span>Payment for {stadium.name}</span>
              <Button variant="ghost" size="icon" onClick={() => setShowPaymentModal(false)} className="text-white hover:bg-gray-800">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handlePaymentSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right text-white">
                Price ($)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={paymentData.price}
                onChange={handleInputChange}
                className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder-white"
                placeholder="Enter price"
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
                placeholder="Select start time"
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
                placeholder="Select end time"
                required
              />
            </div>
            
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
            </div>
            
            <Button type="submit" className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
              Confirm Payment
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}