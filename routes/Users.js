import express from "express";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// GET /api/users/me — profile including region
// Aleena
router.get("/me", isAuthenticated, (req, res) => {
  // req.user is already deserialized (passwordHash stripped)
  res.json({ user: req.user });
});

// PUT /api/users/me — update region/profile
// Aleena
router.put("/me", isAuthenticated, async (req, res) => {
  // Aleena: if zip changed, re-resolve zone + frost dates
  // (phzmapi + FarmSense), then updateUser().
  res.status(501).json({ message: "Not implemented yet" });
});

export default router;
