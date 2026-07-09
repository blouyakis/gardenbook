import { ObjectId } from "mongodb";
import { getDb } from "../db/connection.js";

// Barbara — plantings (the garden<->plant join with a date)
// Document shape: { _id, userId, gardenId, plantId, plantedDate, notes, createdAt }
// userId is denormalized to make the all-gardens calendar one query.

const plantings = () => getDb().collection("plantings");

export const createPlanting = async (userId, gardenId, data) => {
  // Barbara
  throw new Error("Not implemented");
};

export const updatePlanting = async (userId, gardenId, plantingId, updates) => {
  // Barbara: filter by _id + userId + gardenId
  throw new Error("Not implemented");
};

export const deletePlanting = async (userId, gardenId, plantingId) => {
  // Barbara
  throw new Error("Not implemented");
};

export const findPlantingsInWeek = async (userId, weekStart, weekEnd, gardenId = null) => {
  // Barbara: { userId, plantedDate: { $gte: weekStart, $lt: weekEnd } }
  // plus gardenId when provided. Covered by the compound index.
  throw new Error("Not implemented");
};
