import "dotenv/config";
import bcrypt from "bcrypt";
import { connectToDb, getDb } from "../db/connection.js";

// Aleena — synthetic data seed for the "1k+ records" rubric item.
// Populates the two collections I own (users + gardens) with well over
// 1,000 documents, plus a known demo account for graders.
//
// Run with: npm run seed:users
//
// Idempotent: it first removes any previously-seeded synthetic accounts
// (email domain @garden.example) and the demo user, then re-inserts, so
// it can be run repeatedly without piling up duplicates. It never touches
// accounts created through the real registration flow.

const SYNTHETIC_DOMAIN = "garden.example";
const DEMO_EMAIL = "demo@neu.edu";
const GARDEN_TYPES = ["vegetable", "herb", "fruit", "flower"];

const FIRST = [
  "Ava", "Liam", "Mia", "Noah", "Zoe", "Kai", "Ivy", "Leo", "Nora", "Eli",
  "Ruby", "Owen", "Iris", "Jude", "Cleo", "Finn", "Wren", "Milo", "Sage", "Rhea",
];
const LAST = [
  "Fields", "Rowe", "Vance", "Bloom", "Frost", "Hale", "Marsh", "Reed",
  "Thorne", "Vale", "Ash", "Crane", "Dell", "Grove", "Lark", "Moss",
];
const GARDEN_ADJ = [
  "Backyard", "Sunny", "Corner", "Raised", "Kitchen", "Front", "Terrace",
  "Rooftop", "Hillside", "Shady", "Riverside", "Windowsill",
];

const pick = (arr, i) => arr[i % arr.length];

async function seed() {
  await connectToDb();
  const db = getDb();
  const users = db.collection("users");
  const gardens = db.collection("gardens");

  // --- Clean out previous synthetic data only ---
  const oldSynthetic = await users
    .find({ email: { $regex: `@${SYNTHETIC_DOMAIN}$` } })
    .toArray();
  const oldIds = oldSynthetic.map((u) => u._id);
  await gardens.deleteMany({ userId: { $in: oldIds } });
  await users.deleteMany({ _id: { $in: oldIds } });

  const demo = await users.findOne({ email: DEMO_EMAIL });
  if (demo) {
    await gardens.deleteMany({ userId: demo._id });
    await users.deleteOne({ _id: demo._id });
  }

  // --- Demo account (real, known password) ---
  const demoHash = await bcrypt.hash("Northeastern", 10);
  const demoDoc = {
    email: DEMO_EMAIL,
    passwordHash: demoHash,
    displayName: "Demo Gardener",
    region: {
      zip: "02116",
      zone: "6b",
      lastFrost: `${new Date().getFullYear()}-04-15`,
      firstFrost: `${new Date().getFullYear()}-10-25`,
    },
    createdAt: new Date(),
  };
  const demoResult = await users.insertOne(demoDoc);
  const demoGardens = GARDEN_TYPES.map((type, i) => ({
    userId: demoResult.insertedId,
    name: `${pick(GARDEN_ADJ, i)} ${type}s`,
    type,
    createdAt: new Date(),
  }));
  await gardens.insertMany(demoGardens);

  // --- Synthetic users + gardens ---
  // Hash one password and reuse it for every synthetic user: these are
  // throwaway demo records, and 350 separate bcrypt hashes would be slow
  // for no benefit. Real users always get their own hash at registration.
  const sharedHash = await bcrypt.hash("password123", 10);

  const USER_COUNT = 350; // -> ~350 users + ~1,050 gardens = 1,400+ docs
  const userDocs = [];
  for (let i = 0; i < USER_COUNT; i++) {
    const name = `${pick(FIRST, i)} ${pick(LAST, Math.floor(i / FIRST.length))}`;
    userDocs.push({
      email: `user${i}@${SYNTHETIC_DOMAIN}`,
      passwordHash: sharedHash,
      displayName: name,
      region: {
        zip: String(2000 + (i % 8000)).padStart(5, "0"),
        zone: `${3 + (i % 8)}${i % 2 ? "a" : "b"}`,
        lastFrost: `${new Date().getFullYear()}-04-${String((i % 27) + 1).padStart(2, "0")}`,
        firstFrost: `${new Date().getFullYear()}-10-${String((i % 27) + 1).padStart(2, "0")}`,
      },
      createdAt: new Date(),
    });
  }
  const userResult = await users.insertMany(userDocs);
  const insertedUserIds = Object.values(userResult.insertedIds);

  // Give each synthetic user 2-4 gardens.
  const gardenDocs = [];
  insertedUserIds.forEach((userId, i) => {
    const count = 2 + (i % 3); // 2, 3, or 4
    for (let g = 0; g < count; g++) {
      const type = pick(GARDEN_TYPES, i + g);
      gardenDocs.push({
        userId,
        name: `${pick(GARDEN_ADJ, i + g)} ${type}s`,
        type,
        createdAt: new Date(),
      });
    }
  });
  const gardenResult = await gardens.insertMany(gardenDocs);

  const total =
    1 + demoGardens.length + userResult.insertedCount + gardenResult.insertedCount;
  console.log(
    `🌱 Seeded ${userResult.insertedCount} users + ${gardenResult.insertedCount} gardens ` +
      `(plus demo account with ${demoGardens.length} gardens) = ${total} documents`
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error("User seed failed:", err);
  process.exit(1);
});
