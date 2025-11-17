import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI; // add your MongoDB URI in .env
const MONGODB_DB = process.env.MONGODB_DB; // database name

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env');
}
if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable in .env');
}

let cachedClient = global.mongoClient;
let cachedDb = global.mongoDb;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  global.mongoClient = client;
  global.mongoDb = db;

  console.log('✅ Connected to MongoDB');
  return { client, db };
      }
