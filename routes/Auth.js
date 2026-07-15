import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";

import { isAuthenticated } from "../middleware/auth.js";
import {
  findUserByEmail,
  createUser,
  updatePassword,
  deleteUserAndData,
} from "../models/users.js";
import { resolveRegion } from "../lib/region.js";

const router = express.Router();

// POST /api/auth/register — create account
// Aleena
router.post("/register", async (req, res) => {
  try {
    const { email, password, displayName, zip } = req.body;

    if (!email || !password || !displayName || !zip) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const region = await resolveRegion(zip);

    const user = await createUser({
      email,
      passwordHash: hashedPassword,
      displayName,
      region,
    });

    delete user.passwordHash;
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info?.message || "Login failed" });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});

router.get("/session", isAuthenticated, (req, res) => {
  delete req.user.passwordHash;
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }
    res.json({ message: "Logout successful" });
  });
});

router.put("/password", isAuthenticated, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Current and new password are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await findUserByEmail(req.user.email);
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await updatePassword(user._id, newHash);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete("/account", isAuthenticated, async (req, res) => {
  try {
    const summary = await deleteUserAndData(req.user._id);
    req.logout((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Account deleted but logout failed", summary });
      }
      res.json({ message: "Account deleted", summary });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
