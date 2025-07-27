import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://scoops:ahoyahoy@localhost:27017/plants-data?authSource=admin'; // local docker
const options = {};

//?retryWrites=true&w=majority

let client;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise!;

export default clientPromise;
