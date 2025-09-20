"use client"

import { useEffect, useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Sidebar from "@/components/Sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useData } from "@/context/DataContext"
import { useToast } from "@/hooks/use-toast"
import { Search, Users, UserCheck, Calendar, Mail, Phone, Shield, User, Filter, X, Edit2, Trash2 } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

// Optional type for stronger TS help; adjust to match your table columns
type UserRecord = {
  id: string
  name: string
  email: string
  phone?: string
  status: string
  role: string
  avatar?: string
  joinDate?: string
  totalBookings?: number
  totalSpent?: number
  created_at?: string
}

export default function ManageUsers() {
  // Keep stats from your DataContext to preserve the same layout
  const { stats } = useData()

  // Use Supabase as the live source of truth for users
  const [users, setUsers] = useState<UserRecord[]>([])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")

  const [editUser, setEditUser] = useState<UserRecord | null>(null)
  const [editForm, setEditForm] = useState<Partial<UserRecord>>({})
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()

  // Fetch users from Supabase on mount
  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("users_profile")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      toast({ title: "Failed to load users", description: error.message, variant: "destructive" })
    } else {
      setUsers((data as UserRecord[]) || [])
    }
    setLoading(false)
  }

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.phone?.toLowerCase().includes(term) ||
      String(user.id).toLowerCase().includes(term)

    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const handleStatusChange = async (userId: string, newStatus: string, userName: string) => {
    const { error } = await supabase.from("users_profile").update({ status: newStatus }).eq("id", userId)
    if (error) {
      toast({ title: "Status update failed", description: error.message, variant: "destructive" })
      return
    }
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)))
    toast({
      title: "User Status Updated",
      description: `${userName} has been ${newStatus === "active" ? "activated" : "suspended"}.`,
      variant: newStatus === "suspended" ? "destructive" : "default",
    })
  }

  const handleRoleChange = async (userId: string, newRole: string, userName: string) => {
    const { error } = await supabase.from("users_profile").update({ role: newRole }).eq("id", userId)
    if (error) {
      toast({ title: "Role update failed", description: error.message, variant: "destructive" })
      return
    }
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    toast({ title: "User Role Updated", description: `${userName} is now ${newRole === "admin" ? "an admin" : "a regular user"}.` })
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    const confirmed = window.confirm(`Delete ${userName}? This cannot be undone.`)
    if (!confirmed) return

    const { error } = await supabase.from("users_profile").delete().eq("id", userId)
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" })
      return
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    toast({ title: "User Deleted", description: `${userName} has been removed successfully.`, variant: "destructive" })
  }

  const openEdit = (user: UserRecord) => {
    setEditUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
    })
  }

  const saveEdit = async () => {
    if (!editUser) return
    const updates = {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role,
      status: editForm.status,
    }

    const { error } = await supabase.from("users_profile").update(updates).eq("id", editUser.id)
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" })
      return
    }

    setUsers((prev) => prev.map((u) => (u.id === editUser.id ? { ...u, ...updates } : u)))
    toast({ title: "Profile Updated", description: `${editForm.name || editUser.name} has been updated.` })
    setEditUser(null)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setRoleFilter("all")
  }

  // Calculate user stats (from Supabase list)
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "active").length
  const suspendedUsers = users.filter((u) => u.status === "suspended").length
  const adminUsers = users.filter((u) => u.role === "admin").length

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 text-black overflow-hidden">
          {/* Header */}
          <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 px-4 lg:px-6 py-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Manage Users</h1>
              <p className="text-slate-600 mt-1 text-sm lg:text-base">View and manage user accounts and permissions.</p>
              <p className="text-black mt-2 text-base font-medium">
                Your community matters! Here you can empower users, assign admin roles, and keep your platform safe and welcoming. Every great booking starts with a happy user.
              </p>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4 lg:p-6">
              <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalUsers}</div>
                      <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
                      <p className="text-xs text-muted-foreground">{suspendedUsers} suspended</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
                      <Shield className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{adminUsers}</div>
                      <p className="text-xs text-muted-foreground">{totalUsers - adminUsers} regular users</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
                      <p className="text-xs text-muted-foreground">Across all users</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Filters */}
                <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Search and filter users, manage their status and roles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search by name, email, phone, or ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-full bg-white/80"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-white/80">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-white/80">
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="user">Users</SelectItem>
                          <SelectItem value="admin">Admins</SelectItem>
                        </SelectContent>
                      </Select>
                      {(searchTerm || statusFilter !== "all" || roleFilter !== "all") && (
                        <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap bg-white/80">
                          <X className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                      )}
                    </div>

                    {loading ? (
                      <div className="text-sm text-gray-600">Loading users…</div>
                    ) : filteredUsers.length > 0 ? (
                      <>
                        <div className="text-sm text-gray-600 mb-4">Showing {filteredUsers.length} of {totalUsers} users</div>
                        <div className="border rounded-md">
                          <ScrollArea className="h-[500px] w-full">
                            <Table>
                              <TableHeader className="sticky top-0 bg-muted">
                                <TableRow>
                                  <TableHead>User</TableHead>
                                  <TableHead>Contact</TableHead>
                                  <TableHead>Role</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Join Date</TableHead>
                                  <TableHead>Bookings</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredUsers.map((user) => (
                                  <TableRow key={user.id}>
                                    <TableCell className="min-w-[200px]">
                                      <div className="flex items-center space-x-3">
                                        <Avatar>
                                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                          <AvatarFallback>
                                            {user.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                          <div className="font-medium truncate">{user.name}</div>
                                          <div className="text-sm text-gray-500 truncate">ID: {user.id}</div>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="min-w-[180px]">
                                      <div className="space-y-1">
                                        <div className="flex items-center text-sm">
                                          <Mail className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                                          <span className="truncate">{user.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                          <Phone className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                                          <span className="truncate">{user.phone || "—"}</span>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="min-w-[120px]">
                                      <Select value={user.role} onValueChange={(value) => handleRoleChange(user.id, value, user.name)}>
                                        <SelectTrigger className="w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="user">
                                            <div className="flex items-center">
                                              <User className="h-4 w-4 mr-2" />
                                              User
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="admin">
                                            <div className="flex items-center">
                                              <Shield className="h-4 w-4 mr-2" />
                                              Admin
                                            </div>
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell className="min-w-[120px]">
                                      <Select value={user.status} onValueChange={(value) => handleStatusChange(user.id, value, user.name)}>
                                        <SelectTrigger className="w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="active">
                                            <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                                          </SelectItem>
                                          <SelectItem value="suspended">
                                            <Badge variant="destructive">Suspended</Badge>
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </TableCell>
                                    <TableCell className="min-w-[120px]">
                                      <div className="flex items-center text-sm">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                                        <span className="truncate">
                                          {user.joinDate || (user.created_at ? new Date(user.created_at).toLocaleDateString() : "—")}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell className="min-w-[100px]">
                                      <div className="text-center">
                                        <div className="font-medium">{user.totalBookings || 0}</div>
                                        <div className="text-xs text-gray-500">${user.totalSpent || 0}</div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="min-w-[100px]">
                                      <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openEdit(user)}>
                                          <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id, user.name)}>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </ScrollArea>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-500 mb-4">
                          {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                            ? "No users match your current filters."
                            : "No users have been registered yet."}
                        </p>
                        {(searchTerm || statusFilter !== "all" || roleFilter !== "all") && (
                          <Button variant="outline" onClick={clearFilters}>
                            <Filter className="h-4 w-4 mr-2" />
                            Clear all filters
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Inline lightweight edit modal (no extra UI lib needed) */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input value={editForm.name || ""} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input type="email" value={editForm.email || ""} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input value={editForm.phone || ""} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <Select value={(editForm.role as string) || "user"} onValueChange={(v) => setEditForm((f) => ({ ...f, role: v }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select value={(editForm.status as string) || "active"} onValueChange={(v) => setEditForm((f) => ({ ...f, status: v }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
              <Button onClick={saveEdit}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  )
}