"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Calendar, Heart, Share2, Zap, TrendingUp, Star } from "lucide-react"
import { useState } from "react"

export default function PropertyGrid({ properties, loading, error, onPropertyClick, onShowAmenities }) {
  const [favorites, setFavorites] = useState(new Set())

  const toggleFavorite = (propertyId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId)
      } else {
        newFavorites.add(propertyId)
      }
      return newFavorites
    })
  }

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`
    } else {
      return `₹${price.toLocaleString()}`
    }
  }

  const getPropertyTypeColor = (type) => {
    const colors = {
      apartment: "bg-blue-100 text-blue-800 border-blue-200",
      villa: "bg-green-100 text-green-800 border-green-200",
      penthouse: "bg-purple-100 text-purple-800 border-purple-200",
      studio: "bg-orange-100 text-orange-800 border-orange-200",
    }
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getStatusColor = (status) => {
    const colors = {
      available: "bg-green-500 text-white",
      hot: "bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse",
      "great-deal": "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
      pending: "bg-yellow-500 text-white",
      sold: "bg-gray-500 text-white",
    }
    return colors[status] || "bg-blue-500 text-white"
  }

  const getStatusIcon = (status) => {
    const icons = {
      available: "✅",
      hot: "🔥",
      "great-deal": "💎",
      pending: "⏳",
      sold: "✅",
    }
    return icons[status] || "🏠"
  }

  const getPriceCategoryGradient = (category) => {
    const gradients = {
      budget: "from-green-400 to-green-600",
      "mid-range": "from-blue-400 to-blue-600",
      premium: "from-purple-400 to-purple-600",
      luxury: "from-yellow-400 to-orange-500",
    }
    return gradients[category] || "from-gray-400 to-gray-600"
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="animate-pulse">
              <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg font-medium mb-2">❌ Error loading properties</div>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg font-medium mb-2">🔍 No properties found</div>
        <p className="text-gray-600">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map((property) => (
        <Card
          key={property._id}
          className="overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer border-2 hover:border-blue-300 bg-gradient-to-br from-white to-gray-50"
        >
          <div className="relative">
            <img
              src={property.images[0] || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onClick={() => onPropertyClick(property)}
            />

            {/* Status Badge with Color Psychology */}
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className={`${getPropertyTypeColor(property.propertyType)} capitalize font-semibold`}>
                {property.propertyType}
              </Badge>
              {property.isNew && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse">✨ NEW</Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(property._id)
                }}
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    favorites.has(property._id) ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                  }`}
                />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <Share2 className="h-4 w-4 text-gray-600 hover:text-blue-500" />
              </Button>
            </div>

            {/* Status Indicator */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(property.status)}`}>
                {getStatusIcon(property.status)} {property.status.replace("-", " ").toUpperCase()}
              </div>
            </div>

            {/* Deal Score */}
            {property.dealScore > 85 && (
              <div className="absolute bottom-3 right-3">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {property.dealScore}
                </div>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {property.title}
            </h3>

            <div className="flex items-center text-gray-600 mb-3">
              <MapPin className="h-4 w-4 mr-1 text-blue-500" />
              <span className="text-sm">
                {property.location.city}, {property.location.state}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center text-orange-600">
                  <Bed className="h-4 w-4 mr-1" />
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <Bath className="h-4 w-4 mr-1" />
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
                <div className="flex items-center text-green-600">
                  <Square className="h-4 w-4 mr-1" />
                  <span className="font-medium">{property.area} sq ft</span>
                </div>
              </div>
            </div>

            {/* Price Section with Color Psychology */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-2xl font-bold bg-gradient-to-r ${getPriceCategoryGradient(property.priceCategory)} bg-clip-text text-transparent`}
                >
                  {formatPrice(property.price)}
                </span>
                {property.originalPrice > property.price && (
                  <span className="text-sm text-gray-500 line-through">{formatPrice(property.originalPrice)}</span>
                )}
              </div>
              {property.originalPrice > property.price && (
                <div className="text-xs text-green-600 font-semibold">
                  💰 Save ₹{((property.originalPrice - property.price) / 100000).toFixed(1)}L
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Listed {new Date(property.listedDate).toLocaleDateString()}</span>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                {property.status}
              </Badge>
            </div>

            {/* Action Buttons with Color Psychology */}
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => onPropertyClick(property)}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 font-semibold bg-transparent"
                onClick={() => onShowAmenities(property._id)}
              >
                <Zap className="h-4 w-4 mr-1" />
                Amenities
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
