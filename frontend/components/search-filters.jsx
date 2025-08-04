"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, MapPin, Home, Bed, Zap, TrendingDown, Crown } from "lucide-react"

const propertyTypes = [
  { value: "all", label: "All Types", icon: "🏠" },
  { value: "apartment", label: "Apartment", icon: "🏢" },
  { value: "villa", label: "Villa", icon: "🏡" },
  { value: "penthouse", label: "Penthouse", icon: "🏰" },
  { value: "studio", label: "Studio", icon: "🏠" },
]

const cities = [
  { name: "Mumbai", color: "text-blue-600" },
  { name: "Bangalore", color: "text-green-600" },
  { name: "Delhi", color: "text-red-600" },
  { name: "Gurgaon", color: "text-purple-600" },
  { name: "Pune", color: "text-orange-600" },
  { name: "Chennai", color: "text-teal-600" },
  { name: "Hyderabad", color: "text-indigo-600" },
  { name: "Kolkata", color: "text-pink-600" },
]

export default function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    city: "all",
    minPrice: 0,
    maxPrice: 50000000,
    propertyType: "all",
    minBedrooms: 0,
  })

  const [priceDebounceTimer, setPriceDebounceTimer] = useState(null)

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const handlePriceRangeChange = useCallback(
    (values) => {
      setFilters((prev) => ({
        ...prev,
        minPrice: values[0],
        maxPrice: values[1],
      }))

      if (priceDebounceTimer) {
        clearTimeout(priceDebounceTimer)
      }

      const newTimer = setTimeout(() => {
        onSearch({
          ...filters,
          minPrice: values[0],
          maxPrice: values[1],
        })
      }, 500)

      setPriceDebounceTimer(newTimer)
    },
    [filters, onSearch, priceDebounceTimer],
  )

  const handleSearch = useCallback(() => {
    onSearch(filters)
  }, [filters, onSearch])

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`
    } else {
      return `₹${price.toLocaleString()}`
    }
  }

  const getPriceRangeColor = (minPrice, maxPrice) => {
    const avgPrice = (minPrice + maxPrice) / 2
    if (avgPrice < 10000000) return "from-green-400 to-green-600" // Budget-friendly
    if (avgPrice < 25000000) return "from-blue-400 to-blue-600" // Mid-range
    return "from-purple-400 to-purple-600" // Premium
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Find Your Dream Home
        </h2>
        <p className="text-gray-600 text-sm">Search from thousands of properties</p>
      </div>

      {/* Location with Color Psychology */}
      <div className="space-y-2">
        <Label htmlFor="city" className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-blue-600" />
          Location
        </Label>
        <Select value={filters.city} onValueChange={(value) => handleFilterChange("city", value)}>
          <SelectTrigger suppressHydrationWarning className="border-blue-200 focus:border-blue-500 focus:ring-blue-200">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🌍 All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                <span className={city.color}>📍 {city.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type with Icons */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Home className="h-4 w-4 text-green-600" />
          Property Type
        </Label>
        <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange("propertyType", value)}>
          <SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <span className="flex items-center gap-2">
                  {type.icon} {type.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bedrooms with Warm Colors */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Bed className="h-4 w-4 text-orange-600" />
          Min Bedrooms
        </Label>
        <Select
          value={filters.minBedrooms.toString()}
          onValueChange={(value) => handleFilterChange("minBedrooms", Number.parseInt(value))}
        >
          <SelectTrigger className="border-orange-200 focus:border-orange-500 focus:ring-orange-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">🏠 Any</SelectItem>
            <SelectItem value="1">🛏️ 1+</SelectItem>
            <SelectItem value="2">🛏️🛏️ 2+</SelectItem>
            <SelectItem value="3">🛏️🛏️🛏️ 3+</SelectItem>
            <SelectItem value="4">🛏️🛏️🛏️🛏️ 4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic Price Range with Color Psychology */}
      <div className="space-y-4">
        <Label className="text-sm font-medium flex items-center gap-2">
          💰 Price Range
          <div
            className={`w-3 h-3 rounded-full bg-gradient-to-r ${getPriceRangeColor(filters.minPrice, filters.maxPrice)}`}
          ></div>
        </Label>
        <div className="px-2">
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={handlePriceRangeChange}
            max={50000000}
            min={0}
            step={1000000}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-green-600 font-semibold">{formatPrice(filters.minPrice)}</span>
          <span className="text-red-600 font-semibold">{formatPrice(filters.maxPrice)}</span>
        </div>
      </div>

      {/* Enhanced Search Button */}
      <Button
        onClick={handleSearch}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      >
        <Search className="h-4 w-4 mr-2" />
        Search Properties
      </Button>

      {/* Color-Coded Quick Filters */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">⚡ Quick Filters</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters((prev) => ({ ...prev, maxPrice: 10000000 }))
            }}
            className="text-xs border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
          >
            <TrendingDown className="h-3 w-3 mr-1" />
            Under ₹1Cr
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters((prev) => ({ ...prev, propertyType: "apartment", minBedrooms: 2 }))
            }}
            className="text-xs border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
          >
            🏢 2BHK Apt
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters((prev) => ({ ...prev, propertyType: "villa" }))
            }}
            className="text-xs border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
          >
            <Crown className="h-3 w-3 mr-1" />
            Villas Only
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters((prev) => ({ ...prev, city: "Mumbai" }))
            }}
            className="text-xs border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400"
          >
            <Zap className="h-3 w-3 mr-1" />
            Mumbai
          </Button>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
        <div className="text-xs text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">Verified Properties</span>
          </div>
          <div className="text-gray-600">✓ Legal verification ✓ Price transparency</div>
        </div>
      </div>
    </div>
  )
}
