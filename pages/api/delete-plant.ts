import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const { id } = req.query;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Missing or invalid id' });
    }
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('plants').deleteOne({ _id: new (require('mongodb').ObjectId)(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.status(200).json({ message: 'Plant deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
