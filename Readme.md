# BhuExpert Property Search Application

BhuExpert is a modern, responsive property search application designed to help users find their dream homes with ease. It features a dynamic search interface, a property grid, map integration, and detailed amenity displays. This project demonstrates a pure React frontend interacting with a Node.js Express backend powered by MongoDB.

## Features

*   **Property Search Interface**: Filter properties by city, price range, property type, and number of bedrooms.
*   **Dynamic Property Grid**: Displays properties with essential details, price formatting, and status indicators.
*   **Map Integration**: Visualize properties on a map, with selected property details and nearby amenities.
*   **Amenity Display**: View a categorized list of nearby amenities (hospitals, schools, restaurants) for selected properties, including distance and walkability score.
*   **Pagination**: Navigate through search results efficiently.
*   **Responsive Design**: Optimized for various screen sizes.
*   **Backend Integration**: Fetches property data from a MongoDB database via a Node.js Express API.

## Technologies Used

**Frontend:**
*   React (Pure React setup, no Next.js)
*   Shadcn/ui (for UI components)
*   Tailwind CSS
*   Lucide React (for icons)

**Backend:**
*   Node.js
*   Express.js
*   MongoDB (Database)
*   `mongodb` driver
*   `cors` (for cross-origin requests)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

*   **Node.js**: [Download & Install Node.js](https://nodejs.org/en/download/) (includes npm)
*   **npm**: Node Package Manager (comes with Node.js)
*   **MongoDB**: [Download & Install MongoDB Community Server](https://www.mongodb.com/try/download/community) or use a cloud service like MongoDB Atlas.

## Installation

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Project (or set up files from v0)

If you're using v0, you can download the project code directly. Otherwise, if this were a Git repository, you would clone it:

```
git clone https://github.com/Sagolsa78/Real_Estate_Pro
cd bhuexpert-property-search
```

### 2. Environment Variables

Create a `.env` file in the root directory of your project (where `package.json` is located). Add your MongoDB connection URI and the port for your backend server:

```
MONGODB_URI="mongodb://localhost:27017/bhuexpert"
PORT=5000
```
*   Replace `"mongodb://localhost:27017/bhuexpert"` with your actual MongoDB connection string.
*   `PORT` is the port your backend server will run on. You can change it if 5000 is already in use.

### 3. Install Dependencies

Navigate to the project root directory in your terminal and install both frontend and backend dependencies:

```
npm install
```

### 4. Database Setup

This project uses MongoDB. You need to seed the database with initial property data.

*   **Ensure MongoDB is running**: Start your MongoDB server.
*   **Seed the database**: Run the following script to insert the mock property data into your MongoDB instance. This will create a `bhuexpert` database (if it doesn't exist) and a `properties` collection.

```
    npm run seed-db
```
    You should see console output indicating a successful connection and insertion of properties.

## Running the Application

You need to run the backend server and the frontend application separately.

### 1. Start the Backend Server

Open a new terminal window, navigate to the project root, and run:

```
npm run start-server
\`\`\`
You should see output similar to:
\`\`\`
Connected successfully to MongoDB server
Server running on port 5000


```

### 2. Start the Frontend Application

Open another terminal window, navigate to the project root, and run:

```
npm start
```
This will start the React development server.

### Access the Application

Once both the backend and frontend are running, open your web browser and navigate to:

```
http://localhost:3000


```
(or the port indicated by `npm start` if it's different).

You should now see the BhuExpert Property Search application, fetching data from your local MongoDB instance!

## Project Structure

```

            
├── src/
│   ├── App.jsx             # Main React application component
│   ├── index.js            # React entry point
│   └── components/         # Reusable React components
│       ├── amenity-list.jsx
│       ├── optimized-property-grid.jsx (renamed to property-grid.jsx in current version)
│       ├── pagination.jsx
│       ├── property-grid.jsx
│       ├── property-map.jsx
│       ├── search-filters.jsx
│       └── ui/             # Shadcn/ui components
│           ├── badge.jsx
│           ├── button.jsx
│           ├── card.jsx
│           ├── label.jsx
│           ├── select.jsx
│           ├── slider.jsx
│           ├── tabs.jsx
│           └── toast.jsx
│   └── hooks/              # Custom React hooks
│       ├── use-distance-matrix.jsx
│       ├── use-google-maps.jsx
│       ├── use-mobile.js
│       ├── use-nearby-amenities.jsx
│       └── use-toast.js
│   └── lib/
│       └── utils.js        # Utility functions (e.g., cn for Tailwind)
├── app/                    # Next.js App Router remnants (not actively used in pure React setup)
│   ├── globals.css         # Global Tailwind CSS styles
│   ├── layout.jsx
│   └── page.jsx
├── .env.example            # Example environment variables file
├── package.json            # Project dependencies and scripts
├── jsconfig.json           # JavaScript configuration for VS Code
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This file
```

## Future Enhancements

The following features are planned for future development:

*   Add Google Maps Integration (Active)
*   Add Backend API Integration (Partially done, basic fetch implemented)
*   Add Property Details Modal
*   Add User Authentication
*   Add Advanced Filters (Backend filtering)
*   Add Real Google Maps API
*   Add Marker Clustering
*   Add Virtual Scrolling
*   Add Testing Suite
*   Add Advanced Map Features
