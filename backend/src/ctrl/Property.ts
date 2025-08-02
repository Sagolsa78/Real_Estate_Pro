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
      page = 1,
      limit = 10,
    } = req.query;

    const filters: any = {};

    if (city) filters['location.city'] = city;
    if (propertyType) filters.propertyType = propertyType;
    if (minBedrooms) filters.bedrooms = { $gte: Number(minBedrooms) };
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(filters)
      .sort(sortBy === 'price' ? { price: 1 } : { listedDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments(filters);

    res.status(200).json({
      data: properties,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error('Property search error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
