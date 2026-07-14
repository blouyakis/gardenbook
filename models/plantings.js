import { ObjectId } from "mongodb";
import { getDb } from "../db/connection.js";

const plantings = () => getDb().collection("plantings");

export const createPlanting = async (
  userId,
  gardenId,
  { plantId, plantedDate, notes }
) => {
  const doc = {
    userId: new ObjectId(userId),
    gardenId: new ObjectId(gardenId),
    plantId: Number(plantId),
    plantedDate,
    notes: notes || "",
    createdAt: new Date(),
  };
  const result = await plantings().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

export const updatePlanting = async (userId, gardenId, plantingId, updates) => {
  const allowed = {};
  if (updates.plantedDate !== undefined)
    allowed.plantedDate = updates.plantedDate;
  if (updates.notes !== undefined) allowed.notes = updates.notes;

  const result = await plantings().findOneAndUpdate(
    {
      _id: new ObjectId(plantingId),
      userId: new ObjectId(userId),
      gardenId: new ObjectId(gardenId),
    },
    { $set: allowed },
    { returnDocument: "after" }
  );
  return result;
};

export const deletePlanting = async (userId, gardenId, plantingId) => {
  const result = await plantings().deleteOne({
    _id: new ObjectId(plantingId),
    userId: new ObjectId(userId),
    gardenId: new ObjectId(gardenId),
  });
  return result.deletedCount === 1;
};

export const findPlantingsInWeek = async (
  userId,
  weekStart,
  weekEnd,
  gardenId = null
) => {
  const filter = {
    userId: new ObjectId(userId),
    plantedDate: { $gte: weekStart, $lt: weekEnd },
  };
  if (gardenId) filter.gardenId = new ObjectId(gardenId);
  return plantings().find(filter).sort({ plantedDate: 1 }).toArray();
};
