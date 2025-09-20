"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { LayoutDashboard, Users, Building2, Calendar, BarChart3, LogOut, Menu, X, User, MapPin } from "lucide-react"

/**
 * Sidebar Component - Navigation sidebar for admin and user dashboards
 * Provides navigation links based on user role and current page
 * Includes responsive mobile menu functionality
 */
export default function Sidebar() {
  // Get current user, logout function, and navigation utilities
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  // State for mobile menu visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  /**
   * Handle user logout
   * Shows confirmation toast and redirects to homepage
   */
  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    })
    router.push("/")
  }

  // Define navigation items based on user role
  const adminNavItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Stadiums",
      href: "/admin/stadiums",
      icon: Building2,
    },
    {
      name: "Bookings",
      href: "/admin/bookings",
      icon: Calendar,
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
    },
  ]

  const userNavItems = [
    {
      name: "Dashboard",
      href: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Book Stadium",
      href: "/user/book-stadium",
      icon: MapPin,
    },
    {
      name: "My Bookings",
      href: "/user/my-bookings",
      icon: Calendar,
    },
    {
      name: "Profile",
      href: "/user/profile",
      icon: User,
    },
  ]

  // Select navigation items based on user role
  const navItems = user?.role === "admin" ? adminNavItems : userNavItems

  /**
   * Check if a navigation item is currently active
   */
  const isActive = (href: string) => pathname === href

  /**
   * Handle mobile menu item click
   * Closes mobile menu after navigation
   */
  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar - Desktop and Mobile */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">KB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Kick Booking</span>
          </div>
          {/* Close button for mobile */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User Info Section */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || "user"}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link key={item.name} href={item.href} onClick={handleMobileNavClick}>
                <div
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      active
                        ? "bg-green-100 text-green-700 border-r-2 border-green-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer with Logout */}
        <div className="px-4 py-4 border-t">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

// Export as default to fix the import issue
export { Sidebar }
