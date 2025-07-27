import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import type { Plant } from '../../types/plant';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const { id, name, description, watering, light } = req.body;
    if (!id || !name || !description || !watering || !light) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('plants').updateOne(
      { _id: new (require('mongodb').ObjectId)(id) },
      { $set: { name, description, watering, light } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.status(200).json({ message: 'Plant updated' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
