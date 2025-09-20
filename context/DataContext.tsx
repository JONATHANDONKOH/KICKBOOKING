"use client"

import type { ReactNode } from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

/* -------------------------------------------------------------------------- */
/*  Domain Types — keep these in sync with what the UI expects                */
/* -------------------------------------------------------------------------- */

export interface Stadium {
  id: string
  name: string
  location: string
  capacity: number
  pricePerHour: number
  rating: number
  amenities: string[]
  description?: string
  imageUrl?: string
  /* Admin flags */
  isActive: boolean
  status: string // Add status string for compatibility
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

interface Stats {
  totalStadiums: number
  activeStadiums: number
  inactiveStadiums: number
  totalBookings: number
  totalRevenue: number
  activeUsers: number
  pendingRequests: number
  monthlyGrowth: number
}

/* -------------------------------------------------------------------------- */
/*  Context Shape                                                             */
/* -------------------------------------------------------------------------- */

interface DataContextType {
  /* Data */
  stadiums: Stadium[]
  bookings: Booking[]
  users: User[]

  /* Stadium helpers */
  addStadium: (s: Stadium) => void
  updateStadium: (id: string, updates: Partial<Stadium>) => void
  deleteStadium: (id: string) => void
  activateStadium: (id: string) => void
  deactivateStadium: (id: string) => void

  /* Booking helpers */
  addBooking: (b: Booking) => void
  updateBooking: (id: string, updates: Partial<Booking>) => void
  deleteBooking: (id: string) => void

