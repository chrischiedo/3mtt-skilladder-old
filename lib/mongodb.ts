// lib/mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string; // MongoDB connection string
if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to preserve the client instance across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new client for each request
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;