import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import type { Plant } from '../../types/plant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const { name, description, watering, light } = req.body;
    if (!name || !description || !watering || !light) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('plants').insertOne({
      name,
      description,
      watering,
      light,
    });
    const newPlant: Plant = {
      _id: result.insertedId.toString(),
      name,
      description,
      watering,
      light,
    };
    res.status(201).json(newPlant);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
