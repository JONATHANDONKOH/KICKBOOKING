"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import BackgroundCarousel from "@/components/BackgroundCarousel"
import { Menu, X, Home, Building2, Phone, UserPlus, LogIn, Calendar, MapPin, Star, Users, Shield, Clock, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

// Snake Animation Component
function SnakeAnimation() {
  return (
    <div className="relative w-full h-2 overflow-hidden bg-gradient-to-r from-green-400 to-emerald-600 rounded-full">
      <div className="snake-light absolute top-0 left-0 w-8 h-full bg-white opacity-50 rounded-full animate-pulse"></div>
    </div>
  )
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const servicesRef = useRef<HTMLElement>(null)
  const stadiumsRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const newsletterRef = useRef<HTMLElement>(null)

  // Scroll progress and effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      
      setScrollProgress(scrollPercent)
      setShowScrollTop(scrollTop > 500)

      // Parallax effect for hero section
      if (heroRef.current) {
        const heroElement = heroRef.current
        const heroRect = heroElement.getBoundingClientRect()
        const heroOffset = heroRect.top
        const parallaxSpeed = 0.5
        
        if (heroOffset < window.innerHeight && heroOffset > -heroElement.offsetHeight) {
          const yPos = -(scrollTop * parallaxSpeed)
          const backgroundElement = heroElement.querySelector('.parallax-bg') as HTMLElement
          if (backgroundElement) {
            backgroundElement.style.transform = `translate3d(0, ${yPos}px, 0)`
          }
        }
      }
    }

    const handleScrollAnimations = () => {
      const elements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-up, .fade-in-up, .fade-in-left, .fade-in-right, .scale-in')
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0
        if (isVisible) {
          element.classList.add('animate', 'in-view')
        } else {
          element.classList.remove('in-view')
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('scroll', handleScrollAnimations, { passive: true })
    
    // Initial check
    handleScroll()
    handleScrollAnimations()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('scroll', handleScrollAnimations)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Stadium data
  const stadiums = [
    {
      id: 'wembley',
      name: 'ACCRA SPORTS STADIUM',
      location: 'James Town',
      price: '₵2,500',
      rating: 4.9,
      image: '/images/wembley.webp',
      capacity: '90,000',
      amenities: ['WiFi', 'Parking', 'Food Court', 'Security'],
      youtube: 'https://www.youtube.com/watch?v=MUliWmSKwiM',
    },
    {
      id: 'emirates',
      name: 'KUMASI SPORTS STADIUM',
      location: 'Tafo',
      price: '₵2,200',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop',
      capacity: '60,704',
      amenities: ['WiFi', 'Parking', 'Food Court', 'Security', 'Floodlights'],
      youtube: 'https://www.youtube.com/watch?v=QQev1qeWsOs',
    },
    {
      id: 'old-trafford',
      name: 'ANGEL STADIUM',
      location: 'Brong Ahafo',
      price: '₵2,800',
      rating: 4.9,
      image: '/images/old trafford.jpg',
      capacity: '74,310',
      amenities: ['WiFi', 'Parking', 'Food Court', 'Security'],
      youtube: 'https://www.youtube.com/results?search_query=old+trafford+stadium',
    },
    {
      id: 'anfield',
      name: 'TNA STADIUM',
      location: 'Tarkwa',
      price: '₵2,400',
      rating: 4.7,
      image: '/images/anfeild.png',
      capacity: '53,394',
      amenities: ['WiFi', 'Parking', 'Security', 'Floodlights'],
      youtube: 'https://www.youtube.com/watch?v=QRzPABLp1-4',
    },
    {
      id: 'stamford-bridge',
      name: 'LORD STADIUM',
      location: 'East Lagon',
      price: '₵2,100',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&h=300&fit=crop',
      capacity: '40,834',
      amenities: ['WiFi', 'Parking', 'Food Court'],
      youtube: 'https://www.youtube.com/watch?v=FIoQrNmFQ-k',
    },
    {
      id: 'etihad',
      name: 'HILLS STADIUM',
      location: 'Tarkoradi',
      price: '₵2,300',
      rating: 4.8,
      image: '/images/ethihad stad.jpg',
      capacity: '55,017',
      amenities: ['WiFi', 'Parking', 'Food Court', 'Security', 'Floodlights'],
      youtube: 'https://www.youtube.com/watch?v=RKqsXvLmIec',
    }
  ]

  const handleBookNow = (stadium: typeof stadiums[0]) => {
    // Store stadium data in localStorage for after login
    localStorage.setItem('selectedStadium', JSON.stringify(stadium))
    localStorage.setItem('intendedAction', 'booking')
    
    // Show message and redirect to login
    alert(`To book ${stadium.name}, please login or create an account first.\n\nLocation: ${stadium.location}\nPrice: ₵${stadium.price.replace(/[^\d.]/g, '')}/day\n\nRedirecting to login page...`)
    
    // Redirect to login page
    window.location.href = '/login'
  }

  const handleViewDetails = (stadium: typeof stadiums[0]) => {
    // Store stadium data for after login
    localStorage.setItem('stadiumDetails', JSON.stringify(stadium))
    localStorage.setItem('intendedAction', 'viewDetails')
    
    // Show stadium details and redirect to signup for new users
    const userChoice = confirm(`${stadium.name} Details:\n\nLocation: ${stadium.location}\nCapacity: ${stadium.capacity}\nRating: ${stadium.rating}/5\nAmenities: ${stadium.amenities.join(', ')}\n\nPrice: ₵${stadium.price.replace(/[^\d.]/g, '')}/day\n\nTo view full details and book, you need an account.\n\nClick OK to Sign Up or Cancel to Login`)
    
    if (userChoice) {
      // User chose to sign up
      window.location.href = '/register'
    } else {
      // User chose to login
      window.location.href = '/login'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900">
      {/* Scroll Progress Indicator */}
      <div 
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`scroll-indicator ${showScrollTop ? 'visible' : ''}`}
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">KB</span>
              </div>
              <span className="text-xl font-bold text-white">Kick Booking</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button onClick={() => scrollToSection(heroRef)} className="flex items-center space-x-2 text-white hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors nav-link">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </button>
                <button onClick={() => scrollToSection(stadiumsRef)} className="flex items-center space-x-2 text-gray-300 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors nav-link">
                  <Building2 className="h-4 w-4" />
                  <span>Stadiums</span>
                </button>
                <Link href="/services" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors nav-link">
                  <Calendar className="h-4 w-4" />
                  <span>Services</span>
                </Link>
                <Link href="/about" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors nav-link">
                  <Users className="h-4 w-4" />
                  <span>About</span>
                </Link>
                <Link href="/contact" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors nav-link">
                  <Phone className="h-4 w-4" />
                  <span>Contact</span>
                </Link>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-green-400 hover:bg-white/10">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-green-400"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => scrollToSection(heroRef)} className="flex items-center space-x-2 text-white hover:text-green-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </button>
              <button onClick={() => scrollToSection(stadiumsRef)} className="flex items-center space-x-2 text-gray-300 hover:text-green-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                <Building2 className="h-4 w-4" />
                <span>Stadiums</span>
              </button>
              <Link href="/services" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 block px-3 py-2 rounded-md text-base font-medium w-full text-left">
                <Calendar className="h-4 w-4" />
                <span>Services</span>
              </Link>
              <Link href="/about" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 block px-3 py-2 rounded-md text-base font-medium">
                <Users className="h-4 w-4" />
                <span>About</span>
              </Link>
              <Link href="/contact" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 block px-3 py-2 rounded-md text-base font-medium">
                <Phone className="h-4 w-4" />
                <span>Contact</span>
              </Link>
              <div className="border-t border-white/10 pt-4 pb-3">
                <div className="flex items-center px-3 space-x-3">
                  <Link href="/login">
                    <Button variant="ghost" className="text-white hover:text-green-400 w-full justify-start">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Carousel Background */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden hero-parallax">
        {/* Background Carousel with Parallax */}
        <div className="absolute inset-0 z-0 parallax-bg">
          <BackgroundCarousel autoPlayInterval={5000} showNavigation={false} />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            KICK BOOKING
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-lg">
            Book premium football stadiums for your matches. Experience the thrill of playing in world-class venues.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg shadow-2xl" onClick={() => scrollToSection(stadiumsRef)}>
              <Building2 className="h-5 w-5 mr-2" />
              Browse Stadiums
            </Button>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-900 px-8 py-4 text-lg shadow-2xl">
                <UserPlus className="h-5 w-5 mr-2" />
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="py-20 bg-gradient-to-r from-green-800 to-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Everything you need for the perfect football experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <Card className="bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/30 transition-all duration-300 card-cascade scroll-stagger-1 scale-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 float-animation">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Stadium Booking</h3>
                <p className="text-gray-300">
                  Book premium stadiums for your matches with flexible scheduling and competitive rates.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/30 transition-all duration-300 card-cascade scroll-stagger-2 scale-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 float-animation" style={{animationDelay: '1s'}}>
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Equipment Rental</h3>
                <p className="text-gray-300">
                  Professional football equipment and gear rental for teams and individual players.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-sm border-white/20 hover:bg-black/30 transition-all duration-300 card-cascade scroll-stagger-3 scale-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 float-animation" style={{animationDelay: '2s'}}>
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">24/7 Support</h3>
                <p className="text-gray-300">
                  Round-the-clock customer support to ensure your booking experience is seamless.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Snake Animation */}
          <div className="fade-in-up">
            <SnakeAnimation />
          </div>
        </div>
      </section>

      {/* Featured Stadiums Section */}
      <section ref={stadiumsRef} className="py-20 bg-gradient-to-r from-slate-900 to-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Stadiums</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Discover world-class football venues available for booking
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stadiums.map((stadium, index) => (
              <Card key={stadium.id} className={`bg-black/20 backdrop-blur-sm border-white/20 overflow-hidden hover:scale-105 transition-all duration-300 group card-cascade scroll-stagger-${(index % 6) + 1} scale-in`}>
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={stadium.image || "/placeholder.svg"}
                    alt={stadium.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{stadium.name}</h3>
                  <p className="text-gray-300 mb-2">{stadium.location}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {stadium.amenities.map((amenity, i) => (
                      <Badge key={i} className="bg-green-700 text-white text-xs">{amenity}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    {/* Removed price tag */}
                    <span className="flex items-center text-yellow-400 font-semibold">
                      <Star className="h-4 w-4 mr-1" />
                      {stadium.rating}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => handleBookNow(stadium)}>
                      Book Now
                    </Button>
                    {stadium.youtube && (
                      <a
                        href={stadium.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full p-3 transition"
                        title={`Watch ${stadium.name} on YouTube`}
                      >
                        <Youtube className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors & Trust Section */}
      <section className="py-20 bg-gradient-to-br from-green-900/80 to-emerald-900/90 section-reveal scroll-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-4xl font-bold text-white mb-4">Our Trusted Sponsors</h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              We are proudly supported by leading organizations in sports and technology. Their partnership ensures that every booking is secure, reliable, and world-class. Join thousands of satisfied customers who trust Kick Booking for their football experiences.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center bg-black/30 rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 fade-in-up scroll-stagger-1">
              <div className="relative w-full h-48 mb-4">
                <Image src="/images/stadiumm2.jpg" alt="Sponsor Stadium 1" fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Global Sports Group</h3>
              <p className="text-gray-300 text-center text-sm">Empowering football communities across Africa and beyond.</p>
            </div>
            <div className="flex flex-col items-center bg-black/30 rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 fade-in-up scroll-stagger-2">
              <div className="relative w-full h-48 mb-4">
                <Image src="/images/stadiummm1.jpg" alt="Sponsor Stadium 2" fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Elite Booking Partners</h3>
              <p className="text-gray-300 text-center text-sm">Delivering seamless, secure, and innovative booking solutions.</p>
            </div>
            <div className="flex flex-col items-center bg-black/30 rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 fade-in-up scroll-stagger-3">
              <div className="relative w-full h-48 mb-4">
                <Image src="/images/stadiummm3.webp" alt="Sponsor Stadium 3" fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Trusted Stadiums Alliance</h3>
              <p className="text-gray-300 text-center text-sm">Your assurance of quality, safety, and unforgettable football moments.</p>
            </div>
          </div>
          <div className="text-center mt-8 fade-in-up scroll-stagger-4">
            <h4 className="text-2xl font-bold text-green-400 mb-2">Why Trust Kick Booking?</h4>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-6">
              Our sponsors and partners are a testament to our commitment to excellence. We use the latest technology and industry best practices to protect your data and guarantee your satisfaction. Book with confidence—your football journey starts here!
            </p>
            <span className="inline-block bg-green-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-green-800 transition">Believe. Book. Play.</span>
          </div>
        </div>
      </section>
      <div className="h-8" />

      {/* FAQ Section (styled as part of sponsorship viewport) */}
      <div className="relative flex justify-center items-center py-12">
        <div className="relative w-full max-w-3xl mx-auto bg-green-700 rounded-3xl shadow-xl px-6 py-10 flex flex-col items-center">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-16 bg-white rounded-full blur-sm opacity-80 z-0" style={{filter: 'blur(16px)'}} />
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-28 h-12 bg-white rounded-full z-10" />
          <h3 className="relative z-20 text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
          <div className="relative z-20 w-full space-y-6">
            <div className="bg-white/90 rounded-xl p-4 shadow flex flex-col">
              <span className="font-semibold text-green-700 mb-2">How do I book a stadium?</span>
              <span className="text-gray-700">Simply browse available stadiums, select your preferred venue and date, then follow the booking prompts. You’ll need to log in or create an account to complete your booking.</span>
            </div>
            <div className="bg-white/90 rounded-xl p-4 shadow flex flex-col">
              <span className="font-semibold text-green-700 mb-2">Is my payment secure?</span>
              <span className="text-gray-700">Yes! We use industry-standard encryption and work with trusted payment partners to keep your transactions safe.</span>
            </div>
            <div className="bg-white/90 rounded-xl p-4 shadow flex flex-col">
              <span className="font-semibold text-green-700 mb-2">Can I cancel or reschedule my booking?</span>
              <span className="text-gray-700">Absolutely. You can manage your bookings from your dashboard. Please check our cancellation policy for details.</span>
            </div>
            <div className="bg-white/90 rounded-xl p-4 shadow flex flex-col">
              <span className="font-semibold text-green-700 mb-2">Who do I contact for support?</span>
              <span className="text-gray-700">Our support team is available 24/7. Reach out via the contact page or email info@kickbooking.com.</span>
            </div>
          </div>
        </div>
      </div>
      {/* Scoring image and animated slogan */}
      <div className="relative flex flex-col items-center justify-center mt-8 mb-8">
        <div className="w-full max-w-3xl h-[40vh] rounded-3xl overflow-hidden shadow-lg border-4 border-green-700 bg-green-700 flex items-center justify-center">
          <Image src="/images/scoring.jpg" alt="Scoring Celebration" fill className="object-cover" style={{objectPosition: 'center'}} />
        </div>
        {/* Animated Slogan Escalator */}
        <div className="relative w-full max-w-3xl h-16 mt-4 overflow-hidden">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-extrabold text-white whitespace-nowrap animate-escalator">
            KickBooking: Score Your Dream, Book Your Game!
          </span>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/90 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="fade-in-up">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">KB</span>
                </div>
                <span className="text-xl font-bold">Kick Booking</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your premier destination for booking world-class football stadiums.
              </p>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
                <Youtube className="h-5 w-5 text-gray-400 hover:text-green-400 cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div className="fade-in-up scroll-stagger-1">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection(stadiumsRef)} className="text-gray-400 hover:text-green-400 footer-link">Browse Stadiums</button></li>
                <li><button onClick={() => scrollToSection(servicesRef)} className="text-gray-400 hover:text-green-400 footer-link">Our Services</button></li>
                <li><Link href="/about" className="text-gray-400 hover:text-green-400 footer-link">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-green-400 footer-link">Contact</Link></li>
              </ul>
            </div>
            
            <div className="fade-in-up scroll-stagger-2">
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-400 hover:text-green-400 footer-link">Help Center</Link></li>
                <li><Link href="/booking-guide" className="text-gray-400 hover:text-green-400 footer-link">Booking Guide</Link></li>
                <li><Link href="/cancellation" className="text-gray-400 hover:text-green-400 footer-link">Cancellation Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-green-400 footer-link">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div className="fade-in-up scroll-stagger-3">
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 info@kickbooking.com</p>
                <p>📞 0240538361</p>
                <p>📍 Ghana, Accra</p>
              </div>
            </div>
          </div>
          
          {/* Snake Animation in Footer */}
          <div className="mb-8 fade-in-up">
            <SnakeAnimation />
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center fade-in-up">
            <p className="text-gray-400">
              © 2024 Kick Booking. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
