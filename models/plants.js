import { getDb } from "../db/connection.js";

const plants = () => getDb().collection("plants");

export const findPlants = async ({ search, type } = {}) => {
  const filter = {};
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.commonName = { $regex: escaped, $options: "i" };
  }
  if (type) filter.type = type;
  return plants().find(filter).sort({ commonName: 1 }).toArray();
};

export const findPlantById = async (plantId) => {
  return plants().findOne({ _id: Number(plantId) });
};

export const cachePlant = async (plantDoc) => {
  const { _id, ...fields } = plantDoc;
  await plants().updateOne(
    { _id: Number(_id) },
    { $set: { ...fields, cachedAt: new Date() } },
    { upsert: true }
  );
  return plantDoc;
};

export const fetchFromPerenual = async (speciesId) => {
  const key = process.env.PERENUAL_API_KEY;
  if (!key) throw new Error("PERENUAL_API_KEY is not set");

  const url = `https://perenual.com/api/v2/species/details/${speciesId}?key=${key}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Perenual responded ${res.status} for species ${speciesId}`
    );
  }
  const data = await res.json();

  const doc = {
    _id: data.id,
    commonName: data.common_name || "(unnamed)",
    scientificName: Array.isArray(data.scientific_name)
      ? data.scientific_name[0]
      : data.scientific_name || "",
    type: data.type || "",
    imageUrl:
      data.default_image?.regular_url || data.default_image?.small_url || null,
    summary: data.description || "",
    hardiness: {
      min: Number(data.hardiness?.min) || null,
      max: Number(data.hardiness?.max) || null,
    },
  };

  return cachePlant(doc);
};
