import { ACT } from "./gameConfig";
import { emptyState } from "./gameLogic";

// Pre-production clean start: intentionally no migrations or seeded demo activity.
// v3 is distinct from earlier localStorage keys; old experiments remain untouched.
export const STORE = "lifemaker.v3";

function sanitize(data) {
  if (data && typeof data.plan === "object" && data.plan && typeof data.days === "object" && data.days) {
    // Ignore unknown retired activities; there are no historical migrations in v8.
    const plan = Object.fromEntries(Object.entries(data.plan).filter(([, id]) => ACT[id]));
    const days = Object.fromEntries(Object.entries(data.days).filter(([key]) => plan[key]));
    return { plan, days };
  }
  return null;
}

export function loadLocal() {
  try {
    const data = JSON.parse(localStorage.getItem(STORE));
    const clean = sanitize(data);
    if (clean) return clean;
  } catch (e) {
    // ignore corrupt/unavailable storage
  }
  return emptyState();
}

export function saveLocal(state) {
  try {
    localStorage.setItem(STORE, JSON.stringify(state));
  } catch (e) {
    // ignore unavailable storage (private mode, quota, etc.)
  }
}

export function sanitizeRemote(data) {
  return sanitize(data);
}
