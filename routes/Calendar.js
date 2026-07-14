import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.use(isAuthenticated);

// GET /api/calendar?week=YYYY-MM-DD — MyGarden weekly view, all gardens
// Barbara
router.get("/", async (req, res) => {
  const { week } = req.query;
  // Barbara: findPlantingsInWeek(req.user._id, weekStart, weekEnd),
  // join plant names/types from the plants cache, group by day.
  res.status(501).json({ message: "Not implemented yet", got: { week } });
});

// GET /api/calendar/export?week=&gardenId= — PDF via PDFKit
// NOTE: this MUST be declared before "/:gardenId" or "export" will be
// swallowed by the param route.
// Aleena
router.get("/export", async (req, res) => {
  // Aleena: build the weekly view (reuse my aggregation),
  // stream a PDF: res.setHeader("Content-Type", "application/pdf"),
  // doc.pipe(res), 7-column week layout, doc.end().
  res.status(501).json({ message: "Not implemented yet" });
});

// GET /api/calendar/:gardenId?week= — weekly view for one garden
// Barbara
router.get("/:gardenId", async (req, res) => {
  // Barbara: same as "/" but scoped to gardenId
  res.status(501).json({ message: "Not implemented yet" });
});

export default router;
