"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut } from "lucide-react"
import { useState } from "react"

export default function PropertyMap({
  properties,
  selectedProperty,
  nearbyAmenities,
  onPropertySelect,
  onAmenityTypeToggle,
  activeAmenityTypes,
}) {
  const [mapCenter, setMapCenter] = useState({ lat: 19.076, lng: 72.8777 }) // Mumbai center
  const [zoomLevel, setZoomLevel] = useState(10)

  const amenityTypeColors = {
    hospital: "bg-red-500",
    school: "bg-blue-500",
    restaurant: "bg-green-500",
    shopping: "bg-purple-500",
    transport: "bg-orange-500",
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

  return (
    <div className="space-y-4">
      {/* Map Controls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Property Map</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Amenity Type Toggles */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(amenityTypeColors).map((type) => (
              <Button
                key={type}
                size="sm"
                variant={activeAmenityTypes.includes(type) ? "default" : "outline"}
                onClick={() => onAmenityTypeToggle(type)}
                className="capitalize"
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${amenityTypeColors[type]}`}></div>
                {type}
              </Button>
            ))}
          </div>

          {/* Mock Map Container */}
          <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
              {/* Grid lines to simulate map */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                  <div key={`h-${i}`} className="absolute w-full h-px bg-gray-300" style={{ top: `${i * 5}%` }} />
                ))}
                {[...Array(20)].map((_, i) => (
                  <div key={`v-${i}`} className="absolute h-full w-px bg-gray-300" style={{ left: `${i * 5}%` }} />
                ))}
              </div>
            </div>

            {/* Property Markers */}
            {properties.map((property, index) => (
              <div
                key={property._id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                  selectedProperty?._id === property._id ? "scale-125 z-20" : "hover:scale-110 z-10"
                }`}
                style={{
                  left: `${20 + (index % 4) * 20}%`,
                  top: `${20 + Math.floor(index / 4) * 25}%`,
                }}
                onClick={() => onPropertySelect(property)}
              >
                <div className={`relative ${selectedProperty?._id === property._id ? "animate-pulse" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${
                      selectedProperty?._id === property._id ? "bg-blue-600" : "bg-red-500"
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                  </div>
                  {selectedProperty?._id === property._id && (
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 min-w-48 z-30">
                      <h4 className="font-semibold text-sm mb-1">{property.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{property.location.city}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-blue-600">{formatPrice(property.price)}</span>
                        <Badge variant="outline" className="text-xs">
                          {property.bedrooms} BHK
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Amenity Markers */}
            {selectedProperty && nearbyAmenities && (
              <>
                {/* Search Radius Circle */}
                <div
                  className="absolute border-2 border-blue-300 border-dashed rounded-full opacity-50"
                  style={{
                    left: "45%",
                    top: "45%",
                    width: "120px",
                    height: "120px",
                    transform: "translate(-50%, -50%)",
                  }}
                />

                {Object.entries(nearbyAmenities).map(
                  ([type, amenities]) =>
                    activeAmenityTypes.includes(type) &&
                    amenities.map((amenity, index) => (
                      <div
                        key={`${type}-${index}`}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          left: `${50 + (Math.random() - 0.5) * 30}%`,
                          top: `${50 + (Math.random() - 0.5) * 30}%`,
                        }}
                      >
                        <div
                          className={`w-6 h-6 rounded-full ${amenityTypeColors[type]} shadow-md flex items-center justify-center`}
                        >
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white rounded shadow-lg p-2 min-w-32 text-xs opacity-0 hover:opacity-100 transition-opacity z-20">
                          <div className="font-semibold">{amenity.name}</div>
                          <div className="text-gray-600">{amenity.distance}km away</div>
                          {amenity.rating && <div className="text-yellow-600">★ {amenity.rating}</div>}
                        </div>
                      </div>
                    )),
                )}
              </>
            )}

            {/* Map Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <Button size="sm" variant="secondary" className="bg-white shadow-md">
                <Navigation className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Map Legend */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Legend</h4>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Properties</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <span>Selected Property</span>
              </div>
              {Object.entries(amenityTypeColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-4 h-4 ${color} rounded-full`}></div>
                  <span className="capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
