"use client"

import { useEffect } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Sidebar from "@/components/Sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Calendar, DollarSign, TrendingUp, Users, Download, FileText } from "lucide-react"
import { useData } from "@/context/DataContext"

export default function ReportsPage() {
  const { stadiums, bookings, users, stats, refreshData } = useData()

  // Data is now managed in-memory and automatically synchronized
  // through React's state management, so no refresh is needed on mount

  // Calculate monthly revenue data
  const getMonthlyRevenueData = () => {
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed")
    if (confirmedBookings.length === 0) return []

    const monthlyData: { [key: string]: number } = {}

    confirmedBookings.forEach((booking) => {
      const date = new Date(booking.createdAt)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + Number(booking.totalPrice || 0)
    })

    return Object.entries(monthlyData)
      .map(([month, revenue]) => ({
        month,
        revenue: Number(revenue) || 0,
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6) // Last 6 months
  }

  // Calculate booking status distribution
  const getBookingStatusData = () => {
    if (bookings.length === 0) return []

    const statusCounts = bookings.reduce(
      (acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1
        return acc
      },
      {} as { [key: string]: number },
    )

    return Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count: Number(count) || 0,
      percentage: Math.round((Number(count) / bookings.length) * 100) || 0,
    }))
  }

  // Calculate stadium performance data
  const getStadiumPerformanceData = () => {
    if (stadiums.length === 0 || bookings.length === 0) return []

    const stadiumStats = stadiums.map((stadium) => {
      const stadiumBookings = bookings.filter((b) => b.stadiumId === stadium.id)
      const confirmedBookings = stadiumBookings.filter((b) => b.status === "confirmed")
      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0)

      return {
        name: stadium.name,
        bookings: stadiumBookings.length,
        revenue: totalRevenue,
        rating: Number(stadium.rating) || 0,
      }
    })

    return stadiumStats.sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }

  // Calculate weekly booking trends
  const getWeeklyBookingData = () => {
    if (bookings.length === 0) return []

    const weeklyData: { [key: string]: number } = {}
    const now = new Date()

    // Get last 7 weeks
    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - i * 7)
      const weekKey = `Week ${7 - i}`
      weeklyData[weekKey] = 0
    }

    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.createdAt)
      const daysDiff = Math.floor((now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24))
      const weekIndex = Math.floor(daysDiff / 7)

      if (weekIndex >= 0 && weekIndex < 7) {
        const weekKey = `Week ${7 - weekIndex}`
        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + 1
      }
    })

    return Object.entries(weeklyData).map(([week, count]) => ({
      week,
      bookings: Number(count) || 0,
    }))
  }

  const monthlyRevenueData = getMonthlyRevenueData()
  const bookingStatusData = getBookingStatusData()
  const stadiumPerformanceData = getStadiumPerformanceData()
  const weeklyBookingData = getWeeklyBookingData()

  const hasMonthlyData = monthlyRevenueData.length > 0
  const hasStatusData = bookingStatusData.length > 0
  const hasPerformanceData = stadiumPerformanceData.length > 0
  const hasWeeklyData = weeklyBookingData.length > 0

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const exportToCSV = () => {
    const csvData = [
      ["Report Type", "Stadium Booking Analytics"],
      ["Generated On", new Date().toLocaleDateString()],
      [""],
      ["Summary Statistics"],
      ["Total Stadiums", stats.totalStadiums],
      ["Active Stadiums", stats.activeStadiums],
      ["Total Bookings", stats.totalBookings],
      ["Total Revenue", `$${stats.totalRevenue.toLocaleString()}`],
      ["Active Users", stats.activeUsers],
      ["Pending Requests", stats.pendingRequests],
      [""],
      ["Stadium Performance"],
      ["Stadium Name", "Total Bookings", "Revenue", "Rating"],
      ...stadiumPerformanceData.map((s) => [s.name, s.bookings, `$${s.revenue}`, s.rating]),
      [""],
      ["Booking Status Distribution"],
      ["Status", "Count", "Percentage"],
      ...bookingStatusData.map((s) => [s.status, s.count, `${s.percentage}%`]),
    ]

    const csvContent = csvData.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `stadium-booking-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden text-black">
          {/* Header */}
          <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Analytics & Reports
                </h1>
                <p className="text-slate-600 mt-1 text-sm lg:text-base">
                  Comprehensive insights into your stadium booking business
                </p>
              </div>
              <Button onClick={exportToCSV} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <ScrollArea className="flex-1 p-4 lg:p-6">
            <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+{stats.monthlyGrowth}% from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
                    <p className="text-xs text-muted-foreground">{stats.pendingRequests} pending approval</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">{stats.activeUsers}</div>
                    <p className="text-xs text-muted-foreground">{users.length} total registered</p>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stadium Utilization</CardTitle>
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {stats.totalStadiums > 0 ? Math.round((stats.activeStadiums / stats.totalStadiums) * 100) : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats.activeStadiums} of {stats.totalStadiums} active
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <Tabs defaultValue="revenue" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
                  <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
                  <TabsTrigger value="bookings">Booking Analytics</TabsTrigger>
                  <TabsTrigger value="stadiums">Stadium Performance</TabsTrigger>
                  <TabsTrigger value="status">Status Distribution</TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-4">
                  <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                    <CardHeader>
                      <CardTitle>Monthly Revenue Trends</CardTitle>
                      <CardDescription>Revenue generated over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {hasMonthlyData ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={monthlyRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]} />
                            <Line
                              type="monotone"
                              dataKey="revenue"
                              stroke="#8884d8"
                              strokeWidth={2}
                              dot={{ fill: "#8884d8" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No revenue data available yet</p>
                            <p className="text-sm">Revenue will appear once bookings are confirmed</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="bookings" className="space-y-4">
                  <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                    <CardHeader>
                      <CardTitle>Weekly Booking Trends</CardTitle>
                      <CardDescription>Number of bookings made each week</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {hasWeeklyData ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={weeklyBookingData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="week" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="bookings" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No booking data available yet</p>
                            <p className="text-sm">Booking trends will appear once users start booking</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="stadiums" className="space-y-4">
                  <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                    <CardHeader>
                      <CardTitle>Top Performing Stadiums</CardTitle>
                      <CardDescription>Revenue and booking performance by stadium</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {hasPerformanceData ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={stadiumPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value, name) => [
                                name === "revenue" ? `$${Number(value).toLocaleString()}` : value,
                                name === "revenue" ? "Revenue" : "Bookings",
                              ]}
                            />
                            <Bar dataKey="revenue" fill="#8884d8" />
                            <Bar dataKey="bookings" fill="#82ca9d" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-500">
                          <div className="text-center">
                            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No stadium performance data available</p>
                            <p className="text-sm">Add stadiums and bookings to see performance metrics</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="status" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                      <CardHeader>
                        <CardTitle>Booking Status Distribution</CardTitle>
                        <CardDescription>Breakdown of booking statuses</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {hasStatusData ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={bookingStatusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ status, percentage }) => `${status} (${percentage}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                              >
                                {bookingStatusData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-[300px] flex items-center justify-center text-gray-500">
                            <div className="text-center">
                              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No booking status data available</p>
                              <p className="text-sm">Status distribution will appear once bookings are made</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                      <CardHeader>
                        <CardTitle>Status Summary</CardTitle>
                        <CardDescription>Detailed breakdown of booking statuses</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {hasStatusData ? (
                            bookingStatusData.map((item, index) => (
                              <div key={item.status} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                  />
                                  <span className="font-medium">{item.status}</span>
                                </div>
                                <div className="text-right">
                                  <Badge variant="secondary">{item.count} bookings</Badge>
                                  <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <p>No status data to display</p>
                              <p className="text-sm">Create some bookings to see status breakdown</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </div>
      </div>
    </ProtectedRoute>
  )
}
