import mongoose, { Schema, Document } from 'mongoose';

interface Location {
  city: string;
  state: string;
  pincode: string;
}

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: Location;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sq.ft.
  amenities: string[];
  images: string[];
  listedDate: Date;
  status: 'available' | 'sold' | 'rented';
  coordinates: {
    lat: number;
    lng: number;
  };
}

const PropertySchema = new Schema<IProperty>({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String },
    pincode: { type: String },
  },
  propertyType: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number },
  area: { type: Number },
  amenities: [{ type: String }],
  images: [{ type: String }],
  listedDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['available', 'sold', 'rented'],
    default: 'available',
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
});

// Indexes for efficient search
PropertySchema.index({ 'location.city': 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ propertyType: 1 });
PropertySchema.index({ bedrooms: 1 });
PropertySchema.index({ listedDate: -1 });

export const Property = mongoose.model<IProperty>('Property', PropertySchema);
