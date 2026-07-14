import "dotenv/config";
import { readFile } from "fs/promises";
import { connectToDb, getDb } from "../db/connection.js";

// Barbara — seeds the curated plantingWindows collection.
// Run with: npm run seed
async function seed() {
  await connectToDb();
  const raw = await readFile(
    new URL("./plantingWindows.sample.json", import.meta.url),
    "utf-8"
  );
  const windows = JSON.parse(raw);

  const col = getDb().collection("plantingWindows");
  await col.deleteMany({});
  const result = await col.insertMany(windows);
  console.log(`🌱 Seeded ${result.insertedCount} planting windows`);

  // Barbara: optionally pre-fetch + cache the matching Perenual
  // species here so the demo never depends on the live API.
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
