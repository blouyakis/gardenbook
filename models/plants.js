import { getDb } from "../db/connection.js";

// Barbara — plant catalog (Perenual cache)
// Document shape: { _id: <perenual species id>, commonName, scientificName,
//   type, imageUrl, summary, hardiness: { min, max }, cachedAt }
// Perenual free tier = 100 req/day -> ALWAYS serve from this cache;
// only hit Perenual on a cache miss (or via the seed script).

const plants = () => getDb().collection("plants");

export const findPlants = async ({ search, type } = {}) => {
  // Barbara: regex/startsWith on commonName for search, equality on type
  throw new Error("Not implemented");
};

export const findPlantById = async (plantId) => {
  // Barbara
  throw new Error("Not implemented");
};

export const cachePlant = async (plantDoc) => {
  // Barbara: upsert with _id = Perenual id, set cachedAt
  throw new Error("Not implemented");
};

export const fetchFromPerenual = async (speciesId) => {
  // Barbara: fetch from Perenual with PERENUAL_API_KEY, map fields
  // to our document shape, then cachePlant().
  throw new Error("Not implemented");
};
