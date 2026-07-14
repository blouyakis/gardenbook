import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";

import { isAuthenticated } from "../middleware/auth.js";
import { findUserByEmail, createUser } from "../models/users.js";

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

    // Aleena: resolve zip -> { zone, lastFrost, firstFrost } via
    // phzmapi.org + FarmSense before creating the user. For now, region
    // stores the raw zip only.
    const user = await createUser({
      email,
      passwordHash: hashedPassword,
      displayName,
      region: { zip, zone: null, lastFrost: null, firstFrost: null },
    });

    delete user.passwordHash;
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /api/auth/login — Passport local strategy, establish session.
// Custom callback (not successRedirect) so the SPA gets JSON back and
// can update React state without a full page reload.
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

// GET /api/auth/session — return current user or 401
router.get("/session", isAuthenticated, (req, res) => {
  delete req.user.passwordHash;
  res.json({ user: req.user });
});

// POST /api/auth/logout — destroy session
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

// PUT /api/auth/password — change password (verify current, hash new)
// Aleena
router.put("/password", isAuthenticated, async (req, res) => {
  // Aleena: bcrypt.compare current password, hash + store the new one
  res.status(501).json({ message: "Not implemented yet" });
});

// DELETE /api/auth/account — delete user + all their data, destroy session
// Aleena
router.delete("/account", isAuthenticated, async (req, res) => {
  // Aleena: call deleteUserAndData, then req.logout
  res.status(501).json({ message: "Not implemented yet" });
});

export default router;
