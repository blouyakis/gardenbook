import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { findPlants, findPlantById } from "../models/plants.js";
import {
  findWindowsByPlant,
  windowToDates,
} from "../models/plantingWindows.js";

const router = express.Router();

// ============================================================================
// TEST SCAFFOLD (Barbara's routes) — Aleena, local verification only.
// ----------------------------------------------------------------------------
// Wires Barbara's already-written plant models to routes so the Explore page
// renders and the add-to-garden flow works end to end. It reads from the
// (test-seeded) plants cache and does NOT call Perenual or apply the full
// region/week/zone filtering — that's Barbara's real work to finish.
// ============================================================================

// GET /api/plants?search=&week=&type= — plant list for Explore
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const { search, type } = req.query;
    const plants = await findPlants({ search, type });
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/plants/:id — plant summary + when-to-plant windows for user's region
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const plant = await findPlantById(req.params.id);
    if (!plant) return res.status(404).json({ message: "Plant not found" });

    const windows = await findWindowsByPlant(req.params.id);
    const lastFrost = req.user.region?.lastFrost;
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
