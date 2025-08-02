import mongoose, { Schema, Document } from 'mongoose';

export interface INearbyAmenity extends Document {
  propertyId: mongoose.Types.ObjectId;
  type: string; // school, hospital, etc.
  name: string;
  address: string;
  distance: number; // in meters
  duration: number; // in seconds
  placeId: string;
  rating?: number;
  userRatingsTotal?: number;
  createdAt: Date;
}

const NearbyAmenitySchema = new Schema<INearbyAmenity>({
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  type: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String },
  distance: { type: Number, required: true },
  duration: { type: Number, required: true },
  placeId: { type: String, required: true },
  rating: { type: Number },
  userRatingsTotal: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

// Index for caching and quick lookup
NearbyAmenitySchema.index({ propertyId: 1, type: 1 });

export const NearbyAmenity = mongoose.model<INearbyAmenity>('NearbyAmenity', NearbyAmenitySchema);
