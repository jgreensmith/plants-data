
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import clientPromise from '../../lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'public/uploads');
  form.keepExtensions = true;
  await fs.mkdir(form.uploadDir, { recursive: true });

  form.parse(req, async (
    err: any,
    fields: formidable.Fields,
    files: formidable.Files
  ) => {
    if (err) return res.status(500).json({ message: 'Upload error' });
    const { name, description, watering, light } = fields as Record<string, string>;
    if (!name || !description || !watering || !light || !files.image) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
    const allowedExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(imageFile.originalFilename || '').toLowerCase();
    if (!allowedExt.includes(ext)) {
      return res.status(400).json({ message: 'Invalid image file type' });
    }
    const fileName = `${Date.now()}_${imageFile.originalFilename}`;
    const filePath = path.join(form.uploadDir, fileName);
    await fs.rename(imageFile.filepath, filePath);
    const imageUrl = `/uploads/${fileName}`;
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('plants').insertOne({
      name,
      description,
      watering,
      light,
      imageUrl,
    });
    res.status(201).json({
      _id: result.insertedId.toString(),
      name,
      description,
      watering,
      light,
      imageUrl,
    });
  });
}
