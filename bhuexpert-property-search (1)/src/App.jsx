"use client"

import { useState, useCallback, useEffect } from "react"
import SearchFilters from "@/components/search-filters"
import PropertyGrid from "@/components/property-grid"
import PropertyMap from "@/components/property-map"
import AmenityList from "@/components/amenity-list"
import Pagination from "@/components/pagination"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Grid3X3, List, TrendingUp, Star } from "lucide-react"

export default function App() {
  const [properties, setProperties] = useState([]) // Will be populated from API
  const [filteredProperties, setFilteredProperties] = useState([])
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [nearbyAmenities, setNearbyAmenities] = useState(null)
  const [loading, setLoading] = useState(true) // Set to true initially for API call
  const [error, setError] = useState(null)
  const [amenitiesLoading, setAmenitiesLoading] = useState(false) // New loading state for amenities
  const [amenitiesError, setAmenitiesError] = useState(null) // New error state for amenities
  const [currentPage, setCurrentPage] = useState(1)
  const [activeView, setActiveView] = useState("grid")
  const [activeAmenityTypes, setActiveAmenityTypes] = useState(["hospital", "school", "restaurant"])

  const propertiesPerPage = 6
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage)
  const startIndex = (currentPage - 1) * propertiesPerPage
  const currentProperties = filteredProperties.slice(startIndex, startIndex + propertiesPerPage)

  // Fetch properties from the backend on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("http://localhost:5000/api/properties/search") // Assuming server runs on port 5000
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProperties(data)
        setFilteredProperties(data) // Initialize filtered properties with all data
      } catch (err) {
        console.error("Failed to fetch properties:", err)
        setError("Failed to load properties. Please ensure the backend server is running.")
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, []) // Empty dependency array means this runs once on mount

  // Function to fetch amenities for a given property ID
  const fetchAmenitiesForProperty = useCallback(async (propertyId) => {
    setAmenitiesLoading(true)
    setAmenitiesError(null)
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${propertyId}/nearby-amenities`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setNearbyAmenities(data)
    } catch (err) {
      console.error("Failed to fetch amenities:", err)
      setAmenitiesError("Failed to load amenities.")
    } finally {
      setAmenitiesLoading(false)
    }
  }, [])

  const handleSearch = useCallback(
    (filters) => {
      setLoading(true)
      setError(null)

      // In a real application, you would send these filters to the backend API
      // e.g., fetch(`http://localhost:5000/api/properties?city=${filters.city}&minPrice=${filters.minPrice}...`)
      // For now, we'll filter the already fetched data on the client side.
      setTimeout(() => {
        let filtered = properties // Filter from the original fetched properties

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
      }, 500) // Simulate network delay for filtering
    },
    [properties],
  ) // Depend on 'properties' to ensure filtering uses the latest data

  const handlePropertySelect = useCallback(
    (property) => {
      setSelectedProperty(property)
      fetchAmenitiesForProperty(property._id) // Fetch amenities from API
    },
    [fetchAmenitiesForProperty],
  )

  const handleShowAmenities = useCallback(
    (propertyId) => {
      const property = properties.find((p) => p._id === propertyId)
      if (property) {
        setSelectedProperty(property)
        fetchAmenitiesForProperty(property._id) // Fetch amenities from API
      }
    },
    [properties, fetchAmenitiesForProperty],
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
                    {selectedProperty && (
                      <AmenityList
                        amenities={nearbyAmenities}
                        loading={amenitiesLoading}
                        error={amenitiesError} // Pass amenity-specific error
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
