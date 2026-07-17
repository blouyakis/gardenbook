import "dotenv/config";
import { readFile, mkdir, writeFile } from "fs/promises";
import { connectToDb, getDb } from "../db/connection.js";
import { cachePlant } from "../models/plants.js";

// Seeds the plantingWindows collection
// Run with: npm run seed

const IMAGE_DIR = new URL("../frontend/public/plants/", import.meta.url);

async function fetchSpecies(id, key) {
  const res = await fetch(
    `https://perenual.com/api/v2/species/details/${id}?key=${key}`
  );
  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(
      `Could not parse JSON for species (HTTP ${res.status}): ${raw.slice(0, 80)}`
    );
  }
  if (!res.ok || !data.id) {
    throw new Error(`API error (HTTP ${res.status}): ${raw.slice(0, 120)}`);
  }
  return data;
}

async function downloadImage(url, plantId) {
  if (!url) return null;
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Failed to download image: (HTTP ${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(new URL(`${plantId}.jpg`, IMAGE_DIR), buffer);
  return `/plants/${plantId}.jpg`;
}

async function seed() {
  const key = process.env.PERENUAL_API_KEY;
  if (!key) {
    console.error("Error: Set Perenual API key in .env");
    process.exit(1);
  }

  const raw = await readFile(
    new URL("./plantingWindows.sample.json", import.meta.url),
    "utf-8"
  );
  const manifest = JSON.parse(raw);
  if (manifest.some((row) => !row.plantId)) {
    throw new Error("Manifest rows missing ");
  }

  await connectToDb();
  await mkdir(IMAGE_DIR, { recursive: true });

  const uniquePlants = new Map();
  for (const row of manifest) {
    if (!uniquePlants.has(row.plantId)) {
      uniquePlants.set(row.plantId, {
        commonName: row.commonName,
        type: row.type,
      });
    }
  }

  const successful = new Set();
  for (const [plantId, meta] of uniquePlants) {
    try {
      const data = await fetchSpecies(plantId, key);
      const fetched = (data.common_name || "").toLowerCase();
      const expected = meta.commonName.toLowerCase();
      if (!fetched.includes(expected) && !expected.includes(fetched)) {
        console.warn(
          `id ${plantId}: expected "${meta.commonName}" but Perenual has "${data.common_name}" - seeding but verify id`
        );
      }

      let imageUrl = null;
      try {
        imageUrl = await downloadImage(
          data.default_image?.regular_url || data.default_image?.small_url,
          plantId
        );
      } catch (imgErr) {
        console.warn(
          `id ${plantId} (${meta.commonName}): no image - ${imgErr.message}`
        );
      }
      await cachePlant({
        _id: data.id,
        commonName: meta.commonName,
        scientificName: Array.isArray(data.scientific_name)
          ? data.scientific_name[0]
          : data.scientific_name || "",
        type: meta.type,
        imageUrl,
        summary: data.description || "",
        hardiness: {
          min: Number(data.hardiness?.min) || null,
          max: Number(data.hardiness?.max) || null,
        },
      });

      successful.add(plantId);
      console.log(
        `cached ${meta.commonName} (id ${plantId})${imageUrl ? " + image" : ""}`
      );
    } catch (err) {
      console.warn(
        `skipped ${meta.commonName} (id ${plantId}): ${err.message}`
      );
    }
  }

  const windowDocs = manifest
    .filter((row) => successful.has(row.plantId))
    .map(({ plantId, startOffsetWeeks, endOffsetWeeks, method, season }) => ({
      plantId,
      startOffsetWeeks,
      endOffsetWeeks,
      method,
      ...(season && { season }),
    }));

  const col = getDb().collection("plantingWindows");
  await col.deleteMany({ plantId: { $in: [...uniquePlants.keys()] } });
  const result = await col.insertMany(windowDocs);
  console.log(
    `Seeded ${successful.size}/${uniquePlants.size} plants and ${result.insertedCount} planting windows`
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
