import "dotenv/config";
import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import passport from "./config/passport.js";
import { connectToDb } from "./db/connection.js";
import MongoStore from "connect-mongo";

import authRouter from "./routes/Auth.js";
import usersRouter from "./routes/Users.js";
import plantsRouter from "./routes/Plants.js";
import gardensRouter from "./routes/Gardens.js";
import calendarRouter from "./routes/Calendar.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-only-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: process.env.DB_NAME || "gardenbook",
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// API responses depend on session state — never let the browser cache them.
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use("/", express.static("./frontend/dist"));
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/plants", plantsRouter);
app.use("/api/gardens", gardensRouter);
app.use("/api/calendar", calendarRouter);

// SPA fallback (Express 5 splat syntax)
app.get("*splat", function (req, res) {
  res.sendFile("index.html", {
    root: join(__dirname, "./frontend/dist"),
  });
});

// Connect to Mongo first, then start listening
connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🌱 GardenBook server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });
