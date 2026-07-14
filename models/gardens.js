import { ObjectId } from "mongodb";
import { getDb } from "../db/connection.js";

// Aleena — gardens CRUD
// Document shape: { _id, userId, name, type, createdAt }
// type: "vegetable" | "herb" | "fruit" | "flower"

const gardens = () => getDb().collection("gardens");

export const GARDEN_TYPES = ["vegetable", "herb", "fruit", "flower"];

export const findGardensByUser = async (userId) => {
  // Aleena
  throw new Error("Not implemented");
};

export const createGarden = async (userId, { name, type }) => {
  // Aleena: validate type against GARDEN_TYPES
  throw new Error("Not implemented");
};

export const updateGarden = async (userId, gardenId, updates) => {
  // Aleena: filter by BOTH _id and userId so users can only
  // touch their own gardens.
  throw new Error("Not implemented");
};

export const deleteGarden = async (userId, gardenId) => {
  // Aleena: also delete this garden's plantings (manual cascade).
  throw new Error("Not implemented");
};
