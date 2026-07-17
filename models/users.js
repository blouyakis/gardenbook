import { ObjectId } from "mongodb";
import { getDb } from "../db/connection.js";

const users = () => getDb().collection("users");

export const createUser = async (user) => {
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
  const allowed = {};
  if (typeof updates.displayName === "string") {
    allowed.displayName = updates.displayName.trim();
  }
  if (updates.region && typeof updates.region === "object") {
    allowed.region = updates.region;
  }

  if (Object.keys(allowed).length === 0) {
    const current = await findUserById(id);
    if (current) delete current.passwordHash;
    return current;
  }

  const updated = await users().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: allowed },
    { returnDocument: "after" }
  );
  if (updated) delete updated.passwordHash;
  return updated;
};

export const updatePassword = async (id, passwordHash) => {
  await users().updateOne(
    { _id: new ObjectId(id) },
    { $set: { passwordHash } }
  );
};

export const deleteUserAndData = async (id) => {
  const _id = new ObjectId(id);
  const db = getDb();

  const plantings = await db.collection("plantings").deleteMany({ userId: _id });
  const gardens = await db.collection("gardens").deleteMany({ userId: _id });
  const user = await db.collection("users").deleteOne({ _id });

  return {
    deletedGardens: gardens.deletedCount,
    deletedPlantings: plantings.deletedCount,
    deletedUser: user.deletedCount,
  };
};
