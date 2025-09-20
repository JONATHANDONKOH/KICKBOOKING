export interface Stadium {
  id: string
  name: string
  location: string
  capacity: number
  pricePerHour: number
  rating: number
  amenities: string[]
  description: string
  imageUrl: string
  isActive: boolean
  availability: "Available" | "Booked" | "Inactive"
}

export interface Booking {
  id: string
  stadiumId: string
  stadiumName: string
  userId: string
  userName: string
  date: string
  time?: string
  timeSlot?: string
  duration: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
  approvedAt?: string
  cancelledAt?: string
  rejectionReason?: string
  notes?: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "user" | "admin"
  status: "active" | "inactive"
  joinDate: string
  avatar?: string
  totalBookings?: number
  totalSpent?: number
}

export const mockStadiums: Stadium[] = [
  {
    id: "1",
    name: "Wembley Stadium",
    location: "London, England",
    capacity: 90000,
    pricePerHour: 500,
    rating: 4.9,
    amenities: ["WiFi", "Parking", "Food Court", "Security", "Floodlights"],
    description: "The iconic Wembley Stadium, home of English football and host to major international events.",
    imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
    isActive: true,
    availability: "Available",
  },
  {
    id: "2",
    name: "Emirates Stadium",
    location: "North London, England",
    capacity: 60704,
    pricePerHour: 400,
    rating: 4.7,
    amenities: ["WiFi", "Parking", "Food Court", "Security"],
    description: "Arsenal's modern home stadium with state-of-the-art facilities and excellent pitch conditions.",
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
    isActive: true,
    availability: "Available",
  },
  {
    id: "3",
    name: "Old Trafford",
    location: "Manchester, England",
    capacity: 74879,
    pricePerHour: 450,
    rating: 4.8,
    amenities: ["WiFi", "Parking", "Food Court", "Security", "Floodlights"],
    description: "The Theatre of Dreams, Manchester United's legendary home ground with rich football history.",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop",
    isActive: true,
    availability: "Booked",
  },
  {
    id: "4",
    name: "Anfield",
    location: "Liverpool, England",
    capacity: 53394,
    pricePerHour: 380,
    rating: 4.9,
    amenities: ["WiFi", "Parking", "Security", "Floodlights"],
    description: "Liverpool FC's atmospheric home stadium, famous for its incredible crowd support and history.",
    imageUrl: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&h=600&fit=crop",
    isActive: true,
    availability: "Available",
  },
  {
    id: "5",
    name: "Stamford Bridge",
    location: "West London, England",
    capacity: 40834,
    pricePerHour: 350,
    rating: 4.6,
    amenities: ["WiFi", "Parking", "Food Court", "Security"],
    description: "Chelsea FC's historic home ground in the heart of London with modern amenities.",
    imageUrl: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop",
    isActive: true,
    availability: "Available",
  },
  {
    id: "6",
    name: "Etihad Stadium",
    location: "Manchester, England",
    capacity: 55017,
    pricePerHour: 420,
    rating: 4.7,
    amenities: ["WiFi", "Parking", "Food Court", "Security", "Floodlights"],
    description: "Manchester City's modern stadium with excellent facilities and perfect pitch conditions.",
    imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop",
    isActive: true,
    availability: "Available",
  },
  {
    id: "7",
    name: "Tottenham Stadium",
    location: "North London, England",
    capacity: 62850,
    pricePerHour: 480,
    rating: 4.8,
    amenities: ["WiFi", "Parking", "Food Court", "Security", "Floodlights"],
    description: "Tottenham's brand new state-of-the-art stadium with cutting-edge technology and design.",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=600&fit=crop",
    isActive: true,
    availability: "Available",
  },
  {
    id: "8",
    name: "London Stadium",
    location: "East London, England",
    capacity: 66000,
    pricePerHour: 320,
    rating: 4.4,
    amenities: ["WiFi", "Parking", "Food Court", "Security"],
    description: "West Ham United's home stadium, originally built for the 2012 Olympics with great facilities.",
    imageUrl: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&h=600&fit=crop",
    isActive: true,
    availability: "Available",
  },
]

export const mockBookings: Booking[] = [
  {
    id: "1",
    stadiumId: "1",
    stadiumName: "Wembley Stadium",
    userId: "user1",
    userName: "John Smith",
    date: "2024-01-15",
    timeSlot: "14:00-16:00",
    duration: 2,
    totalPrice: 1000,
    status: "confirmed",
    createdAt: "2024-01-10T10:00:00Z",
    approvedAt: "2024-01-10T12:00:00Z",
    notes: "Corporate event booking",
  },
  {
    id: "2",
    stadiumId: "2",
    stadiumName: "Emirates Stadium",
    userId: "user2",
    userName: "Sarah Johnson",
    date: "2024-01-20",
    timeSlot: "10:00-12:00",
    duration: 2,
    totalPrice: 800,
    status: "pending",
    createdAt: "2024-01-12T14:30:00Z",
    notes: "Team training session",
  },
  {
    id: "3",
    stadiumId: "3",
    stadiumName: "Old Trafford",
    userId: "user3",
    userName: "Mike Wilson",
    date: "2024-01-18",
    timeSlot: "16:00-18:00",
    duration: 2,
    totalPrice: 900,
    status: "confirmed",
    createdAt: "2024-01-08T09:15:00Z",
    approvedAt: "2024-01-08T11:00:00Z",
    notes: "Football tournament",
  },
]

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+44 20 1234 5678",
    role: "user",
    status: "active",
    joinDate: "2024-01-01",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    totalBookings: 5,
    totalSpent: 2500,
  },
  {
    id: "user2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+44 20 2345 6789",
    role: "user",
    status: "active",
    joinDate: "2024-01-05",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    totalBookings: 3,
    totalSpent: 1200,
  },
  {
    id: "user3",
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    phone: "+44 20 3456 7890",
    role: "user",
    status: "active",
    joinDate: "2024-01-10",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    totalBookings: 2,
    totalSpent: 900,
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@kickbooking.com",
    phone: "+44 20 4567 8901",
    role: "admin",
    status: "active",
    joinDate: "2023-12-01",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    totalBookings: 0,
    totalSpent: 0,
  },
]
