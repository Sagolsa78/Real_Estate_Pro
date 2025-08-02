import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Star, Navigation, Phone, Globe, Heart, Shield, Utensils } from "lucide-react"

export default function AmenityList({ amenities, loading, propertyLocation, activeTypes, onTypeToggle }) {
  const amenityConfig = {
    hospital: {
      icon: "🏥",
      color: "border-red-200 bg-red-50",
      textColor: "text-red-700",
      buttonColor: "bg-red-500 hover:bg-red-600",
      iconComponent: Shield,
    },
    school: {
      icon: "🏫",
      color: "border-blue-200 bg-blue-50",
      textColor: "text-blue-700",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
      iconComponent: Heart,
    },
    restaurant: {
      icon: "🍽️",
      color: "border-green-200 bg-green-50",
      textColor: "text-green-700",
      buttonColor: "bg-green-500 hover:bg-green-600",
      iconComponent: Utensils,
    },
    shopping: {
      icon: "🛍️",
      color: "border-purple-200 bg-purple-50",
      textColor: "text-purple-700",
      buttonColor: "bg-purple-500 hover:bg-purple-600",
      iconComponent: MapPin,
    },
    transport: {
      icon: "🚌",
      color: "border-orange-200 bg-orange-50",
      textColor: "text-orange-700",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      iconComponent: Navigation,
    },
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            Loading Amenities...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!amenities) {
    return (
      <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <MapPin className="h-5 w-5 text-blue-600" />
            Nearby Amenities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏠</div>
            <p className="text-gray-600">Select a property to view nearby amenities</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const allAmenities = Object.entries(amenities)
    .flatMap(([type, items]) => items.map((item) => ({ ...item, type })))
    .sort((a, b) => a.distance - b.distance)

  const getWalkabilityScore = () => {
    const totalAmenities = allAmenities.length
    const nearbyAmenities = allAmenities.filter((a) => a.distance < 1).length
    return Math.min(Math.round((nearbyAmenities / totalAmenities) * 100), 100)
  }

  const walkabilityScore = getWalkabilityScore()
  const getScoreColor = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-500"
    if (score >= 60) return "from-yellow-500 to-orange-500"
    return "from-red-500 to-pink-500"
  }

  return (
    <Card className="h-fit bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Nearby Amenities
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              🌟 All
            </TabsTrigger>
            <TabsTrigger value="essential" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              🚨 Essential
            </TabsTrigger>
            <TabsTrigger value="lifestyle" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              🎯 Lifestyle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            <div className="max-h-96 overflow-y-auto space-y-3">
              {allAmenities.map((amenity, index) => {
                const config = amenityConfig[amenity.type] || amenityConfig.hospital
                const IconComponent = config.iconComponent

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${config.color} hover:shadow-md transition-all duration-200 hover:scale-102`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{config.icon}</span>
                        <div>
                          <h4 className={`font-semibold text-sm ${config.textColor}`}>{amenity.name}</h4>
                          <p className="text-xs text-gray-600 capitalize flex items-center gap-1">
                            <IconComponent className="h-3 w-3" />
                            {amenity.type}
                          </p>
                        </div>
                      </div>
                      {amenity.rating && (
                        <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-300">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {amenity.rating}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                      <div className="flex items-center gap-1 text-blue-600">
                        <MapPin className="h-3 w-3" />
                        <span className="font-medium">{amenity.distance}km</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">{amenity.duration}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-3">{amenity.address}</p>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className={`flex-1 text-xs ${config.buttonColor} text-white shadow-md hover:shadow-lg transition-all duration-200`}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Directions
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs bg-white hover:bg-gray-50">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs bg-white hover:bg-gray-50">
                        <Globe className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="essential" className="space-y-4 mt-4">
            <div className="max-h-96 overflow-y-auto space-y-3">
              {allAmenities
                .filter((a) => ["hospital", "school"].includes(a.type))
                .map((amenity, index) => {
                  const config = amenityConfig[amenity.type]
                  const IconComponent = config.iconComponent

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${config.color} hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{config.icon}</span>
                          <div>
                            <h4 className={`font-semibold text-sm ${config.textColor}`}>{amenity.name}</h4>
                            <p className="text-xs text-gray-600 capitalize flex items-center gap-1">
                              <IconComponent className="h-3 w-3" />
                              {amenity.type}
                            </p>
                          </div>
                        </div>
                        {amenity.rating && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-300">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {amenity.rating}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                        <div className="flex items-center gap-1 text-blue-600">
                          <MapPin className="h-3 w-3" />
                          <span className="font-medium">{amenity.distance}km</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">{amenity.duration}</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className={`w-full text-xs ${config.buttonColor} text-white shadow-md hover:shadow-lg transition-all duration-200`}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Get Directions
                      </Button>
                    </div>
                  )
                })}
            </div>
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-4 mt-4">
            <div className="max-h-96 overflow-y-auto space-y-3">
              {allAmenities
                .filter((a) => ["restaurant", "shopping"].includes(a.type))
                .map((amenity, index) => {
                  const config = amenityConfig[amenity.type]
                  const IconComponent = config.iconComponent

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${config.color} hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{config.icon}</span>
                          <div>
                            <h4 className={`font-semibold text-sm ${config.textColor}`}>{amenity.name}</h4>
                            <p className="text-xs text-gray-600 capitalize flex items-center gap-1">
                              <IconComponent className="h-3 w-3" />
                              {amenity.type}
                            </p>
                          </div>
                        </div>
                        {amenity.rating && (
                          <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-300">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {amenity.rating}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-600 mb-2">
                        <div className="flex items-center gap-1 text-blue-600">
                          <MapPin className="h-3 w-3" />
                          <span className="font-medium">{amenity.distance}km</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">{amenity.duration}</span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className={`w-full text-xs ${config.buttonColor} text-white shadow-md hover:shadow-lg transition-all duration-200`}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Get Directions
                      </Button>
                    </div>
                  )
                })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Walkability Score with Color Psychology */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            🚶‍♂️ Walkability Score
            <Badge className={`bg-gradient-to-r ${getScoreColor(walkabilityScore)} text-white`}>
              {walkabilityScore}/100
            </Badge>
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`bg-gradient-to-r ${getScoreColor(walkabilityScore)} h-3 rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${walkabilityScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            {walkabilityScore >= 80 && "🌟 Excellent - Most errands can be accomplished on foot"}
            {walkabilityScore >= 60 && walkabilityScore < 80 && "👍 Good - Some errands can be accomplished on foot"}
            {walkabilityScore < 60 && "🚗 Car-Dependent - Most errands require a car"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
