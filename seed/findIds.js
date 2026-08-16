import "dotenv/config";

const terms = [
  // fall vegetables
  "valerianella", // mâche / corn salad
  "endivia", // endive & escarole (different species from your chicory)
  "anthriscus", // chervil
  "foeniculum", // bulb fennel
  // late-summer perennials
  "chrysanthemum", // garden mums — THE August plant
  "aster", // fall asters (also try "symphyotrichum")
  "sedum", // autumn sedums
  "phlox",
  "dianthus", // 2396 already flashed by in an earlier search
  "rudbeckia", // black-eyed susan
  "coreopsis",
  "heuchera", // coral bells
  "nepeta", // catmint
  // sleepers
  "fragaria", // strawberry
  "digitalis", // foxglove — biennial, sown/planted late summer

  // new-catalog expansion (outstanding-items)
  {
    plantId: 1602,
    search: "capsicum annuum",
    commonName: "Bell Pepper",
    type: "vegetable",
    startOffsetWeeks: 2,
    endOffsetWeeks: 4,
    method: "transplant",
    flexWeeksAfter: 2,
  },
  {
    plantId: 859,
    search: "antirrhinum",
    commonName: "Snapdragon",
    type: "flower",
    startOffsetWeeks: -2,
    endOffsetWeeks: 4,
    method: "transplant",
    flexWeeksBefore: 2,
    flexWeeksAfter: 2,
  },
  {
    plantId: 100001,
    manual: true,
    commonName: "Tomato",
    scientificName: "Solanum lycopersicum",
    type: "vegetable",
    summary: "The classic summer crop; set out after all frost danger.",
    startOffsetWeeks: 1,
    endOffsetWeeks: 4,
    method: "transplant",
    flexWeeksBefore: 1,
    flexWeeksAfter: 2,
  },
  {
    plantId: 100002,
    manual: true,
    commonName: "Lettuce",
    scientificName: "Lactuca sativa",
    type: "vegetable",
    summary: "Fast, cool-season salad green; bolts in summer heat.",
    season: "spring",
    startOffsetWeeks: -4,
    endOffsetWeeks: 4,
    method: "direct-sow",
    flexWeeksBefore: 2,
    flexWeeksAfter: 2,
  },
  {
    plantId: 100002,
    manual: true,
    commonName: "Lettuce",
    scientificName: "Lactuca sativa",
    type: "vegetable",
    season: "fall",
    startOffsetWeeks: 10,
    endOffsetWeeks: 14,
    method: "direct-sow",
  },
  {
    plantId: 100003,
    manual: true,
    commonName: "Spinach",
    scientificName: "Spinacia oleracea",
    type: "vegetable",
    summary: "Very cold-hardy green for early spring and fall.",
    season: "spring",
    startOffsetWeeks: -6,
    endOffsetWeeks: 0,
    method: "direct-sow",
    flexWeeksBefore: 1,
    flexWeeksAfter: 1,
  },
  {
    plantId: 100003,
    manual: true,
    commonName: "Spinach",
    scientificName: "Spinacia oleracea",
    type: "vegetable",
    season: "fall",
    startOffsetWeeks: 10,
    endOffsetWeeks: 15,
    method: "direct-sow",
  },
  {
    plantId: 100004,
    manual: true,
    commonName: "Peas",
    scientificName: "Pisum sativum",
    type: "vegetable",
    summary: "Sow as soon as soil can be worked; hates heat.",
    startOffsetWeeks: -6,
    endOffsetWeeks: -2,
    method: "direct-sow",
    flexWeeksBefore: 1,
    flexWeeksAfter: 2,
  },
  {
    plantId: 100005,
    manual: true,
    commonName: "Green Bean",
    scientificName: "Phaseolus vulgaris",
    type: "vegetable",
    summary: "Warm-soil crop; succession-sow for a steady harvest.",
    startOffsetWeeks: 1,
    endOffsetWeeks: 10,
    method: "direct-sow",
    flexWeeksBefore: 1,
    flexWeeksAfter: 2,
  },
  {
    plantId: 100006,
    manual: true,
    commonName: "Radish",
    scientificName: "Raphanus sativus",
    type: "vegetable",
    summary: "Ready in under a month; among the most flexible crops.",
    startOffsetWeeks: -4,
    endOffsetWeeks: 4,
    method: "direct-sow",
    flexWeeksBefore: 2,
    flexWeeksAfter: 4,
  },
  {
    plantId: 100007,
    manual: true,
    commonName: "Potato",
    scientificName: "Solanum tuberosum",
    type: "vegetable",
    summary: "Plant seed potatoes a few weeks before last frost.",
    startOffsetWeeks: -3,
    endOffsetWeeks: 2,
    method: "direct-sow",
    flexWeeksBefore: 1,
    flexWeeksAfter: 1,
  },
  {
    plantId: 100008,
    manual: true,
    commonName: "Corn",
    scientificName: "Zea mays",
    type: "vegetable",
    summary: "Needs warm soil; plant in blocks for pollination.",
    startOffsetWeeks: 1,
    endOffsetWeeks: 6,
    method: "direct-sow",
    flexWeeksBefore: 1,
    flexWeeksAfter: 1,
  },
  {
    plantId: 100009,
    manual: true,
    commonName: "Eggplant",
    scientificName: "Solanum melongena",
    type: "vegetable",
    summary: "Heat lover; transplant well after frost.",
    startOffsetWeeks: 2,
    endOffsetWeeks: 4,
    method: "transplant",
    flexWeeksAfter: 2,
  },
  {
    plantId: 100010,
    manual: true,
    commonName: "Cauliflower",
    scientificName: "Brassica oleracea var. botrytis",
    type: "vegetable",
    summary: "Fussy brassica; steady moisture and cool weather.",
    season: "spring",
    startOffsetWeeks: -2,
    endOffsetWeeks: 2,
    method: "transplant",
  },
  {
    plantId: 100010,
    manual: true,
    commonName: "Cauliflower",
    scientificName: "Brassica oleracea var. botrytis",
    type: "vegetable",
    season: "fall",
    startOffsetWeeks: 8,
    endOffsetWeeks: 12,
    method: "transplant",
  },
  {
    plantId: 100011,
    manual: true,
    commonName: "Winter Squash",
    scientificName: "Cucurbita moschata",
    type: "vegetable",
    summary: "Butternut and kin; long season, stores all winter.",
    startOffsetWeeks: 1,
    endOffsetWeeks: 6,
    method: "direct-sow",
    flexWeeksBefore: 1,
    flexWeeksAfter: 1,
  },
  {
    plantId: 100012,
    manual: true,
    commonName: "Basil",
    scientificName: "Ocimum basilicum",
    type: "herb",
    summary: "Tender heat-loving herb; blackens at the first chill.",
    startOffsetWeeks: 2,
    endOffsetWeeks: 8,
    method: "transplant",
    flexWeeksAfter: 4,
  },
  {
    plantId: 100013,
    manual: true,
    commonName: "Parsley",
    scientificName: "Petroselinum crispum",
    type: "herb",
    summary: "Slow to germinate, tolerant of cold once going.",
    startOffsetWeeks: -4,
    endOffsetWeeks: 6,
    method: "direct-sow",
    flexWeeksBefore: 2,
    flexWeeksAfter: 2,
  },
  {
    plantId: 100014,
    manual: true,
    commonName: "Oregano",
    scientificName: "Origanum vulgare",
    type: "herb",
    hardinessMin: 4,
    hardinessMax: 10,
    summary: "Hardy perennial herb; plant anytime in the growing season.",
    startOffsetWeeks: 0,
    endOffsetWeeks: 8,
    method: "transplant",
    flexWeeksBefore: 2,
    flexWeeksAfter: 4,
  },
  {
    plantId: 100015,
    manual: true,
    commonName: "Thyme",
    scientificName: "Thymus vulgaris",
    type: "herb",
    hardinessMin: 5,
    hardinessMax: 9,
    summary: "Low woody perennial; thrives in lean, well-drained soil.",
    startOffsetWeeks: 0,
    endOffsetWeeks: 8,
    method: "transplant",
    flexWeeksBefore: 2,
    flexWeeksAfter: 4,
  },
  {
    plantId: 100016,
    manual: true,
    commonName: "Sage",
    scientificName: "Salvia officinalis",
    type: "herb",
    hardinessMin: 4,
    hardinessMax: 10,
    summary: "Hardy culinary perennial with gray-green leaves.",
    startOffsetWeeks: 0,
    endOffsetWeeks: 8,
    method: "transplant",
    flexWeeksBefore: 2,
    flexWeeksAfter: 4,
  },
  {
    plantId: 100017,
    manual: true,
    commonName: "Mint",
    scientificName: "Mentha spicata",
    type: "herb",
    hardinessMin: 3,
    hardinessMax: 11,
    summary: "Vigorous spreader; best confined to a pot.",
    startOffsetWeeks: 0,
    endOffsetWeeks: 10,
    method: "transplant",
    flexWeeksBefore: 2,
    flexWeeksAfter: 6,
  },
  {
    plantId: 100018,
    manual: true,
    commonName: "Rosemary",
    scientificName: "Salvia rosmarinus",
    type: "herb",
    summary: "Grown as an annual in the North; overwinter indoors.",
    startOffsetWeeks: 2,
    endOffsetWeeks: 8,
    method: "transplant",
    flexWeeksAfter: 4,
  },
  {
    plantId: 100019,
    manual: true,
    commonName: "Sunflower",
    scientificName: "Helianthus annuus",
    type: "flower",
    summary: "Direct-sow after frost; succession-sow for continuous blooms.",
    startOffsetWeeks: 1,
    endOffsetWeeks: 8,
    method: "direct-sow",
    flexWeeksBefore: 1,
    flexWeeksAfter: 2,
  },
  {
    plantId: 100020,
    manual: true,
    commonName: "Zinnia",
    scientificName: "Zinnia elegans",
    type: "flower",
    summary: "Easy cut flower; blooms until frost.",
    startOffsetWeeks: 1,
    endOffsetWeeks: 8,
    method: "direct-sow",
    flexWeeksBefore: 1,
    flexWeeksAfter: 2,
  },
  {
    plantId: 100021,
    manual: true,
    commonName: "Nasturtium",
    scientificName: "Tropaeolum majus",
    type: "flower",
    summary: "Edible flowers and leaves; thrives on neglect.",
    startOffsetWeeks: 1,
    endOffsetWeeks: 6,
    method: "direct-sow",
    flexWeeksBefore: 1,
    flexWeeksAfter: 2,
  },
  {
    plantId: 100022,
    manual: true,
    commonName: "Lavender",
    scientificName: "Lavandula angustifolia",
    type: "flower",
    hardinessMin: 5,
    hardinessMax: 9,
    summary: "Perennial; demands full sun and sharp drainage.",
    startOffsetWeeks: 0,
    endOffsetWeeks: 8,
    method: "transplant",
    flexWeeksBefore: 2,
    flexWeeksAfter: 4,
  },
  {
    plantId: 100023,
    manual: true,
    commonName: "Pansy",
    scientificName: "Viola × wittrockiana",
    type: "flower",
    summary: "Cold-tolerant color for early spring and fall beds.",
    startOffsetWeeks: -4,
    endOffsetWeeks: 2,
    method: "transplant",
    flexWeeksBefore: 2,
    flexWeeksAfter: 2,
  },
  {
    plantId: 100024,
    manual: true,
    commonName: "Blueberry",
    scientificName: "Vaccinium corymbosum",
    type: "fruit",
    hardinessMin: 3,
    hardinessMax: 8,
    summary: "Acid-soil shrub; plant two varieties for better fruit set.",
    startOffsetWeeks: -2,
    endOffsetWeeks: 8,
    method: "transplant",
    flexWeeksBefore: 2,
    flexWeeksAfter: 6,
  },
  {
    plantId: 100025,
    manual: true,
    commonName: "Raspberry",
    scientificName: "Rubus idaeus",
    type: "fruit",
    hardinessMin: 3,
    hardinessMax: 9,
    summary: "Bramble fruit; plant canes in spring or fall.",
    startOffsetWeeks: -2,
    endOffsetWeeks: 6,
    method: "transplant",
    flexWeeksBefore: 2,
    flexWeeksAfter: 6,
  },
  {
    plantId: 100026,
    manual: true,
    commonName: "Strawberry",
    scientificName: "Fragaria × ananassa",
    type: "fruit",
    hardinessMin: 3,
    hardinessMax: 9,
    summary: "Set crowns out in early spring; fruits for years.",
    startOffsetWeeks: -4,
    endOffsetWeeks: 2,
    method: "transplant",
    flexWeeksBefore: 1,
    flexWeeksAfter: 2,
  },
];

