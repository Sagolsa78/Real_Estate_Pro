import { Request, Response } from 'express';
import { Property } from '../db/Property_models';
import { NearbyAmenity } from '../db/Nearby';
import { GoogleMapsService } from '../srevice/GoogleMap';

const maps = new GoogleMapsService(process.env.GOOGLE_MAPS_API_KEY!);

export const getNearbyAmenities = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { types, radius = 1000, limit = 5 } = req.query;

    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const coordinates = property.coordinates;
    const typesArray = (types as string)?.split(',') ?? [];

    const amenities: Record<string, any[]> = {};

    for (const type of typesArray) {
      // Call Google Maps API
      const places = await maps.searchNearbyPlaces(coordinates, type, Number(radius));
      const topResults = places.slice(0, Number(limit));

      // Get distance and duration
      const destinations = topResults.map(p => p.geometry.location);
      const distances = await maps.calculateDistance(coordinates, destinations);

      amenities[type] = topResults.map((place, i) => ({
        type,
        name: place.name,
        address: place.vicinity,
        distance: distances[i].distance.value,
        duration: distances[i].duration.value,
        placeId: place.place_id,
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
      }));
    }

    res.status(200).json({
      property: {
        id: property._id,
        title: property.title,
        coordinates,
      },
      amenities,
      searchRadius: radius,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Nearby amenities error:', err);
    res.status(500).json({ error: 'Failed to fetch amenities' });
  }
};
