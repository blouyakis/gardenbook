import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// All garden + planting routes require login
router.use(isAuthenticated);

// GET /api/gardens — list the user's gardens
// Aleena
router.get("/", async (req, res) => {
  // Aleena: findGardensByUser(req.user._id)
  res.status(501).json({ message: "Not implemented yet" });
});

// POST /api/gardens — create a garden (name, type)
// Aleena
router.post("/", async (req, res) => {
  // Aleena: validate { name, type }, createGarden
  res.status(501).json({ message: "Not implemented yet" });
});

// PUT /api/gardens/:id — rename/update
// Aleena
router.put("/:id", async (req, res) => {
  // Aleena
  res.status(501).json({ message: "Not implemented yet" });
});

// DELETE /api/gardens/:id — delete garden AND its plantings
// Aleena
router.delete("/:id", async (req, res) => {
  // Aleena: manual cascade 
  res.status(501).json({ message: "Not implemented yet" });
});

// ---- Plantings (nested under a garden) ----

// POST /api/gardens/:gardenId/plantings — add a plant with intended date
// Barbara
router.post("/:gardenId/plantings", async (req, res) => {
  // Barbara: verify the garden belongs to req.user first,
  // then createPlanting(req.user._id, gardenId, { plantId, plantedDate, notes })
  res.status(501).json({ message: "Not implemented yet" });
});

// PUT /api/gardens/:gardenId/plantings/:id — change date or notes
// Barbara
router.put("/:gardenId/plantings/:id", async (req, res) => {
  // Barbara
  res.status(501).json({ message: "Not implemented yet" });
});

// DELETE /api/gardens/:gardenId/plantings/:id — remove from garden
// Barbara
router.delete("/:gardenId/plantings/:id", async (req, res) => {
  // Barbara
  res.status(501).json({ message: "Not implemented yet" });
});

export default router;
