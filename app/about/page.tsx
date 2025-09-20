"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Zap, Shield, Clock, Star, CheckCircle, Target, Heart } from "lucide-react"

export default function AboutPage() {
  const router = useRouter()
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Booking",
      description: "Book your stadium in seconds with our streamlined booking system",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Payments",
      description: "Your transactions are protected with bank-level security",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your needs",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Premium Quality",
      description: "Only the finest stadiums with top-notch facilities",
    },
  ]
  const stats = [
    { number: "50+", label: "Premium Stadiums", icon: <CheckCircle className="h-8 w-8" /> },
    { number: "1000+", label: "Happy Customers", icon: <Heart className="h-8 w-8" /> },
    { number: "5000+", label: "Matches Hosted", icon: <Target className="h-8 w-8" /> },
    { number: "99.9%", label: "Uptime", icon: <CheckCircle className="h-8 w-8" /> },
  ]
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/20 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <h1 className="text-2xl font-bold text-white">
              Kick<span className="text-green-500">Booking</span>
            </h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/")} className="text-white hover:text-green-400 transition-colors">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">About KickBooking</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Revolutionizing Stadium
            <span className="block text-green-600">Booking Experience</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're passionate about making premium stadium booking accessible, reliable, and enjoyable for everyone. From
            amateur teams to professional leagues, we provide the platform that connects you with the perfect venue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push("/register")}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              Explore Stadiums
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/contact")}
              className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3"
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-green-600">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features List */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-4 bg-white rounded-lg shadow p-6">
              <div className="text-green-600">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
