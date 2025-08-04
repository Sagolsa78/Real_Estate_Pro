import { Request, Response } from 'express';
import { Property } from '../db/Property_models';

export const searchProperties = async (req: Request, res: Response) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      propertyType,
      minBedrooms,
      sortBy = 'listedDate',
      page = '1',
      limit = '10',
    } = req.query as Record<string, string>; // Ensure string type

    const filters: Record<string, any> = {};

    if (city) filters['location.city'] = city;
    if (propertyType) filters.propertyType = propertyType;
    if (minBedrooms) filters.bedrooms = { $gte: Number(minBedrooms) };

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

   const sortOptions: { [key: string]: 1 | -1 } =
  sortBy === 'price'
    ? { price: 1 }
    : sortBy === 'priceDesc'
    ? { price: -1 }
    : { listedDate: -1 }; // default


    const [properties, total] = await Promise.all([
      Property.find(filters).sort(sortOptions).skip(skip).limit(limitNumber),
      Property.countDocuments(filters),
    ]);

    res.status(200).json({
      data: properties,
      total,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (err) {
    console.error('Property search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
