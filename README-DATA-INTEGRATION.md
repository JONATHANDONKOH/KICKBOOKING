# Data Integration Guide

This guide explains how to integrate your own data into the Kick Booking application.

## 🗂️ Data Structures

### Stadium Data
\`\`\`typescript
interface Stadium {
  id: string
  name: string
  location: string
  capacity: number
  pricePerHour: number
  image: string
  amenities: string[]
  availability: "Available" | "Booked"
  rating: number
}
\`\`\`

### Booking Data
\`\`\`typescript
interface Booking {
  id: string
  stadiumId: string
  stadiumName: string
  userId: string
  userName: string
  date: string // Format: "YYYY-MM-DD"
  time: string // Format: "HH:MM-HH:MM"
  duration: number
  totalPrice: number
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string // ISO date string
  notes?: string
  rejectionReason?: string
}
\`\`\`

### User Data
\`\`\`typescript
interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "user" | "admin"
  status: "active" | "inactive" | "suspended"
  joinDate: string
  lastLogin?: string
  totalBookings: number
  totalSpent: number
  avatar?: string
}
\`\`\`

## 🔌 Integration Points

### 1. Replace Data Sources
Update these files with your API endpoints:

- `data/mockData.ts` - Replace empty arrays with API calls
- `utils/dataHelpers.ts` - Implement fetch functions
- `context/AuthContext.tsx` - Implement real authentication

### 2. API Integration Examples

\`\`\`typescript
// In your components, replace static data with API calls:

// Fetch stadiums
useEffect(() => {
  const loadStadiums = async () => {
    const stadiums = await fetch('/api/stadiums').then(res => res.json())
    setStadiums(stadiums)
  }
  loadStadiums()
}, [])

// Fetch bookings
useEffect(() => {
  const loadBookings = async () => {
    const bookings = await fetch('/api/bookings').then(res => res.json())
    setBookings(bookings)
  }
  loadBookings()
}, [])
\`\`\`

### 3. Authentication Integration

Replace the mock authentication in `context/AuthContext.tsx`:

\`\`\`typescript
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (response.ok) {
      const user = await response.json()
      setUser(user)
      localStorage.setItem("kick-booking-user", JSON.stringify(user))
      return true
    }
    return false
  } catch (error) {
    console.error('Login error:', error)
    return false
  }
}
\`\`\`

## 📊 Chart Data Integration

For the reports page, structure your data like this:

\`\`\`typescript
// Monthly revenue data
const monthlyRevenue = [
  { month: "Jan", revenue: 12500, bookings: 45 },
  { month: "Feb", revenue: 15200, bookings: 52 },
  // ... more months
]

// Stadium performance data
const stadiumPerformance = [
  { 
    name: "Stadium Name", 
    bookings: 35, 
    revenue: 17500, 
    utilization: 87, 
    rating: 4.8 
  },
  // ... more stadiums
]
\`\`\`

## 🚀 Quick Start

1. **Set up your backend API** with endpoints for:
   - `/api/stadiums` (GET, POST, PUT, DELETE)
   - `/api/bookings` (GET, POST, PUT, DELETE)
   - `/api/users` (GET, POST, PUT, DELETE)
   - `/api/auth/login` (POST)
   - `/api/auth/register` (POST)

2. **Update the data fetching functions** in `utils/dataHelpers.ts`

3. **Replace localStorage usage** with proper API calls

4. **Update authentication** in `context/AuthContext.tsx`

5. **Test each page** to ensure data flows correctly

## 🔧 Environment Variables

Add these to your `.env.local`:

\`\`\`
NEXT_PUBLIC_API_URL=your-api-base-url
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
\`\`\`

## 📝 Notes

- All components are designed to handle empty states gracefully
- Loading states are implemented for better UX
- Error handling should be added for production use
- Consider implementing data caching for better performance
