import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// GET /api/plants?search=&week=&type= — plant list for Explore.
// Server uses the session user's region to filter what's plantable that week.
// Barbara
router.get("/", isAuthenticated, async (req, res) => {
  const { search, week, type } = req.query;
  // Barbara:
  //  1. findPlants({ search, type }) from the cache
  //  2. if week given: intersect with findPlantsPlantableInWeek(
  //       req.user.region.lastFrost, weekStart)
  //  3. also filter hardiness.min <= user zone <= hardiness.max
  res.status(501).json({ message: "Not implemented yet", got: { search, week, type } });
});

// GET /api/plants/:id — plant summary + when-to-plant windows for user's region
// Barbara
router.get("/:id", isAuthenticated, async (req, res) => {
  // Barbara: findPlantById + findWindowsByPlant, convert offsets to
  // concrete dates using req.user.region.lastFrost
  res.status(501).json({ message: "Not implemented yet" });
});

export default router;
