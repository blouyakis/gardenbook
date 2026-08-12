import "dotenv/config";

const terms = [
  // fall vegetables
  "valerianella",     // mâche / corn salad
  "endivia",          // endive & escarole (different species from your chicory)
  "anthriscus",       // chervil
  "foeniculum",       // bulb fennel
  // late-summer perennials
  "chrysanthemum",    // garden mums — THE August plant
  "aster",            // fall asters (also try "symphyotrichum")
  "sedum",            // autumn sedums
  "phlox",
  "dianthus",         // 2396 already flashed by in an earlier search
  "rudbeckia",        // black-eyed susan
  "coreopsis",
  "heuchera",         // coral bells
  "nepeta",           // catmint
  // sleepers
  "fragaria",         // strawberry
  "digitalis",        // foxglove — biennial, sown/planted late summer
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
