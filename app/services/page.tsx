"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import {
  MapPin,
  Calendar,
  Users,
  Activity,
  CheckCircle,
  Clock,
  Shield,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react"

/**
 * Services Page - Comprehensive information about all KickBooking services
 * This page provides detailed explanations of each service offered by the platform
 */
export default function ServicesPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Handle navigation based on authentication status
  const handleGetStarted = (redirectPath: string) => {
    if (user) {
      router.push(redirectPath)
    } else {
      router.push("/register")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/20 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-white">
                Kick<span className="text-green-500">Booking</span>
              </h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-white hover:text-green-400 transition-colors">
                Back to Home
              </Link>
              {user ? (
                <Button
                  onClick={() => router.push(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard")}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Dashboard
                </Button>
              ) : (
                <Button onClick={() => router.push("/login")} className="bg-green-600 hover:bg-green-700 text-white">
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-green-500">Services</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Discover comprehensive stadium booking solutions designed to make your sports experience seamless and
            enjoyable
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="text-green-400 border-green-400">
              Professional Grade
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              24/7 Support
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              Instant Booking
            </Badge>
          </div>
        </div>
      </section>

      {/* Book Stadium Service */}
      <section id="book-stadium" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#1E1E1E" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <MapPin className="w-12 h-12 text-green-500 mr-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">Book Stadium</h2>
              </div>
              <p className="text-lg text-gray-300 mb-8">
                Experience the easiest way to book premium football stadiums. Our comprehensive booking system puts the
                power in your hands with real-time availability, instant confirmations, and flexible options.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Real-Time Availability</h4>
                    <p className="text-gray-400 text-sm">
                      Check live stadium availability and book instantly without waiting
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Secure Payments</h4>
                    <p className="text-gray-400 text-sm">Protected transactions with multiple payment options</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Flexible Timing</h4>
                    <p className="text-gray-400 text-sm">Book for matches, training, tournaments, or special events</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-2">Premium Venues</h4>
                    <p className="text-gray-400 text-sm">Access to top-rated stadiums with professional facilities</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleGetStarted("/stadiums")}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                Start Booking <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <Card className="bg-black/50 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-white">How It Works</CardTitle>
                <CardDescription className="text-gray-400">Simple 4-step booking process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Browse Stadiums</h5>
                    <p className="text-gray-400 text-sm">Explore our collection of premium venues</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Select Date & Time</h5>
                    <p className="text-gray-400 text-sm">Choose your preferred slot from available options</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Confirm Details</h5>
                    <p className="text-gray-400 text-sm">Review booking information and team details</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    4
                  </div>
                  <div>
                    <h5 className="font-semibold text-white">Pay & Play</h5>
                    <p className="text-gray-400 text-sm">Secure payment and instant confirmation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* View Schedules Service */}
      <section id="view-schedules" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Card className="bg-black/50 border-green-500/30 order-2 lg:order-1">
              <CardHeader>
                <CardTitle className="text-white">Dashboard Features</CardTitle>
                <CardDescription className="text-gray-400">Everything you need in one place</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-600/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">15+</div>
                    <div className="text-gray-400 text-sm">Booking Views</div>
                  </div>
                  <div className="text-center p-4 bg-green-600/10 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">24/7</div>
                    <div className="text-gray-400 text-sm">Access</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-white">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Calendar integration with Google & Outlook
                  </div>
                  <div className="flex items-center text-white">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Smart notifications and reminders
                  </div>
                  <div className="flex items-center text-white">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Team scheduling coordination
                  </div>
                  <div className="flex items-center text-white">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    Booking history and analytics
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <Calendar className="w-12 h-12 text-green-500 mr-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">View Schedules</h2>
              </div>
              <p className="text-lg text-gray-300 mb-8">
                Stay organized with our powerful scheduling dashboard. Manage all your bookings, track upcoming matches,
                and never miss an important game with our intelligent reminder system.
              </p>

              <div className="space-y-4 mb-8">
                <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-white mb-2">Smart Calendar Integration</h4>
                  <p className="text-gray-400 text-sm">
                    Sync with your existing calendars and get reminders across all your devices
                  </p>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-white mb-2">Team Coordination</h4>
                  <p className="text-gray-400 text-sm">
                    Share schedules with team members and coordinate practice sessions
                  </p>
                </div>
                <div className="bg-black/30 p-4 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-white mb-2">Usage Analytics</h4>
                  <p className="text-gray-400 text-sm">Track your booking patterns and optimize your stadium usage</p>
                </div>
              </div>

              <Button
                onClick={() => handleGetStarted("/user/dashboard")}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                View Dashboard <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Manage Teams Service */}
      <section id="manage-teams" className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#1E1E1E" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Users className="w-12 h-12 text-green-500 mr-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">Manage Teams</h2>
              </div>
              <p className="text-lg text-gray-300 mb-8">
                Build and manage your teams with comprehensive tools designed for coaches, team managers, and players.
                Keep everyone connected and organized.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-black/30 p-6 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-white mb-3">Player Management</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• Add unlimited team members</li>
                    <li>• Track player statistics</li>
                    <li>• Manage contact information</li>
                    <li>• Role assignments</li>
                  </ul>
                </div>
                <div className="bg-black/30 p-6 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-white mb-3">Team Communication</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• Built-in messaging system</li>
                    <li>• Announcement broadcasts</li>
                    <li>• Event notifications</li>
                    <li>• Group discussions</li>
                  </ul>
                </div>
                <div className="bg-black/30 p-6 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-white mb-3">Performance Tracking</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• Match statistics</li>
                    <li>• Training attendance</li>
                    <li>• Performance metrics</li>
                    <li>• Progress reports</li>
                  </ul>
                </div>
                <div className="bg-black/30 p-6 rounded-lg border border-green-500/20">
                  <h4 className="font-semibold text-white mb-3">Multi-Team Support</h4>
                  <ul className="space-y-2 text-gray-400 text-sm">
                    <li>• Manage multiple teams</li>
                    <li>• Cross-team tournaments</li>
                    <li>• Shared resources</li>
                    <li>• League management</li>
                  </ul>
                </div>
              </div>

              <Button
                onClick={() => handleGetStarted("/user/profile")}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                Manage Teams <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="space-y-6">
              <Card className="bg-black/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Team Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">25</div>
                      <div className="text-gray-400 text-sm">Active Players</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">12</div>
                      <div className="text-gray-400 text-sm">Matches Won</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">89%</div>
                      <div className="text-gray-400 text-sm">Attendance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-300">New player John Doe added to Team A</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-300">Training session scheduled for tomorrow</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-300">Match result updated: Team A vs Team B</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Track Activities Service */}
      <section id="track-activities" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <Card className="bg-black/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Analytics Dashboard</CardTitle>
                  <CardDescription className="text-gray-400">Comprehensive insights at your fingertips</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Bookings</span>
                      <span className="text-green-400 font-bold">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Spent</span>
                      <span className="text-green-400 font-bold">$2,340</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Favorite Stadium</span>
                      <span className="text-green-400 font-bold">Arena Central</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Hours Played</span>
                      <span className="text-green-400 font-bold">156h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full text-white border-green-500/30 hover:bg-green-500/10 bg-transparent"
                  >
                    Export to PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-white border-green-500/30 hover:bg-green-500/10 bg-transparent"
                  >
                    Export to Excel
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-white border-green-500/30 hover:bg-green-500/10 bg-transparent"
                  >
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <Activity className="w-12 h-12 text-green-500 mr-4" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">Track Activities</h2>
              </div>
              <p className="text-lg text-gray-300 mb-8">
                Get detailed insights into your booking patterns, spending habits, and team performance. Make
                data-driven decisions with comprehensive analytics and reporting tools.
              </p>

              <div className="space-y-6 mb-8">
                <div>
                  <h4 className="font-semibold text-white mb-4">Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="text-white font-medium">Spending Analysis</h5>
                        <p className="text-gray-400 text-sm">Track your booking expenses and budget planning</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="text-white font-medium">Usage Patterns</h5>
                        <p className="text-gray-400 text-sm">Understand your booking frequency and preferences</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="text-white font-medium">Performance Metrics</h5>
                        <p className="text-gray-400 text-sm">Team and individual performance tracking</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h5 className="text-white font-medium">Custom Reports</h5>
                        <p className="text-gray-400 text-sm">Generate detailed reports for any time period</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => handleGetStarted("/user/my-bookings")}
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
              >
                View Analytics <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#1E1E1E" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Need Help Getting Started?</h2>
          <p className="text-lg text-gray-300 mb-12">
            Our support team is here to help you make the most of KickBooking's features
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-black/50 border-green-500/30">
              <CardContent className="p-6 text-center">
                <Phone className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-400 text-sm mb-4">Speak directly with our experts</p>
                <p className="text-green-400 font-medium">+1 (555) 123-4567</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-green-500/30">
              <CardContent className="p-6 text-center">
                <Mail className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Email Support</h3>
                <p className="text-gray-400 text-sm mb-4">Get detailed help via email</p>
                <p className="text-green-400 font-medium">support@kickbooking.com</p>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border-green-500/30">
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-white font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-400 text-sm mb-4">Instant help when you need it</p>
                <p className="text-green-400 font-medium">Available 24/7</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => handleGetStarted("/stadiums")}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Get Started Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-500/30 text-white hover:bg-green-500/10 px-8 py-3 bg-transparent"
              onClick={() => router.push("/contact")}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
