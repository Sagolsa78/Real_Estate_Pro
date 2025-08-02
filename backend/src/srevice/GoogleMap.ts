import axios from 'axios';

interface LatLng {
  lat: number;
  lng: number;
}

export class GoogleMapsService {
  constructor(private apiKey: string) {}

  async searchNearbyPlaces(
    location: LatLng,
    type: string,
    radius: number
  ): Promise<any[]> {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const response = await axios.get(url, {
      params: {
        location: `${location.lat},${location.lng}`,
        radius,
        type,
        key: this.apiKey,
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }

    return response.data.results;
  }

  async calculateDistance(
    origin: LatLng,
    destinations: LatLng[]
  ): Promise<{ distance: { text: string; value: number }; duration: { text: string; value: number } }[]> {
    const destStr = destinations.map(d => `${d.lat},${d.lng}`).join('|');
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;
    const response = await axios.get(url, {
      params: {
        origins: `${origin.lat},${origin.lng}`,
        destinations: destStr,
        key: this.apiKey,
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Distance Matrix API error: ${response.data.status}`);
    }

    const elements = response.data.rows[0].elements;
    return elements.map((e: any) => ({
      distance: e.distance,
      duration: e.duration,
    }));
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    const url = `https://maps.googleapis.com/maps/api/place/details/json`;
    const response = await axios.get(url, {
      params: {
        place_id: placeId,
        key: this.apiKey,
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Place Details API error: ${response.data.status}`);
    }

    return response.data.result;
  }
}
