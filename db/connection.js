import { MongoClient } from "mongodb";

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://localhost:27017"
);

let db = null;

export async function connectToDb() {
  await client.connect();
  db = client.db(process.env.DB_NAME || "gardenbook");

  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("plantings").createIndex({ userId: 1, plantedDate: 1 });

  console.log("🍃 Connected to MongoDB:", db.databaseName);
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not connected yet. Call connectToDb() first.");
  }
  return db;
}
