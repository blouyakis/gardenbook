import { ObjectId } from "mongodb";
import { getDb } from "../db/connection.js";

// Aleena — auth + user profile
// Document shape (agreed in proposal):
// { _id, email, passwordHash, displayName,
//   region: { zip, zone, lastFrost, firstFrost }, createdAt }

const users = () => getDb().collection("users");

export const createUser = async (user) => {
  // Aleena: resolve ZIP -> zone via phzmapi.org and frost dates via
  // FarmSense here (or in the route) before inserting.
  const doc = { ...user, createdAt: new Date() };
  const result = await users().insertOne(doc);
  return { _id: result.insertedId, ...doc };
};

export const findUserByEmail = async (email) => {
  return users().findOne({ email });
};

export const findUserById = async (id) => {
  return users().findOne({ _id: new ObjectId(id) });
};

export const updateUser = async (id, updates) => {
  // Aleena: whitelist updatable fields (displayName, region) —
  // never let this touch email/passwordHash directly.
  throw new Error("Not implemented");
};

export const deleteUserAndData = async (id) => {
  // Aleena: delete user's gardens and plantings too — the native
  // driver has no cascade, so do it manually here.
  throw new Error("Not implemented");
};