  /* User helpers */
  addUser: (u: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void

  /* Aggregates */
  stats: Stats

  /* Utilities */
  refreshData: () => void
  clearAllData: () => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

/* -------------------------------------------------------------------------- */
/*  Provider                                                                  */
/* -------------------------------------------------------------------------- */

export function DataProvider({ children }: { children: ReactNode }) {
  /* ------------------------------- State --------------------------------- */
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [users, setUsers] = useState<User[]>([])

  /* --------------------------- LocalStorage IO --------------------------- */
  // Removed localStorage usage. Data is now managed only in React state.
  const loadFromStorage = useCallback(() => {
    // No-op: localStorage removed and not needed for in-memory state
    // Data is already managed in React state
  }, [])

  const persist = useCallback((key: string, val: unknown) => {
    // No-op: localStorage removed
    // Optionally, you can still dispatch the event if needed
    window.dispatchEvent(new CustomEvent("dataUpdated", { detail: { key, value: val } }))
  }, [])

  /* --------------------------- CRUD — Stadiums --------------------------- */
  const addStadium = useCallback(
    (s: Stadium) => {
      // If no imageUrl is provided when adding a stadium, automatically assign a default image.
      // This ensures every stadium has an image for display in the UI.
      const defaultImage = '/placeholder.jpg';
      const stadiumWithImage = {
        ...s,
        imageUrl: s.imageUrl || defaultImage,
      };
      setStadiums((prev) => {
        const next = [...prev, stadiumWithImage];
        persist("stadiums", next);
        return next;
      });
    },
    [persist],
  )

  const updateStadium = useCallback(
    (id: string, updates: Partial<Stadium>) => {
      setStadiums((prev) => {
        const next = prev.map((st) =>
          st.id === id
            ? {
                ...st,
                ...updates,
                availability:
                  updates.isActive !== undefined ? (updates.isActive ? "Available" : "Inactive") : st.availability,
              }
            : st,
        )
        persist("stadiums", next)
        return next
      })
    },
    [persist],
  )

  const deleteStadium = useCallback(
    (id: string) => {
      setStadiums((prev) => {
        const next = prev.filter((s) => s.id !== id)
        persist("stadiums", next)
        return next
      })
      /* cascade-delete bookings */
      setBookings((prev) => {
        const next = prev.filter((b) => b.stadiumId !== id)
        persist("bookings", next)
        return next
      })
    },
    [persist],
  )

  const activateStadium = useCallback((id: string) => updateStadium(id, { isActive: true }), [updateStadium])

  const deactivateStadium = useCallback((id: string) => updateStadium(id, { isActive: false }), [updateStadium])

  /* --------------------------- CRUD — Bookings --------------------------- */
  const addBooking = useCallback(
    (b: Booking) => {
      setBookings((prev) => {
        const next = [...prev, b]
        persist("bookings", next)
        return next
      })
    },
    [persist],
  )

  const updateBooking = useCallback(
    (id: string, updates: Partial<Booking>) => {
      setBookings((prev) => {
        const next = prev.map((bk) => (bk.id === id ? { ...bk, ...updates } : bk))
        persist("bookings", next)
        return next
      })
    },
    [persist],
  )

  const deleteBooking = useCallback(
    (id: string) => {
      setBookings((prev) => {
        const next = prev.filter((b) => b.id !== id)
        persist("bookings", next)
        return next
      })
    },
    [persist],
  )

  /* --------------------------- CRUD — Users ------------------------------ */
  const addUser = useCallback(
    (u: User) => {
      setUsers((prev) => {
        const next = [...prev, u]
        persist("users", next)
        return next
      })
    },
    [persist],
  )

  const updateUser = useCallback(
    (id: string, updates: Partial<User>) => {
      setUsers((prev) => {
        const next = prev.map((us) => (us.id === id ? { ...us, ...updates } : us))
        persist("users", next)
        return next
      })
    },
    [persist],
  )

  const deleteUser = useCallback(
    (id: string) => {
      setUsers((prev) => {
        const next = prev.filter((u) => u.id !== id)
        persist("users", next)
        return next
      })
    },
    [persist],
  )

  // Add a replaceStadiums function for admin page bulk updates
  const replaceStadiums = useCallback((newStadiums: Stadium[]) => {
    setStadiums(newStadiums)
  }, [])

  /* ----------------------------- Utilities ----------------------------- */
  const refreshData = useCallback(() => {
    // No-op: Data is managed in-memory and automatically synchronized
    // through React's state management
  }, [])

  const clearAllData = useCallback(() => {
    // localStorage removed
    setStadiums([])
    setBookings([])
    setUsers([])
  }, [])

  /* ------------------------------ Stats --------------------------------- */
  const stats = useMemo<Stats>(() => {
    const totalStadiums = stadiums.length
    const activeStadiums = stadiums.filter((s) => s.isActive).length
    const inactiveStadiums = totalStadiums - activeStadiums

    const totalBookings = bookings.length
    const totalRevenue = bookings.filter((b) => b.status === "confirmed").reduce((sum, b) => sum + b.totalPrice, 0)

    const activeUsers = users.filter((u) => u.status === "active").length
    const pendingRequests = bookings.filter((b) => b.status === "pending").length

    /* Placeholder growth calculation */
    const monthlyGrowth = totalBookings > 0 ? Math.round((activeStadiums / totalStadiums) * 100) || 0 : 0

    return {
      totalStadiums,
      activeStadiums,
      inactiveStadiums,
      totalBookings,
      totalRevenue,
      activeUsers,
      pendingRequests,
      monthlyGrowth,
    }
  }, [stadiums, bookings, users])

  /* ------------------------- Init & Event Sync --------------------------- */
  useEffect(() => {
    // No initialization needed for in-memory state
    // Storage event listeners removed as localStorage is no longer used
  }, [])

  /* ---------------------------- Context Value ---------------------------- */
  const value: DataContextType & { replaceStadiums: (s: Stadium[]) => void } = {
    /* data */
    stadiums,
    bookings,
    users,
    /* stadium */
    addStadium,
    updateStadium,
    deleteStadium,
    activateStadium,
    deactivateStadium,
    /* booking */
    addBooking,
    updateBooking,
    deleteBooking,
    /* user */
    addUser,
    updateUser,
    deleteUser,
    /* aggregates */
    stats,
    /* utils */
    refreshData,
    clearAllData,
    replaceStadiums, // Expose replaceStadiums
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

/* -------------------------------------------------------------------------- */
/*  Hook                                                                      */
/* -------------------------------------------------------------------------- */

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within a DataProvider")
  return ctx
}
