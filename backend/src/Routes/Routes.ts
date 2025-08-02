import express from 'express';
import { searchProperties } from '../ctrl/Property';
import { getNearbyAmenities } from '../ctrl/Nearby';

const router = express.Router();

router.get('/api/properties/search', searchProperties);
router.get('/api/properties/:id/nearby-amenities', getNearbyAmenities);

export default router;
