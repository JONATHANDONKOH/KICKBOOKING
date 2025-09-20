"use client"

import { useData } from "@/context/DataContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DataDebug() {
  const { bookings, refreshData } = useData()

  const handleShowLocalStorage = () => {
    const appBookings = localStorage.getItem("app-bookings")
    const userBookings = localStorage.getItem("user-bookings")

    console.log("=== DEBUG INFO ===")
    console.log("Context bookings:", bookings)
    console.log("localStorage app-bookings:", appBookings ? JSON.parse(appBookings) : "empty")
    console.log("localStorage user-bookings:", userBookings ? JSON.parse(userBookings) : "empty")
    console.log("==================")
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-sm text-blue-900">Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-blue-800">
            <p>Bookings in context: {bookings.length}</p>
            <p>Pending: {bookings.filter((b) => b.status === "pending").length}</p>
          </div>
          <div className="space-x-2">
            <Button size="sm" variant="outline" onClick={handleShowLocalStorage}>
              Check Console
            </Button>
            <Button size="sm" onClick={refreshData}>
              Force Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
