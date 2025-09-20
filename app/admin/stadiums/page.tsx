"use client"
import type { Stadium } from "@/context/DataContext"
import { useState, useEffect } from "react"
import { useData } from "@/context/DataContext"
import Sidebar from "@/components/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, MapPin, Users, Star, Edit, Trash2, Building2, DollarSign, CheckCircle, XCircle, } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"

export default function AdminStadiumsPage() {
  const { stadiums, addStadium, updateStadium, deleteStadium, replaceStadiums } = useData()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStadium, setEditingStadium] = useState<Stadium | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    stadium_name: "",
    location: "",
    capacity: "",
    price: "",
    rating: "",
    amenities: "",
    description: "",
    imageUrl: "",
    status: "active",
  })

  // Fetch stadiums from localStorage or initialize with empty array
  useEffect(() => {
    const fetchStadiums = async () => {
      try {
        setIsLoading(true)
        
        // Check if we have stadiums in localStorage
        const localStadiums = localStorage.getItem('stadiums')
        
        if (localStadiums) {
          const parsedStadiums: Stadium[] = JSON.parse(localStadiums)
          replaceStadiums(parsedStadiums)
        } else {
          // If no stadiums in localStorage, initialize with empty array
          replaceStadiums([])
        }
      } catch (error) {
        console.error('Error fetching stadiums:', error)
        toast({
          title: "Error",
          description: "Failed to fetch stadiums",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStadiums()
  }, [replaceStadiums, toast])

  // Save stadiums to localStorage whenever they change
  useEffect(() => {
    if (stadiums.length > 0 || localStorage.getItem('stadiums')) {
      localStorage.setItem('stadiums', JSON.stringify(stadiums))
    }
  }, [stadiums])

  // Update image preview when imageUrl changes
  useEffect(() => {
    if (formData.imageUrl) {
      setImagePreview(formData.imageUrl)
    } else {
      setImagePreview(null)
    }
  }, [formData.imageUrl])

  const filteredStadiums = stadiums.filter(
    (stadium) => stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stadium.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    let processedValue = value
    if (name === "imageUrl" && value && !value.startsWith("http") && !value.startsWith("/")) {
      processedValue = "/images/" + value
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : processedValue,
    }))
  }

  const resetForm = () => {
    setFormData({
      stadium_name: "",
      location: "",
      capacity: "",
      price: "",
      rating: "",
      amenities: "",
      description: "",
      imageUrl: "",
      status: "active",
    })
    setImagePreview(null)
    setEditingStadium(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.stadium_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Stadium name is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.location.trim()) {
      toast({
        title: "Validation Error",
        description: "Location is required",
        variant: "destructive",
      })
      return
    }

    const capacity = Number.parseInt(formData.capacity)
    if (isNaN(capacity) || capacity <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid capacity",
        variant: "destructive",
      })
      return
    }

    const price = Number.parseFloat(formData.price)
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price per hour",
        variant: "destructive",
      })
      return
    }

    const rating = Number.parseFloat(formData.rating)
    if (isNaN(rating) || rating < 0 || rating > 5) {
      toast({
        title: "Validation Error",
        description: "Rating must be between 0 and 5",
        variant: "destructive",
      })
      return
    }

    // Parse amenities from comma-separated string to array
    const amenities = formData.amenities
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)

    // Prepare stadium data
    const stadiumData: Stadium = {
      id: editingStadium ? editingStadium.id : Date.now().toString(),
      name: formData.stadium_name.trim(),
      location: formData.location.trim(),
      capacity,
      pricePerHour: price,
      rating,
      amenities,
      description: formData.description.trim(),
      imageUrl: formData.imageUrl.trim(),
      isActive: formData.status === "active",
      status: formData.status,
      availability: "Available",
    }

    try {
      if (editingStadium) {
        // Update stadium locally
        updateStadium(editingStadium.id, stadiumData)
        toast({
          title: "Success",
          description: "Stadium updated successfully"
        })
      } else {
        // Add new stadium to Supabase (only insertion)
        const { error } = await supabase
          .from('stadiums')
          .insert([{
            stadium_name: formData.stadium_name.trim(),
            location: formData.location.trim(),
            capacity,
            price,
            status: formData.status,
            image_url: formData.imageUrl,
          }])

        if (error) {
          console.error('Error saving stadium to Supabase:', error)
          // Even if Supabase insertion fails, we'll add it locally
          toast({
            title: "Warning",
            description: "Stadium added locally but failed to sync with server",
            variant: "default"
          })
        }

        // Add stadium locally regardless of Supabase result
        addStadium(stadiumData)
        toast({
          title: "Success",
          description: "Stadium added successfully"
        })
      }
      resetForm()
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Error saving stadium:', error)
      toast({
        title: "Error",
        description: "Failed to save stadium",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (stadium: Stadium) => {
    let imageUrl = stadium.imageUrl || ""
    if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
      imageUrl = "/images/" + imageUrl
    }
    setEditingStadium(stadium)
    setFormData({
      stadium_name: stadium.name,
      location: stadium.location,
      capacity: stadium.capacity.toString(),
      price: stadium.pricePerHour.toString(),
      rating: stadium.rating.toString(),
      amenities: stadium.amenities.join(", "),
      description: stadium.description || "",
      imageUrl: imageUrl,
      status: stadium.status,
    })
    if (imageUrl) {
      setImagePreview(imageUrl)
    }
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (stadiumId: string) => {
    if (window.confirm("Are you sure you want to delete this stadium?")) {
      try {
        // Delete stadium locally only (no Supabase operation)
        deleteStadium(stadiumId)
        toast({
          title: "Success",
          description: "Stadium deleted successfully"
        })
      } catch (error) {
        console.error('Error deleting stadium:', error)
        toast({
          title: "Error",
          description: "Failed to delete stadium",
          variant: "destructive"
        })
      }
    }
  }

  const toggleStadiumStatus = async (stadium: Stadium) => {
    try {
      // Update stadium status locally only
      const updatedStadium: Stadium = {
        ...stadium,
        isActive: !stadium.isActive,
        status: stadium.isActive ? "inactive" : "active",
      }
      
      updateStadium(stadium.id, updatedStadium)
      toast({
        title: "Success",
        description: `Stadium ${stadium.isActive ? "deactivated" : "activated"} successfully`,
      })
    } catch (error) {
      console.error('Error toggling stadium status:', error)
      toast({
        title: "Error",
        description: "Failed to update stadium status",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-blue-600 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Loading stadiums...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden text-black">
        {/* Header */}
        <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 px-4 lg:px-6 py-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stadium Management
            </h1>
            <p className="text-slate-600 mt-1 text-sm lg:text-base">Manage your stadium inventory and settings</p>
          </div>
        </header>

        {/* Main Content */}
        <ScrollArea className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Stadiums</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stadiums.length}</div>
                  <p className="text-xs text-muted-foreground">{stadiums.filter((s) => s.isActive).length} active</p>
                </CardContent>
              </Card>
              <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Capacity</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stadiums.length > 0 ? Math.round(stadiums.reduce((sum, s) => sum + s.capacity, 0) / stadiums.length) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">people per stadium</p>
                </CardContent>
              </Card>
              <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${stadiums.length > 0 ? Math.round(stadiums.reduce((sum, s) => sum + s.pricePerHour, 0) / stadiums.length) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">per hour</p>
                </CardContent>
              </Card>
              <Card className="bg-white/60 backdrop-blur-sm border-white/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stadiums.length > 0 ? (stadiums.reduce((sum, s) => sum + s.rating, 0) / stadiums.length).toFixed(1) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">out of 5 stars</p>
                </CardContent>
              </Card>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search stadiums..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      resetForm()
                      setIsAddDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stadium
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white !bg-white border border-gray-300 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingStadium ? "Edit Stadium" : "Add New Stadium"}</DialogTitle>
                    <DialogDescription>
                      {editingStadium ? "Update stadium information" : "Fill in the details to add a new stadium"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stadium_name">Stadium Name *</Label>
                        <Input
                          id="stadium_name"
                          name="stadium_name"
                          value={formData.stadium_name}
                          onChange={handleInputChange}
                          placeholder="Enter stadium name"
                          required
                          className="bg-white border border-gray-300 text-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="Enter location"
                          required
                          className="bg-white border border-gray-300 text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="capacity">Capacity *</Label>
                        <Input
                          id="capacity"
                          name="capacity"
                          type="number"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          placeholder="e.g. 50000"
                          required
                          className="bg-white border border-gray-300 text-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price per Hour *</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="e.g. 150.00"
                          required
                          className="bg-white border border-gray-300 text-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">Rating (0-5) *</Label>
                        <Input
                          id="rating"
                          name="rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={formData.rating}
                          onChange={handleInputChange}
                          placeholder="e.g. 4.5"
                          required
                          className="bg-white border border-gray-300 text-gray-900"
                        />
                      </div>
                    </div>
                    
                    {/* Image URL Section */}
                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="Enter image filename (e.g. stadium1.jpg). Images must be located in /public/images."
                        className="bg-white border border-gray-300 text-gray-900"
                      />
                    </div>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mt-2">
                        <Label>Image Preview</Label>
                        <div className="relative w-full h-48 rounded-md overflow-hidden border border-gray-300 mt-1">
                          <Image
                            src={imagePreview}
                            alt="Stadium preview"
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // If image fails to load, clear the preview
                              setImagePreview(null)
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                      <Input
                        id="amenities"
                        name="amenities"
                        value={formData.amenities}
                        onChange={handleInputChange}
                        placeholder="e.g. Parking, Changing Rooms, Floodlights"
                        className="bg-white border border-gray-300 text-gray-900"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Enter stadium description"
                        rows={3}
                        className="bg-white border border-gray-300 text-gray-900"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="status"
                        name="status"
                        checked={formData.status === "active"}
                        onChange={(e) => setFormData({...formData, status: e.target.checked ? "active" : "inactive"})}
                        className="rounded border border-gray-300"
                      />
                      <Label htmlFor="status">Stadium is active</Label>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          resetForm()
                          setIsAddDialogOpen(false)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {editingStadium ? "Update Stadium" : "Add Stadium"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stadiums Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filteredStadiums.map((stadium) => (
                <Card key={stadium.id} className="bg-white/60 backdrop-blur-sm border-white/40 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="w-full h-48 relative">
                      <Image
                        src={stadium.imageUrl || "/placeholder.svg"}
                        alt={stadium.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={stadium.isActive ? "bg-green-500" : "bg-red-500"}>
                        {stadium.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{stadium.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {stadium.location}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{stadium.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-medium">{stadium.capacity.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price/Hour:</span>
                        <span className="font-medium text-green-600">${stadium.pricePerHour}</span>
                      </div>
                    </div>
                    {stadium.amenities.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {stadium.amenities.slice(0, 3).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {stadium.amenities.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{stadium.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(stadium)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStadiumStatus(stadium)}
                        className="flex-1"
                      >
                        {stadium.isActive ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(stadium.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredStadiums.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stadiums found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "Get started by adding your first stadium"}
                </p>
                {!searchTerm && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      resetForm()
                      setIsAddDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Stadium
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}