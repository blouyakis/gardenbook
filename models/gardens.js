import { ObjectId } from "mongodb";
import { getDb } from "../db/connection.js";

// Aleena — gardens CRUD
// Document shape: { _id, userId, name, type, createdAt }
// type: "vegetable" | "herb" | "fruit" | "flower"

const gardens = () => getDb().collection("gardens");

export const GARDEN_TYPES = ["vegetable", "herb", "fruit", "flower"];
const oid = (v) => (v instanceof ObjectId ? v : new ObjectId(v));

export const findGardensByUser = async (userId) => {
  return gardens()
    .find({ userId: oid(userId) })
    .sort({ createdAt: 1 })
    .toArray();
};

export const createGarden = async (userId, { name, type }) => {
  if (!name || typeof name !== "string" || !name.trim()) {
    throw new Error("Garden name is required");
  }
  if (!GARDEN_TYPES.includes(type)) {
    throw new Error(`Garden type must be one of: ${GARDEN_TYPES.join(", ")}`);
  }

  const doc = {
    userId: oid(userId),
    name: name.trim(),
    type,
    createdAt: new Date(),
  };
  const result = await gardens().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

export const updateGarden = async (userId, gardenId, updates) => {
  const allowed = {};
  if (typeof updates.name === "string" && updates.name.trim()) {
    allowed.name = updates.name.trim();
  }
  if (updates.type !== undefined) {
    if (!GARDEN_TYPES.includes(updates.type)) {
      throw new Error(`Garden type must be one of: ${GARDEN_TYPES.join(", ")}`);
    }
    allowed.type = updates.type;
  }
  if (Object.keys(allowed).length === 0) {
    throw new Error("Nothing to update");
  }

  const updated = await gardens().findOneAndUpdate(
    { _id: oid(gardenId), userId: oid(userId) },
    { $set: allowed },
    { returnDocument: "after" }
  );
  return updated;
};

export const deleteGarden = async (userId, gardenId) => {
  const _id = oid(gardenId);
  const owner = oid(userId);

  const res = await gardens().deleteOne({ _id, userId: owner });
  if (res.deletedCount === 0) return { deleted: false };

  const plantings = await getDb()
    .collection("plantings")
    .deleteMany({ gardenId: _id, userId: owner });

  return { deleted: true, deletedPlantings: plantings.deletedCount };
};
