import { MongoClient } from "mongodb"

// Mock data (same as in the application)
const mockProperties = [
  {
    _id: "1",
    title: "Luxury 3BHK Apartment in Bandra West",
    description: "Spacious apartment with modern amenities and sea view",
    price: 25000000,
    originalPrice: 28000000,
    location: { city: "Mumbai", state: "Maharashtra", pincode: "400050" },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    amenities: ["Swimming Pool", "Gym", "Parking", "Security"],
    images: ["/placeholder.svg?height=300&width=400"],
    listedDate: "2024-01-15",
    status: "hot",
    coordinates: { lat: 19.0596, lng: 72.8295 },
    priceCategory: "premium",
    isNew: true,
    dealScore: 85,
  },
  {
    _id: "2",
    title: "Modern 2BHK Villa in Whitefield",
    description: "Independent villa with garden and premium location",
    price: 18000000,
    originalPrice: 18000000,
    location: { city: "Bangalore", state: "Karnataka", pincode: "560066" },
    propertyType: "villa",
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    amenities: ["Garden", "Parking", "Security", "Power Backup"],
    images: ["/placeholder.svg?height=300&width=400"],
    listedDate: "2024-01-20",
    status: "available",
    coordinates: { lat: 12.9698, lng: 77.75 },
    priceCategory: "mid-range",
    isNew: false,
    dealScore: 72,
  },
  {
    _id: "3",
    title: "Spacious 4BHK Penthouse in Gurgaon",
    description: "Premium penthouse with terrace and city view",
    price: 35000000,
    originalPrice: 35000000,
    location: { city: "Gurgaon", state: "Haryana", pincode: "122001" },
    propertyType: "penthouse",
    bedrooms: 4,
    bathrooms: 3,
    area: 2000,
    amenities: ["Terrace", "Gym", "Swimming Pool", "Clubhouse"],
    images: ["/placeholder.svg?height=300&width=400"],
    listedDate: "2024-01-25",
    status: "available",
    coordinates: { lat: 28.4595, lng: 77.0266 },
    priceCategory: "luxury",
    isNew: false,
    dealScore: 90,
  },
  {
    _id: "4",
    title: "Cozy 1BHK Studio in Koramangala",
    description: "Perfect for young professionals, fully furnished",
    price: 8000000,
    originalPrice: 9500000,
    location: { city: "Bangalore", state: "Karnataka", pincode: "560034" },
    propertyType: "studio",
    bedrooms: 1,
    bathrooms: 1,
    area: 600,
    amenities: ["Furnished", "Parking", "Security"],
    images: ["/placeholder.svg?height=300&width=400"],
    listedDate: "2024-02-01",
    status: "great-deal",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    priceCategory: "budget",
    isNew: true,
    dealScore: 95,
  },
  {
    _id: "5",
    title: "Elegant 3BHK Flat in Andheri East",
    description: "Well-connected location with metro connectivity",
    price: 22000000,
    originalPrice: 22000000,
    location: { city: "Mumbai", state: "Maharashtra", pincode: "400069" },
    propertyType: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1100,
    amenities: ["Metro Access", "Gym", "Parking", "Garden"],
    images: ["/placeholder.svg?height=300&width=400"],
    listedDate: "2024-02-05",
    status: "pending",
    coordinates: { lat: 19.1136, lng: 72.8697 },
    priceCategory: "mid-range",
    isNew: false,
    dealScore: 78,
  },
  {
    _id: "6",
    title: "Premium 2BHK in Cyber City",
    description: "Modern apartment in IT hub with all amenities",
    price: 15000000,
    originalPrice: 15000000,
    location: { city: "Gurgaon", state: "Haryana", pincode: "122002" },
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    area: 900,
    amenities: ["IT Hub", "Gym", "Swimming Pool", "Cafeteria"],
    images: ["/placeholder.svg?height=300&width=400"],
    listedDate: "2024-02-10",
    status: "available",
    coordinates: { lat: 28.4949, lng: 77.0787 },
    priceCategory: "mid-range",
    isNew: false,
    dealScore: 80,
  },
]

async function seedDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("Error: MONGODB_URI environment variable is not set.")
    console.error('Please set it to your MongoDB connection string (e.g., "mongodb://localhost:27017/bhuexpert").')
    process.exit(1)
  }

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected successfully to MongoDB server")

    const database = client.db() // Connect to the database specified in the URI, or default if not specified
    const collection = database.collection("properties")

    // Clear existing data (optional, but good for seeding)
    console.log("Clearing existing properties data...")
    await collection.deleteMany({})
    console.log("Existing data cleared.")

    // Insert new mock data
    console.log("Inserting new mock properties data...")
    const result = await collection.insertMany(mockProperties)
    console.log(`${result.insertedCount} properties were inserted.`)
  } catch (err) {
    console.error("An error occurred:", err)
  } finally {
    await client.close()
    console.log("MongoDB connection closed.")
  }
}

seedDatabase()
