"use client"

import { useState, useCallback } from "react"
import SearchFilters from "@/components/search-filters"
import PropertyGrid from "@/components/property-grid"
import PropertyMap from "@/components/property-map"
import AmenityList from "@/components/amenity-list"
import Pagination from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Grid3X3, List, TrendingUp, Star } from "lucide-react"

// Mock data with enhanced color-coded properties
const mockProperties = [
  {
    _id: "1",
    title: "Luxury 3BHK Apartment in Bandra West",
    description: "Spacious apartment with modern amenities and sea view",
    price: 25000000,
    originalPrice: 28000000,
    location: { city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    amenities: ["Swimming Pool", "Gym", "Parking", "Security"],
    images: ["/placeholder.svg?height=300&width=400"],
    listedDate: "2024-01-15",
    status: "hot",
    coordinates: { lat: 19.0596, lng: 72.8295 },
    priceCategory: "premium",
    isNew: true,
    dealScore: 85,
  },
  {
    _id: "2",
    title: "Modern 2BHK Villa in Whitefield",
    description: "Independent villa with garden and premium location",
    price: 18000000,
    originalPrice: 18000000,
    location: { city: "Bangalore", state: "Karnataka", pincode: "560066" },
    propertyType: "villa",
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    amenities: ["Garden", "Parking", "Security", "Power Backup"],
    images: ["/placeholder.svg?height=300&width=400"],
    listedDate: "2024-01-20",
    status: "available",
    coordinates: { lat: 12.9698, lng: 77.75 },
    priceCategory: "mid-range",
    isNew: false,
    dealScore: 72,
  },
  {
    _id: "3",
    title: "Spacious 4BHK Penthouse in Gurgaon",
    description: "Premium penthouse with terrace and city view",
    price: 35000000,
    originalPrice: 35000000,
    location: { city: "Gurgaon", state: "Haryana", pincode: "122001" },
    propertyType: "penthouse",
    bedrooms: 4,
    bathrooms: 3,
    area: 2000,
    amenities: ["Terrace", "Gym", "Swimming Pool", "Clubhouse"],
    images: ["/placeholder.svg?height=300&width=400"],
    listedDate: "2024-01-25",
    status: "available",
    coordinates: { lat: 28.4595, lng: 77.0266 },
    priceCategory: "luxury",
    isNew: false,
    dealScore: 90,
  },
  {
    _id: "4",
    title: "Cozy 1BHK Studio in Koramangala",
    description: "Perfect for young professionals, fully furnished",
    price: 8000000,
    originalPrice: 9500000,
    location: { city: "Bangalore", state: "Karnataka", pincode: "560034" },
    propertyType: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    amenities: ["Furnished", "Parking", "Security"],
    images: ["/placeholder.svg?height=300&width=400"],
    listedDate: "2024-02-01",
    status: "great-deal",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    priceCategory: "budget",
    isNew: true,
    dealScore: 95,
  },
  {
    _id: "5",
    title: "Elegant 3BHK Flat in Andheri East",
    description: "Well-connected location with metro connectivity",
    price: 22000000,
    originalPrice: 22000000,
    location: { city: "Mumbai", state: "Maharashtra", pincode: "400069" },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1100,
    amenities: ["Metro Access", "Gym", "Parking", "Garden"],
    images: ["/placeholder.svg?height=300&width=400"],
    listedDate: "2024-02-05",
    status: "pending",
    coordinates: { lat: 19.1136, lng: 72.8697 },
    priceCategory: "mid-range",
    isNew: false,
    dealScore: 78,
  },
  {
    _id: "6",
    title: "Premium 2BHK in Cyber City",
    description: "Modern apartment in IT hub with all amenities",
    price: 15000000,
    originalPrice: 15000000,
    location: { city: "Gurgaon", state: "Haryana", pincode: "122002" },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 900,
    amenities: ["IT Hub", "Gym", "Swimming Pool", "Cafeteria"],
    images: ["/placeholder.svg?height=300&width=400"],
    listedDate: "2024-02-10",
    status: "available",
    coordinates: { lat: 28.4949, lng: 77.0787 },
    priceCategory: "mid-range",
    isNew: false,
    dealScore: 80,
  },
]

const mockAmenities = {
  hospital: [
    {
      type: "hospital",
      name: "Apollo Hospital",
      address: "123 Main St",
      distance: 0.8,
      duration: "3 mins",
      rating: 4.5,
      userRatingsTotal: 1250,
    },
    {
      type: "hospital",
      name: "Fortis Healthcare",
      address: "456 Health Ave",
      distance: 1.2,
      duration: "5 mins",
      rating: 4.3,
      userRatingsTotal: 890,
    },
  ],
  school: [
    {
      type: "school",
      name: "Delhi Public School",
      address: "789 Education Rd",
      distance: 0.5,
      duration: "2 mins",
      rating: 4.7,
      userRatingsTotal: 2100,
    },
    {
      type: "school",
      name: "Ryan International",
      address: "321 Learning St",
      distance: 0.9,
      duration: "4 mins",
      rating: 4.4,
      userRatingsTotal: 1560,
    },
  ],
  restaurant: [
    {
      type: "restaurant",
      name: "The Spice Route",
      address: "654 Food Court",
      distance: 0.3,
      duration: "1 min",
      rating: 4.6,
      userRatingsTotal: 3200,
    },
    {
      type: "restaurant",
      name: "Urban Tadka",
      address: "987 Cuisine Plaza",
      distance: 0.7,
      duration: "3 mins",
      rating: 4.2,
      userRatingsTotal: 1890,
    },
  ],
}

export default function PropertySearchApp() {
  const [properties, setProperties] = useState(mockProperties)
  const [filteredProperties, setFilteredProperties] = useState(mockProperties)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [nearbyAmenities, setNearbyAmenities] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeView, setActiveView] = useState("grid")
  const [activeAmenityTypes, setActiveAmenityTypes] = useState(["hospital", "school", "restaurant"])

  const propertiesPerPage = 6
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage)
  const startIndex = (currentPage - 1) * propertiesPerPage
  const currentProperties = filteredProperties.slice(startIndex, startIndex + propertiesPerPage)

  const handleSearch = useCallback((filters) => {
    setLoading(true)
    setError(null)

    // Simulate API call
    setTimeout(() => {
      let filtered = mockProperties

      if (filters.city && filters.city !== "all") {
        filtered = filtered.filter((p) => p.location.city.toLowerCase().includes(filters.city.toLowerCase()))
      }

      if (filters.minPrice) {
        filtered = filtered.filter((p) => p.price >= filters.minPrice)
      }

      if (filters.maxPrice) {
        filtered = filtered.filter((p) => p.price <= filters.maxPrice)
      }

      if (filters.propertyType && filters.propertyType !== "all") {
        filtered = filtered.filter((p) => p.propertyType === filters.propertyType)
      }

      if (filters.minBedrooms) {
        filtered = filtered.filter((p) => p.bedrooms >= filters.minBedrooms)
      }

      setFilteredProperties(filtered)
      setCurrentPage(1)
      setLoading(false)
    }, 1000)
  }, [])

  const handlePropertySelect = useCallback((property) => {
    setSelectedProperty(property)
    setNearbyAmenities(mockAmenities)
  }, [])

  const handleShowAmenities = useCallback(
    (propertyId) => {
      const property = properties.find((p) => p._id === propertyId)
      if (property) {
        setSelectedProperty(property)
        setNearbyAmenities(mockAmenities)
      }
    },
    [properties],
  )

  const handleAmenityTypeToggle = useCallback((type) => {
    setActiveAmenityTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }, [])

  // Calculate stats for header
  const hotDeals = filteredProperties.filter((p) => p.status === "great-deal" || p.dealScore > 90).length
  const newListings = filteredProperties.filter((p) => p.isNew).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header with Color Psychology */}
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="relative">
                <MapPin className="h-8 w-8 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BhuExpert
              </span>
            </div>

            {/* Stats Bar */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">{hotDeals} Hot Deals</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
                <Star className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">{newListings} New</span>
              </div>
            </div>

            <nav className="hidden lg:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Buy
              </a>
              <a href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                Rent
              </a>
              <a href="#" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Sell
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                About
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Enhanced Search Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8 bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
              <SearchFilters onSearch={handleSearch} />
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Enhanced View Toggle */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                  Properties ({filteredProperties.length})
                </h1>
                <p className="text-gray-600 mt-1">Find your perfect home with smart recommendations</p>
              </div>
              <Tabs value={activeView} onValueChange={setActiveView} className="w-auto">
                <TabsList className="bg-white border border-gray-200 shadow-md">
                  <TabsTrigger
                    value="grid"
                    className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    Grid
                  </TabsTrigger>
                  <TabsTrigger
                    value="map"
                    className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    <MapPin className="h-4 w-4" />
                    Map
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    <List className="h-4 w-4" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Tabs value={activeView} onValueChange={setActiveView}>
              <TabsContent value="grid">
                <PropertyGrid
                  properties={currentProperties}
                  loading={loading}
                  error={error}
                  onPropertyClick={handlePropertySelect}
                  onShowAmenities={handleShowAmenities}
                />

                {!loading && filteredProperties.length > 0 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="map">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2">
                    <PropertyMap
                      properties={filteredProperties}
                      selectedProperty={selectedProperty}
                      nearbyAmenities={nearbyAmenities}
                      onPropertySelect={handlePropertySelect}
                      onAmenityTypeToggle={handleAmenityTypeToggle}
                      activeAmenityTypes={activeAmenityTypes}
                    />
                  </div>
                  <div className="xl:col-span-1">
                    {selectedProperty && nearbyAmenities && (
                      <AmenityList
                        amenities={nearbyAmenities}
                        loading={false}
                        propertyLocation={selectedProperty.coordinates}
                        activeTypes={activeAmenityTypes}
                        onTypeToggle={handleAmenityTypeToggle}
                      />
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="list">
                <div className="space-y-4">
                  {currentProperties.map((property) => (
                    <Card
                      key={property._id}
                      className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-blue-500 bg-gradient-to-r from-white to-blue-50"
                      onClick={() => handlePropertySelect(property)}
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative">
                          <img
                            src={property.images[0] || "/placeholder.svg"}
                            alt={property.title}
                            className="w-full md:w-48 h-32 object-cover rounded-lg"
                          />
                          {property.isNew && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                              NEW
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h3>
                          <p className="text-gray-600 mb-3">{property.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                            <span>{property.bedrooms} BHK</span>
                            <span>{property.area} sq ft</span>
                            <span>
                              {property.location.city}, {property.location.state}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-blue-600">
                                ₹{(property.price / 10000000).toFixed(1)}Cr
                              </span>
                              {property.originalPrice > property.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{(property.originalPrice / 10000000).toFixed(1)}Cr
                                </span>
                              )}
                            </div>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShowAmenities(property._id)
                              }}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            >
                              View Amenities
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {!loading && filteredProperties.length > 0 && (
                  <div className="mt-8">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
