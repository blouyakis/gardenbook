// import "dotenv/config";
// import { connectToDb, getDb } from "../db/connection.js";

// // ============================================================================
// // TEST SCAFFOLD — Aleena, for local verification only.
// // ----------------------------------------------------------------------------
// // Barbara's real Explore/Plants feature pulls live data from the Perenual API
// // and caches it. That needs her API layer + a key. To let Aleena test HER OWN
// // pieces (PDF export with real plantings, the MyGarden calendar rendering, the
// // add-to-garden loop) WITHOUT waiting on that, this seeds a small fixed set of
// // fake plants, planting windows, and a few plantings for the demo account.
// //
// // Run: npm run seed:testplants   (after npm run seed:users)
// // Remove before submission — Barbara's real seed/API replaces all of this.
// // ============================================================================

// const DEMO_EMAIL = "demo@neu.edu";

// // Fake plant catalog. _id stands in for a Perenual species id.
// const PLANTS = [
//   { _id: 1001, commonName: "Tomato", type: "vegetable", method: "transplant" },
//   { _id: 1002, commonName: "Carrot", type: "vegetable", method: "direct sow" },
//   { _id: 1003, commonName: "Lettuce", type: "vegetable", method: "direct sow" },
//   { _id: 1004, commonName: "Bell Pepper", type: "vegetable", method: "transplant" },
//   { _id: 1005, commonName: "Cucumber", type: "vegetable", method: "direct sow" },
//   { _id: 1006, commonName: "Basil", type: "herb", method: "transplant" },
//   { _id: 1007, commonName: "Cilantro", type: "herb", method: "direct sow" },
//   { _id: 1008, commonName: "Mint", type: "herb", method: "transplant" },
//   { _id: 1009, commonName: "Rosemary", type: "herb", method: "transplant" },
//   { _id: 1010, commonName: "Strawberry", type: "fruit", method: "transplant" },
//   { _id: 1011, commonName: "Blueberry", type: "fruit", method: "transplant" },
//   { _id: 1012, commonName: "Cantaloupe", type: "fruit", method: "direct sow" },
//   { _id: 1013, commonName: "Sunflower", type: "flower", method: "direct sow" },
//   { _id: 1014, commonName: "Marigold", type: "flower", method: "transplant" },
//   { _id: 1015, commonName: "Zinnia", type: "flower", method: "direct sow" },
// ];

// // Monday of the current week as YYYY-MM-DD (matches the app's date format).
// function currentMonday() {
//   const d = new Date();
//   const offset = (d.getDay() + 6) % 7; // 0=Sun..6=Sat -> days since Monday
//   d.setDate(d.getDate() - offset);
//   return d.toLocaleDateString("en-CA");
// }
// function addDays(ymd, n) {
//   const [y, m, day] = ymd.split("-").map(Number);
//   const d = new Date(y, m - 1, day + n);
//   return d.toLocaleDateString("en-CA");
// }

// async function seed() {
//   await connectToDb();
//   const db = getDb();

//   // --- Plants cache ---
//   await db.collection("plants").deleteMany({ _id: { $gte: 1001, $lte: 1999 } });
//   await db.collection("plants").insertMany(
//     PLANTS.map((p) => ({
//       ...p,
//       imageUrl: null, // null -> PlantCard shows its emoji placeholder
//       summary: `${p.commonName} is a ${p.type} you can grow at home. (test data)`,
//       cachedAt: new Date(),
//     }))
//   );

//   // --- Planting windows (offsets in weeks around the last frost) ---
//   await db.collection("plantingWindows").deleteMany({
//     plantId: { $gte: 1001, $lte: 1999 },
//   });
//   await db.collection("plantingWindows").insertMany(
//     PLANTS.map((p) => ({
//       plantId: p._id,
//       method: p.method,
//       // Wide window so most plants show as plantable most weeks (test-friendly).
//       startOffsetWeeks: -4,
//       endOffsetWeeks: 12,
//     }))
//   );

//   // --- A few plantings for the demo account, spread across THIS week ---
//   const demo = await db.collection("users").findOne({ email: DEMO_EMAIL });
//   if (!demo) {
//     console.log("⚠️  No demo account found. Run `npm run seed:users` first.");
//     process.exit(1);
//   }
//   const gardens = await db
//     .collection("gardens")
//     .find({ userId: demo._id })
//     .toArray();
//   const gardenByType = {};
//   for (const g of gardens) gardenByType[g.type] = g;

//   const mon = currentMonday();
//   await db.collection("plantings").deleteMany({ userId: demo._id });

//   // [plantId, type, dayOffsetFromMonday]
//   const samples = [
//     [1001, "vegetable", 0],
//     [1002, "vegetable", 2],
//     [1006, "herb", 1],
//     [1009, "herb", 3],
//     [1010, "fruit", 2],
//     [1013, "flower", 4],
//     [1014, "flower", 4],
//   ];
//   const plantings = samples
//     .filter(([, type]) => gardenByType[type])
//     .map(([plantId, type, offset]) => ({
//       userId: demo._id,
//       gardenId: gardenByType[type]._id,
//       plantId,
//       plantedDate: addDays(mon, offset),
//       notes: "",
//       createdAt: new Date(),
//     }));
//   if (plantings.length) await db.collection("plantings").insertMany(plantings);

//   console.log(
//     `🌼 Seeded ${PLANTS.length} test plants + windows, and ${plantings.length} ` +
//       `plantings for ${DEMO_EMAIL} during the week of ${mon}.`
//   );
//   process.exit(0);
// }

// seed().catch((err) => {
//   console.error("Test-plant seed failed:", err);
//   process.exit(1);
// });
