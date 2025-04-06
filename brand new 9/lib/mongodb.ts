import { MongoClient } from "mongodb"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://hanonymous371:YlKHdJPyd9xJn4aI@cluster0.evl26.mongodb.net/?retryWrites=true&w=majority"
const MONGODB_DB = process.env.MONGODB_DB || "formcraft"

// Check if MongoDB URI is defined
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

// Check if MongoDB DB is defined
if (!MONGODB_DB) {
  throw new Error("Please define the MONGODB_DB environment variable")
}

interface MongoConnection {
  client: MongoClient
  db: any
}

let cachedClient: MongoClient | null = null
let cachedDb: any = null

export async function connectToDatabase(): Promise<MongoConnection> {
  // If we have cached values, use them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // Connect to MongoDB
  const client = new MongoClient(MONGODB_URI)
  await client.connect()
  const db = client.db(MONGODB_DB)

  // Cache the client and db connections
  cachedClient = client
  cachedDb = db

  return { client, db }
}

