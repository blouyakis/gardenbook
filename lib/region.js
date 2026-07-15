// Aleena — region resolution (ZIP -> USDA hardiness zone + frost dates).
//
// Used by POST /api/auth/register and PUT /api/users/me. The zone comes
// from a live lookup (phzmapi.org); frost dates are ESTIMATED from that
// zone. We originally used FarmSense's frost API, but its endpoint
// (api.farmsense.net) has been retired, so we derive frost dates locally
// from the zone instead. This has no network dependency, so it can never
// block registration, and it keeps the same output shape Barbara's
// planting-window math expects (lastFrost/firstFrost as YYYY-MM-DD).
//
// Source: phzmapi.org/{zip}.json -> { zone, coordinates: { lat, lon } }

const PHZM_BASE = "https://phzmapi.org";

// Typical average frost dates by USDA zone number (US, Northern
// Hemisphere). last = last spring frost, first = first fall frost, as
// [month, day]. These are standard zone-guide approximations, not
// station-specific readings. Zones 11+ are effectively frost-free.
const FROST_BY_ZONE = {
  1: { last: [6, 15], first: [8, 15] },
  2: { last: [5, 15], first: [9, 15] },
  3: { last: [5, 15], first: [9, 15] },
  4: { last: [5, 12], first: [9, 21] },
  5: { last: [4, 30], first: [10, 7] },
  6: { last: [4, 15], first: [10, 15] },
  7: { last: [4, 3], first: [10, 29] },
  8: { last: [3, 15], first: [11, 15] },
  9: { last: [2, 15], first: [12, 15] },
  10: { last: [1, 31], first: [12, 20] },
};

// Small helper so a slow phzmapi response can't stall registration.
async function fetchJson(url, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // network error, timeout, or bad JSON -> caller uses null
  } finally {
    clearTimeout(timer);
  }
}

// ZIP -> zone string (e.g. "6b") via phzmapi.org
async function fetchZone(zip) {
  const data = await fetchJson(`${PHZM_BASE}/${zip}.json`);
  return data?.zone ?? null;
}

// Pull the leading integer out of a zone string: "6b" -> 6, "10a" -> 10.
function zoneNumber(zone) {
  if (!zone) return null;
  const match = String(zone).match(/^\d+/);
  return match ? Number(match[0]) : null;
}

// Format [month, day] as a YYYY-MM-DD string for the current year, so
// Barbara's math can `new Date()` it directly.
function toISO([month, day]) {
  const year = new Date().getFullYear();
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// zone string -> { lastFrost, firstFrost }, both YYYY-MM-DD or null.
function estimateFrostDates(zone) {
  const n = zoneNumber(zone);
  const entry = n != null ? FROST_BY_ZONE[n] : null;
  if (!entry) return { lastFrost: null, firstFrost: null }; // frost-free / unknown
  return { lastFrost: toISO(entry.last), firstFrost: toISO(entry.first) };
}

/**
 * Resolve a ZIP code into a region object.
 * Always returns a well-formed object; missing pieces are null.
 * @param {string} zip
 * @returns {Promise<{zip, zone, lastFrost, firstFrost}>}
 */
export async function resolveRegion(zip) {
  const zone = await fetchZone(zip);
  const { lastFrost, firstFrost } = estimateFrostDates(zone);
  return { zip, zone, lastFrost, firstFrost };
}