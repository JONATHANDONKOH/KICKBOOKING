"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"

// Interface for stadium data passed to the modal
interface Stadium {
  id: string
  name: string
  pricePerHour: number
}

// Props interface for the BookingModal component
interface BookingModalProps {
  stadium: Stadium
  isOpen: boolean
  onClose: () => void
}

/**
 * BookingModal Component
 *
 * A modal dialog for booking a stadium with the following features:
 * - Date and time selection (no restrictions - any date/time allowed)
 * - Duration calculation and price estimation
 * - Optional notes field
 * - Form validation and submission
 * - Integration with data context and localStorage
 */
export default function BookingModal({ stadium, isOpen, onClose }: BookingModalProps) {
  // Form state for booking details
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  })

  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hooks for toast notifications, data management, and authentication
  const { toast } = useToast()
  const { addBooking } = useData()
  const { user } = useAuth()

  /**
   * Calculates the duration between start and end times
   * @returns Duration in hours (decimal format)
   */
  const calculateDuration = () => {
    // Return 0 if either time is missing
    if (!formData.startTime || !formData.endTime) return 0

    // Create Date objects for time comparison (using arbitrary date)
    const start = new Date(`2000-01-01T${formData.startTime}`)
    const end = new Date(`2000-01-01T${formData.endTime}`)

    // Ensure end time is after start time
    if (end <= start) return 0

    // Calculate duration in hours
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  }

  // Calculate duration and total price for display
  const duration = calculateDuration()
  const totalPrice = duration * stadium.pricePerHour

  /**
   * Handles form submission and booking creation
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create new booking object with all necessary data
      const newBooking = {
        id: Date.now().toString(),
        stadiumId: stadium.id,
        stadiumName: stadium.name,
        userId: user?.id || "1",
        userName: user?.name || "John Doe",
        userEmail: user?.email || "user@example.com",
        date: formData.date,
        time: `${formData.startTime}-${formData.endTime}`,
        duration,
        totalPrice,
        status: "pending" as "pending",
        notes: formData.notes,
        createdAt: new Date().toISOString(),
      }
      console.log("Creating booking with userId:", newBooking.userId, "userName:", newBooking.userName)

      // Add booking to centralized data context
      addBooking(newBooking)

      // localStorage removed: bookings are now managed only in context

      // Dispatch custom events to notify other components of data changes
      window.dispatchEvent(new CustomEvent("dataUpdated"))
      // Removed StorageEvent dispatch as localStorage is no longer used

      // Show success notification
      toast({
        title: "Booking Submitted!",
        description: "Your booking request has been submitted and is pending approval.",
      })

      // Reset form and close modal
      setFormData({ date: "", startTime: "", endTime: "", notes: "" })
      onClose()
    } catch (error) {
      // Show error notification if submission fails
      toast({
        title: "Error",
        description: "An error occurred while submitting your booking request.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book {stadium.name}</DialogTitle>
          <DialogDescription>Please select a date, time, and duration for your booking.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label>Duration: {duration.toFixed(2)} hours</Label>
              <Label>Total Price: ${totalPrice.toFixed(2)}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
