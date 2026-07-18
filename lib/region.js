const PHZM_BASE = "https://phzmapi.org";

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
  11: { last: [1, 1], first: [12, 31] },
  12: { last: [1, 1], first: [12, 31] },
  13: { last: [1, 1], first: [12, 31] },
};

async function fetchJson(url, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchZone(zip) {
  const data = await fetchJson(`${PHZM_BASE}/${zip}.json`);
  return data?.zone ?? null;
}

function zoneNumber(zone) {
  if (!zone) return null;
  const match = String(zone).match(/^\d+/);
  return match ? Number(match[0]) : null;
}

function toISO([month, day]) {
  const year = new Date().getFullYear();
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function estimateFrostDates(zone) {
  const n = zoneNumber(zone);
  const entry = n != null ? FROST_BY_ZONE[n] : null;
  if (!entry) return { lastFrost: null, firstFrost: null };
  return { lastFrost: toISO(entry.last), firstFrost: toISO(entry.first) };
}

/**
 * Resolve a ZIP code into a region object.
 * Always returns an object and missing pieces are null.
 * @param {string} zip
 * @returns {Promise<{zip, zone, lastFrost, firstFrost}>}
 */
export async function resolveRegion(zip) {
  const zone = await fetchZone(zip);
  const { lastFrost, firstFrost } = estimateFrostDates(zone);
  return { zip, zone, lastFrost, firstFrost };
}
