import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { updateUser } from "../models/users.js";
import { resolveRegion } from "../lib/region.js";

const router = express.Router();

router.get("/me", isAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

router.put("/me", isAuthenticated, async (req, res) => {
  try {
    const { displayName, zip } = req.body;
    const updates = {};

    if (typeof displayName === "string") {
      updates.displayName = displayName;
    }
    if (zip && zip !== req.user.region?.zip) {
      updates.region = await resolveRegion(zip);
    }

    const user = await updateUser(req.user._id, updates);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
