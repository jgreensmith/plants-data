
import clientPromise from '../lib/mongodb';
import type { MongoClient } from 'mongodb';
import type { Plant } from '../types/plant';
import HomeClient from '../components/HomeClient';

export default async function Home() {
  const client: MongoClient = await (clientPromise as Promise<MongoClient>);
  const db = client.db();
  const plants = await db.collection('plants').find({}).toArray();
  const plantsData: Plant[] = plants.map((plant: any) => ({
    ...plant,
    _id: plant._id.toString(),
  }));
  return <HomeClient plants={plantsData} />;
}
