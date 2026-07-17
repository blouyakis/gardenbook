import express from "express";
import { findPlants, findPlantById } from "../models/plants.js";
import {
  findWindowsByPlant,
  windowToDates,
  findPlantsPlantableInWeek,
} from "../models/plantingWindows.js";

const router = express.Router();

function zoneNumber(zone) {
  const match = String(zone || "").match(/^\d+/);
  return match ? Number(match[0]) : null;
}

// GET /api/plants?search=&week=&type= — plant list for Explore.
router.get("/", async (req, res) => {
  try {
    const { search, week, type } = req.query;
    let plants = await findPlants({ search, type });

    const lastFrost = req.user?.region?.lastFrost;
    if (week && lastFrost) {
      // Map<plantId, matchedWindows[]> for windows overlapping this week
      const plantable = await findPlantsPlantableInWeek(lastFrost, week);
      plants = plants
        .filter((p) => plantable.has(p._id))
        .map((p) => {
          const windows = plantable
            .get(p._id)
            .map((w) => windowToDates(w, lastFrost));
          return { ...p, windows, method: windows[0]?.method || null };
        });
    }

    const userZone = zoneNumber(req.user?.region?.zone);
    if (userZone != null) {
      plants = plants.filter(
        (p) =>
          (p.hardiness?.min == null || p.hardiness.min <= userZone) &&
          (p.hardiness?.max == null || p.hardiness.max >= userZone)
      );
    }

    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/plants/:id — plant summary + when-to-plant windows for user's region
router.get("/:id", async (req, res) => {
  try {
    const plant = await findPlantById(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });

    const windows = await findWindowsByPlant(req.params.id);
    const lastFrost = req.user?.region?.lastFrost;
    // Convert week-offset windows to concrete dates when we know the frost date.
    const dated = lastFrost
      ? windows.map((w) => windowToDates(w, lastFrost))
      : windows;

    res.json({ ...plant, windows: dated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
