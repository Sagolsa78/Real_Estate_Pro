"use client"

import { memo, useCallback, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Calendar, Heart, Share2 } from "lucide-react"
import { useState } from "react"

const PropertyCard = memo(({ property, isFavorite, onPropertyClick, onShowAmenities, onToggleFavorite }) => {
  const formatPrice = useMemo(() => {
    if (property.price >= 10000000) {
      return `₹${(property.price / 10000000).toFixed(1)}Cr`
    } else if (property.price >= 100000) {
      return `₹${(property.price / 100000).toFixed(1)}L`
    } else {
      return `₹${property.price.toLocaleString()}`
    }
  }, [property.price])

  const getPropertyTypeColor = useMemo(() => {
    const colors = {
      apartment: "bg-blue-100 text-blue-800",
      villa: "bg-green-100 text-green-800",
      penthouse: "bg-purple-100 text-purple-800",
      studio: "bg-orange-100 text-orange-800",
    }
    return colors[property.propertyType] || "bg-gray-100 text-gray-800"
  }, [property.propertyType])

  const handlePropertyClick = useCallback(() => {
    onPropertyClick(property)
  }, [property, onPropertyClick])

  const handleShowAmenities = useCallback(
    (e) => {
      e.stopPropagation()
      onShowAmenities(property._id)
    },
    [property._id, onShowAmenities],
  )

  const handleToggleFavorite = useCallback(
    (e) => {
      e.stopPropagation()
      onToggleFavorite(property._id)
    },
    [property._id, onToggleFavorite],
  )

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
      <div className="relative">
        <img
          src={property.images[0] || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onClick={handlePropertyClick}
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${getPropertyTypeColor} capitalize`}>{property.propertyType}</Badge>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-900">
            {formatPrice}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {property.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {property.location.city}, {property.location.state}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.area} sq ft</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Listed {new Date(property.listedDate).toLocaleDateString()}</span>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-200">
            {property.status}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handlePropertyClick}>
            View Details
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={handleShowAmenities}>
            Amenities
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

PropertyCard.displayName = "PropertyCard"

export default function OptimizedPropertyGrid({ properties, loading, error, onPropertyClick, onShowAmenities }) {
  const [favorites, setFavorites] = useState(new Set())

  const toggleFavorite = useCallback((propertyId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId)
      } else {
        newFavorites.add(propertyId)
      }
      return newFavorites
    })
  }, [])

  const memoizedProperties = useMemo(() => properties, [properties])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
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
        <div className="text-red-500 text-lg font-medium mb-2">Error loading properties</div>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (memoizedProperties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg font-medium mb-2">No properties found</div>
        <p className="text-gray-600">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {memoizedProperties.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          isFavorite={favorites.has(property._id)}
          onPropertyClick={onPropertyClick}
          onShowAmenities={onShowAmenities}
          onToggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  )
}