const key = process.env.PERENUAL_API_KEY;
if (!key) {
  console.error(
    "ERROR: PERENUAL_API_KEY is not set.\n" +
      "Check that .env (in the project root) contains a line like:\n" +
      "  PERENUAL_API_KEY=sk-xxxxxxxxxxxx\n" +
      "(variable name, equals sign, no quotes, no spaces)"
  );
  process.exit(1);
}

for (const q of terms) {
  console.log(`\n=== ${q} ===`);

  let res;
  try {
    res = await fetch(
      `https://perenual.com/api/v2/species-list?key=${key}&q=${encodeURIComponent(q)}`
    );
  } catch (err) {
    console.log(`  NETWORK ERROR: ${err.message}`);
    continue;
  }

  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    console.log(
      `  NON-JSON RESPONSE (HTTP ${res.status}): ${raw.slice(0, 120)}`
    );
    continue;
  }

  if (!Array.isArray(data.data)) {
    console.log(`  API ERROR (HTTP ${res.status}): ${JSON.stringify(data)}`);
    continue;
  }

  if (data.data.length === 0) {
    console.log("  (no matches at all for this term)");
    continue;
  }

  const usable = data.data.filter((p) => p.id < 3000);
  if (usable.length === 0) {
    const cheapest = Math.min(...data.data.map((p) => p.id));
    console.log(
      `  (${data.data.length} matches, but none under 3000 — lowest id is ${cheapest})`
    );
    continue;
  }

  for (const p of usable) {
    console.log(`  ${p.id}\t${p.common_name}\t${p.scientific_name?.[0] || ""}`);
  }
}
