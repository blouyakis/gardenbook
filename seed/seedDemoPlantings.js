import "dotenv/config";
import { connectToDb, getDb } from "../db/connection.js";

// Demo plantings seed: fills the demo account's gardens with plantings
// from the REAL plant catalog (seeded by `npm run seed`)

// Run order: npm run seed:users -> npm run seed -> npm run seed:demo

const DEMO_EMAIL = "demo@neu.edu";

const SAMPLES = [
  [2251, "vegetable", 0], // Cucumber      Mon
  [1320, "vegetable", 2], // Kale          Wed
  [671, "vegetable", 4], // Scallion      Fri
  [685, "herb", 1], // Chives        Tue
  [834, "herb", 3], // Dill          Thu
  [2250, "fruit", 2], // Melon         Wed
  [1885, "fruit", 5], // Watermelon    Sat
  [1473, "flower", 1], // Marigold      Tue
  [2172, "flower", 4], // Cosmos        Fri
];

function currentMonday() {
  const d = new Date();
  const offset = (d.getDay() + 6) % 7; // 0=Sun..6=Sat -> days since Monday
  d.setDate(d.getDate() - offset);
  return d.toLocaleDateString("en-CA");
}
function addDays(ymd, n) {
  const [y, m, day] = ymd.split("-").map(Number);
  const d = new Date(y, m - 1, day + n);
  return d.toLocaleDateString("en-CA");
}

async function seed() {
  await connectToDb();
  const db = getDb();

  // Find the demo account + gardens
  const demo = await db.collection("users").findOne({ email: DEMO_EMAIL });
  if (!demo) {
    console.log("⚠️  No demo account found. Run `npm run seed:users` first.");
    process.exit(1);
  }
  const gardens = await db
    .collection("gardens")
    .find({ userId: demo._id })
    .toArray();
  const gardenByType = {};
  for (const g of gardens) gardenByType[g.type] = g;

  // Only plant things that exist in the real cache
  const cachedIds = new Set(
    (
      await db
        .collection("plants")
        .find({}, { projection: { _id: 1 } })
        .toArray()
    ).map((p) => p._id)
  );

  const mon = currentMonday();
  await db.collection("plantings").deleteMany({ userId: demo._id });

  const plantings = SAMPLES.filter(
    ([plantId, type]) => cachedIds.has(plantId) && gardenByType[type]
  ).map(([plantId, type, offset]) => ({
    userId: demo._id,
    gardenId: gardenByType[type]._id,
    plantId,
    plantedDate: addDays(mon, offset),
    notes: "",
    createdAt: new Date(),
  }));

  if (plantings.length) await db.collection("plantings").insertMany(plantings);

  const skipped = SAMPLES.length - plantings.length;
  console.log(
    `🌼 Seeded ${plantings.length} demo plantings for ${DEMO_EMAIL}, week of ${mon}` +
      (skipped
        ? ` (${skipped} skipped — plant not in cache or garden type missing)`
        : "")
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error("Demo plantings seed failed:", err);
  process.exit(1);
});
