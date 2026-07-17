import express from "express";
import { ObjectId } from "mongodb";
import PDFDocument from "pdfkit";
import { isAuthenticated } from "../middleware/auth.js";
import { getDb } from "../db/connection.js";
import { findPlantingsInWeek } from "../models/plantings.js";

const router = express.Router();

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TYPE_COLORS = {
  vegetable: "#6f9660",
  herb: "#c9963f",
  fruit: "#7c8cc4",
  flower: "#9c7fb5",
};

function weekStartOf(weekParam) {
  const base =
    weekParam && /^\d{4}-\d{2}-\d{2}$/.test(weekParam)
      ? new Date(`${weekParam}T00:00:00Z`)
      : new Date();
  const d = new Date(
    Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate())
  );
  const offset = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - offset);
  return d;
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

router.use(isAuthenticated);

// 7-day array [{ date, label, plantings:[{_id,name,type}] }].
async function buildWeek(userId, week, gardenId = null, type = null) {
  const start = weekStartOf(week);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    return d;
  });
  const startStr = start.toISOString().slice(0, 10);
  const endExclusive = new Date(days[6]);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);

  let gardenScope = gardenId;
  if (!gardenId && type) {
    const typed = await getDb()
      .collection("gardens")
      .find({ userId: new ObjectId(userId), type })
      .toArray();
    gardenScope = typed.map((g) => g._id);
  }

  const plantings = await findPlantingsInWeek(
    userId,
    startStr,
    endExclusive.toISOString().slice(0, 10),
    gardenScope
  );

  // Plant name + type from the plants cache.
  const db = getDb();
  const plantIds = [...new Set(plantings.map((p) => p.plantId))];
  const plantDocs = await db
    .collection("plants")
    .find({ _id: { $in: plantIds } })
    .toArray();
  const plantById = new Map(plantDocs.map((p) => [p._id, p]));

  return days.map((d) => {
    const iso = d.toISOString().slice(0, 10);
    const dayPlantings = plantings
      .filter((p) => p.plantedDate === iso)
      .map((p) => {
        const plant = plantById.get(p.plantId);
        return {
          _id: String(p._id),
          name: plant?.commonName || "Plant",
          type: plant?.type || "vegetable",
        };
      });
    return {
      date: iso,
      label: `${DAY_NAMES[(d.getUTCDay() + 6) % 7]} ${formatDate(d)}`,
      plantings: dayPlantings,
    };
  });
}

router.get("/", async (req, res) => {
  try {
    const week = await buildWeek(
      req.user._id,
      req.query.week,
      null,
      req.query.type
    );
    res.json(week);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/export", async (req, res) => {
  try {
    const { week, gardenId, type } = req.query;
    const db = getDb();
    const userId = req.user._id;
    const start = weekStartOf(week);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setUTCDate(d.getUTCDate() + i);
      return d;
    });

    const startStr = start.toISOString().slice(0, 10);
    const endStr = end.toISOString().slice(0, 10);
    const filter = {
      userId,
      plantedDate: { $gte: startStr, $lt: endStr },
    };
    let scopeLabel = "All gardens";

    if (gardenId && ObjectId.isValid(gardenId)) {
      filter.gardenId = new ObjectId(gardenId);
      const g = await db
        .collection("gardens")
        .findOne({ _id: filter.gardenId, userId });
      scopeLabel = g ? g.name : "Garden";
    } else if (type) {
      const typedGardens = await db
        .collection("gardens")
        .find({ userId, type })
        .toArray();
      filter.gardenId = { $in: typedGardens.map((g) => g._id) };
      scopeLabel = `${type[0].toUpperCase()}${type.slice(1)} gardens`;
    }

    const plantings = await db.collection("plantings").find(filter).toArray();

    const plantIds = [...new Set(plantings.map((p) => p.plantId))];
    const gardenIds = [...new Set(plantings.map((p) => String(p.gardenId)))];

    const plantDocs = await db
      .collection("plants")
      .find({ _id: { $in: plantIds } })
      .toArray();
    const gardenDocs = await db
      .collection("gardens")
      .find({ _id: { $in: gardenIds.map((id) => new ObjectId(id)) } })
      .toArray();

    const plantById = new Map(plantDocs.map((p) => [p._id, p]));
    const gardenById = new Map(gardenDocs.map((g) => [String(g._id), g]));

    const columns = days.map(() => []);
    for (const pl of plantings) {
      const dayIdx = Math.floor(
        (new Date(pl.plantedDate) - start) / (1000 * 60 * 60 * 24)
      );
      if (dayIdx >= 0 && dayIdx < 7) {
        const plant = plantById.get(pl.plantId);
        const garden = gardenById.get(String(pl.gardenId));
        columns[dayIdx].push({
          name: plant?.commonName || "Plant",
          garden: garden?.name || "",
          type: plant?.type || "vegetable",
        });
      }
    }

    const filename = `garden-week-${start.toISOString().slice(0, 10)}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({
      size: "letter",
      layout: "landscape",
      margin: 36,
    });
    doc.pipe(res);

    doc
      .fillColor("#a84a51")
      .fontSize(24)
      .text("GardenBook", { continued: false });
    doc
      .fillColor("#4a3f35")
      .fontSize(13)
      .text(
        `Week of ${formatDate(days[0])} – ${formatDate(days[6])}, ${days[6].getUTCFullYear()}`
      );
    doc.fillColor("#8d7f6f").fontSize(11).text(scopeLabel);
    doc.moveDown(0.5);

    const top = doc.y + 6;
    const left = doc.page.margins.left;
    const usableWidth =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colWidth = usableWidth / 7;
    const gridBottom = doc.page.height - doc.page.margins.bottom;

    days.forEach((day, i) => {
      const x = left + i * colWidth;

      doc.save();
      doc.rect(x, top, colWidth, 26).fill("#f6efdd");
      doc.restore();
      doc
        .fillColor("#4a3f35")
        .fontSize(10)
        .text(`${DAY_NAMES[i]}  ${formatDate(day)}`, x + 4, top + 8, {
          width: colWidth - 8,
        });

      doc
        .rect(x, top, colWidth, gridBottom - top)
        .strokeColor("#dfcf9f")
        .lineWidth(0.5)
        .stroke();

      let y = top + 32;
      for (const item of columns[i]) {
        const chipColor = TYPE_COLORS[item.type] || "#6f9660";
        doc.save();
        doc.roundedRect(x + 3, y, colWidth - 6, 16, 3).fill(chipColor);
        doc.restore();
        doc
          .fillColor("#ffffff")
          .fontSize(8)
          .text(item.name, x + 6, y + 4, {
            width: colWidth - 12,
            height: 12,
            ellipsis: true,
          });
        y += 20;
        if (y > gridBottom - 20) break;
      }
    });

    doc.end();
  } catch (error) {
    if (res.headersSent) return res.end();
    res.status(500).json({ message: "Export failed", error: error.message });
  }
});

router.get("/:gardenId", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.gardenId)) {
      return res.status(400).json({ message: "Invalid garden id" });
    }
    const week = await buildWeek(
      req.user._id,
      req.query.week,
      req.params.gardenId
    );
    res.json(week);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
