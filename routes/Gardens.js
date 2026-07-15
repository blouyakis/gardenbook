import express from "express";
import { ObjectId } from "mongodb";
import { isAuthenticated } from "../middleware/auth.js";
// TEST SCAFFOLD: Barbara's planting models, wired below so Aleena can test the
// add-to-garden loop. Barbara owns the real route implementations.
import {
  createPlanting,
  updatePlanting,
  deletePlanting,
} from "../models/plantings.js";
import {
  findGardensByUser,
  createGarden,
  updateGarden,
  deleteGarden,
  GARDEN_TYPES,
} from "../models/gardens.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/", async (req, res) => {
  try {
    const gardens = await findGardensByUser(req.user._id);
    res.json({ gardens });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }
    if (!GARDEN_TYPES.includes(type)) {
      return res
        .status(400)
        .json({ message: `Type must be one of: ${GARDEN_TYPES.join(", ")}` });
    }
    const garden = await createGarden(req.user._id, { name, type });
    res.status(201).json({ garden });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid garden id" });
    }
    const garden = await updateGarden(req.user._id, req.params.id, req.body);
    if (!garden) {
      return res.status(404).json({ message: "Garden not found" });
    }
    res.json({ garden });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid garden id" });
    }
    const result = await deleteGarden(req.user._id, req.params.id);
    if (!result.deleted) {
      return res.status(404).json({ message: "Garden not found" });
    }
    res.json({ message: "Garden deleted", ...result });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ---- Plantings (nested under a garden) ----
// TEST SCAFFOLD — wires Barbara's plantings model so the add/edit/remove loop
// works for Aleena's testing. Barbara replaces with her real implementations.

// Confirm the garden exists and belongs to the signed-in user.
async function ownsGarden(req) {
  if (!ObjectId.isValid(req.params.gardenId)) return false;
  const { getDb } = await import("../db/connection.js");
  const g = await getDb()
    .collection("gardens")
    .findOne({
      _id: new ObjectId(req.params.gardenId),
      userId: req.user._id,
    });
  return Boolean(g);
}

router.post("/:gardenId/plantings", async (req, res) => {
  try {
    if (!(await ownsGarden(req))) {
      return res.status(404).json({ message: "Garden not found" });
    }
    const { plantId, plantedDate, notes } = req.body;
    if (!plantId || !plantedDate) {
      return res
        .status(400)
        .json({ message: "plantId and plantedDate are required" });
    }
    const planting = await createPlanting(req.user._id, req.params.gardenId, {
      plantId,
      plantedDate,
      notes,
    });
    res.status(201).json({ planting });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:gardenId/plantings/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid planting id" });
    }
    const planting = await updatePlanting(
      req.user._id,
      req.params.gardenId,
      req.params.id,
      req.body
    );
    if (!planting) return res.status(404).json({ message: "Planting not found" });
    res.json({ planting });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/:gardenId/plantings/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid planting id" });
    }
    const removed = await deletePlanting(
      req.user._id,
      req.params.gardenId,
      req.params.id
    );
    if (!removed) return res.status(404).json({ message: "Planting not found" });
    res.json({ message: "Planting removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
