import { getDb } from "../db/connection.js";

const windows = () => getDb().collection("plantingWindows");

function parseLocal(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function addWeeks(ymd, weeks) {
  const d = parseLocal(ymd);
  d.setDate(d.getDate() + weeks * 7);
  return d.toLocaleDateString("en-CA");
}

export const findWindowsByPlant = async (plantId) => {
  return windows()
    .find({ plantId: Number(plantId) })
    .toArray();
};

export const windowToDates = (window, lastFrostDate) => ({
  ...window,
  startDate: addWeeks(lastFrostDate, window.startOffsetWeeks),
  endDate: addWeeks(lastFrostDate, window.endOffsetWeeks),
  flexStartDate: addWeeks(
    lastFrostDate,
    window.startOffsetWeeks - (window.flexWeeksBefore || 0)
  ),
  flexEndDate: addWeeks(
    lastFrostDate,
    window.endOffsetWeeks + (window.flexWeeksAfter || 0)
  ),
});

export const findPlantsPlantableInWeek = async (lastFrostDate, weekStart) => {
  const weekEnd = addWeeks(weekStart, 1);
  const all = await windows().find({}).toArray();

  const byPlant = new Map();
  for (const w of all) {
    const dated = windowToDates(w, lastFrostDate);
    if (!(dated.flexStartDate < weekEnd && dated.flexEndDate >= weekStart))
      continue;
    dated.coreMatch = dated.startDate < weekEnd && dated.endDate >= weekStart;
    if (!byPlant.has(w.plantId)) byPlant.set(w.plantId, []);
    byPlant.get(w.plantId).push(dated);
  }
  return byPlant;
};
