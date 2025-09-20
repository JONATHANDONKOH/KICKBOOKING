"use client"

import type React from "react"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
import ProtectedRoute from "@/components/ProtectedRoute"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Building2, Calendar, CheckCircle, Clock, DollarSign, TrendingUp, Users } from "lucide-react"
import { useData } from "@/context/DataContext"
import { useAuth } from "@/context/AuthContext"

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { stadiums, bookings, users, refreshData } = useData()

  /* ----------------------------------------------------------------------- */
  /*  Data is now managed in-memory and automatically synchronized           */
  /*  through React's state management, so no refresh is needed              */
  /* ----------------------------------------------------------------------- */

  /* ----------------------------------------------------------------------- */
  /*  Derived statistics                                                     */
  /* ----------------------------------------------------------------------- */
  const stats = useMemo(() => {
    const totalStadiums = stadiums.length
    const activeStadiums = stadiums.filter((s) => s.isActive).length
    const inactiveStadiums = totalStadiums - activeStadiums

    const totalBookings = bookings.length
    const pendingBookings = bookings.filter((b) => b.status === "pending").length
    const totalRevenue = bookings.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + b.totalPrice, 0)

    const activeUsers = users.filter((u) => u.status === "active").length
    const monthlyGrowth = totalBookings > 0 ? 15.2 : 0 // placeholder growth calc

    return {
      totalStadiums,
      activeStadiums,
      inactiveStadiums,
      totalBookings,
      pendingBookings,
      totalRevenue,
      activeUsers,
      monthlyGrowth,
    }
  }, [stadiums, bookings, users])

  const recentBookings = bookings
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  /* ----------------------------------------------------------------------- */
  /*  Render                                                                 */
  /* ----------------------------------------------------------------------- */
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden text-black">
          {/* ──────────────────────────  HEADER  ──────────────────────────── */}
          <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-white/20 px-4 lg:px-6 py-4">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-sm lg:text-base text-slate-600 mt-1">Welcome back, {user?.name ?? "Admin"}!</p>
          </header>

          {/* ──────────────────────────  BODY  ────────────────────────────── */}
          <div className="flex-1 overflow-hidden p-4 lg:p-6">
            <div className="max-w-7xl mx-auto h-full flex flex-col space-y-6">
              {/* ───────────  STAT CARDS  ─────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {/* Stadiums */}
                <StatCard
                  title="Total Stadiums"
                  icon={<Building2 className="h-4 w-4 text-blue-600" />}
                  color="blue"
                  main={stats.totalStadiums}
                  subtitle={`${stats.activeStadiums} active, ${stats.inactiveStadiums} inactive`}
                  progress={stats.totalStadiums ? (stats.activeStadiums / stats.totalStadiums) * 100 : 0}
                />
                {/* Bookings */}
                <StatCard
                  title="Total Bookings"
                  icon={<Calendar className="h-4 w-4 text-green-600" />}
                  color="green"
                  main={stats.totalBookings}
                  subtitle={`${stats.pendingBookings} pending`}
                  trend={`+${stats.monthlyGrowth}%`}
                />
                {/* Revenue */}
                <StatCard
                  title="Total Revenue"
                  icon={<DollarSign className="h-4 w-4 text-purple-600" />}
                  color="purple"
                  main={`$${stats.totalRevenue.toLocaleString()}`}
                  subtitle="From confirmed bookings"
                />
                {/* Users */}
                <StatCard
                  title="Active Users"
                  icon={<Users className="h-4 w-4 text-orange-600" />}
                  color="orange"
                  main={stats.activeUsers}
                  subtitle={`Total users: ${users.length}`}
                  progress={users.length ? (stats.activeUsers / users.length) * 100 : 0}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
                {/* ───────────  PENDING BOOKINGS  ─────────── */}
                <Card className="bg-white/60 backdrop-blur-sm border-white/40 flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-yellow-600" />
                      Pending Bookings
                    </CardTitle>
                    <CardDescription>Bookings awaiting approval</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full px-6">
                      <div className="py-2 space-y-3">
                        {stats.pendingBookings === 0 ? (
                          <EmptyState
                            icon={<CheckCircle className="h-10 w-10 text-green-500" />}
                            message="No pending requests"
                          />
                        ) : (
                          recentBookings
                            .filter((b) => b.status === "pending")
                            .map((b) => <BookingRow key={b.id} booking={b} />)
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* ───────────  RECENT ACTIVITY  ─────────── */}
                <Card className="bg-white/60 backdrop-blur-sm border-white/40 flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-blue-600" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest booking requests</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full px-6">
                      <div className="py-2 space-y-3">
                        {recentBookings.length === 0 ? (
                          <EmptyState icon={<Activity className="h-10 w-10 text-gray-400" />} message="No recent activity" />
                        ) : (
                          recentBookings.map((b) => <BookingRow key={b.id} booking={b} />)
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

/* =============================================================================
 *  Reusable sub-components
 * ========================================================================== */
interface StatCardProps {
  title: string
  icon: React.ReactNode
  color: "blue" | "green" | "purple" | "orange"
  main: number | string
  subtitle?: string
  trend?: string
  progress?: number
}

function StatCard({ title, icon, color, main, subtitle, trend, progress }: StatCardProps) {
  const barColor = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
  }[color]

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-white/40 hover:shadow-md transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{main}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend && (
          <p className="flex items-center mt-2 text-xs text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend}
          </p>
        )}
        {progress !== undefined && (
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className={`${barColor} h-full`} style={{ width: `${progress}%` }} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {icon}
      <p className="mt-2 text-sm text-gray-500">{message}</p>
    </div>
  )
}

function BookingRow({ booking }: { booking: ReturnType<typeof useData>["bookings"][0] }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{booking.stadiumName}</p>
        <p className="text-xs text-gray-600 truncate">
          {booking.userName} • {booking.date} • ${booking.totalPrice}
        </p>
      </div>
      <Badge
        variant={
          booking.status === "confirmed" ? "default" : booking.status === "pending" ? "secondary" : "destructive"
        }
        className="ml-2 flex-shrink-0"
      >
        {booking.status}
      </Badge>
    </div>
  )
}