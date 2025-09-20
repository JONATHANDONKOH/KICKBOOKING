"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, MessageSquare, Headphones, Globe } from "lucide-react"

export default function ContactPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 123-4568"],
      description: "Mon-Fri 9AM-6PM EST",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["info@kickbooking.com", "support@kickbooking.com"],
      description: "We'll respond within 24 hours",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Address",
      details: ["Ghana, Accra"],
      description: "Visit our headquarters",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Business Hours",
      details: ["Mon-Fri: 9AM-6PM EST", "Sat-Sun: 10AM-4PM EST"],
      description: "24/7 emergency support available",
    },
  ]

  const supportOptions = [
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      available: true,
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Phone Support",
      description: "Speak directly with our experts",
      action: "Call Now",
      available: true,
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email Support",
      description: "Send us a detailed message",
      action: "Send Email",
      available: true,
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Help Center",
      description: "Browse our comprehensive FAQ",
      action: "Visit FAQ",
      available: true,
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      })
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "general",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
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
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Contact <span className="text-green-500">Us</span>
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto mb-8">
            Reach out for support, inquiries, or partnership opportunities
          </p>
        </div>
      </section>
      {/* Contact Info Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#1E1E1E' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-gray-900 border-gray-700 text-white">
                <CardHeader>
                  <div className="flex justify-center mb-4 text-green-400">{info.icon}</div>
                  <CardTitle className="text-lg text-white">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="font-medium mb-1 text-white">
                      {detail}
                    </p>
                  ))}
                  <p className="text-gray-300 text-sm mt-2">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Contact Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-700 text-white">
          <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-white">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3 bg-gray-800 border-gray-700 text-white" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-white">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="col-span-3 bg-gray-800 border-gray-700 text-white" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right text-white">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="col-span-3 bg-gray-800 border-gray-700 text-white" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right text-white">Subject</Label>
              <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className="col-span-3 bg-gray-800 border-gray-700 text-white" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="inquiryType" className="text-right text-white">Inquiry Type</Label>
              <select id="inquiryType" name="inquiryType" value={formData.inquiryType} onChange={handleInputChange} className="col-span-3 bg-gray-800 border-gray-700 text-white rounded-md">
                <option value="general">General</option>
                <option value="support">Support</option>
                <option value="partnership">Partnership</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right text-white">Message</Label>
              <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} className="col-span-3 bg-gray-800 border-gray-700 text-white" required />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
