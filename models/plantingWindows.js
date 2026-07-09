import { getDb } from "../db/connection.js";

// Barbara — curated planting windows (OUR data, not Perenual's)
// Document shape: { _id, plantId, startOffsetWeeks, endOffsetWeeks, method }
// Offsets are weeks relative to the user's last frost date:
//   negative = before last frost, positive = after.
// Seeded from seed/plantingWindows.sample.json via `npm run seed`.

const windows = () => getDb().collection("plantingWindows");

export const findWindowsByPlant = async (plantId) => {
  // Barbara
  throw new Error("Not implemented");
};

export const findPlantsPlantableInWeek = async (lastFrostDate, weekStart) => {
  // Barbara: the core Explore computation.
  // plantable(window, week) =
  //   lastFrost + startOffsetWeeks <= week <= lastFrost + endOffsetWeeks
  throw new Error("Not implemented");
};
