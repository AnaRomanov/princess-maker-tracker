// Pure game-logic functions, ported 1:1 from the original index.html script,
// de-globalized so `state` (plan/days) and `TODAY`/`MONTHS` are passed in explicitly.

import {
  ACT,
  ACTS,
  STATS,
  STAT_GROUPS,
  RANKS,
  RANK_PTS,
  MULT,
  DAYF,
  PTS,
  GAIN,
  DROP,
  FEE,
  STRESS,
  STATUS_STYLE,
} from "./gameConfig";

export function emptyState() {
  return { plan: {}, days: {} };
}

export function buildMonths(today) {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    months.push({ y: d.getFullYear(), m: d.getMonth() });
  }
  return months;
}

export function range(y, m, i) {
  const last = new Date(y, m + 1, 0).getDate();
  const s = [1, 11, 21][i];
  const e = i < 2 ? s + 9 : last;
  return { s, e, len: e - s + 1, start: new Date(y, m, s), end: new Date(y, m, e, 23, 59) };
}

export const keyOf = (y, m, i) => `${y}-${m + 1}-${i}`;

export const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const rankOf = (p) => {
  let r = "D";
  RANK_PTS.forEach((t, i) => {
    if (p >= t) r = RANKS[i];
  });
  return r;
};

export function plannedActivity(state, key) {
  return ACT[state.plan[key]];
}

export function marks(state, key) {
  return state.days[key] || [];
}

export function blockResult(state, k, R, today) {
  const d = marks(state, k);
  const logged = d.filter(Boolean).length;
  const worked = d.filter((x) => x >= 2).length;
  const greats = d.filter((x) => x === 3).length;
  const over = today > R.end || logged === R.len;
  if (!logged) return null;
  if (!over) return { label: "In progress", cls: "r-open", worked, logged };
  const rate = worked / R.len;
  if (rate >= 0.8 && greats >= R.len * 0.3) return { label: "Great success", cls: "r-great", worked, logged };
  if (rate >= 0.5) return { label: "Success", cls: "r-success", worked, logged };
  return { label: "Failure", cls: "r-fail", worked, logged };
}

export function compute(state, months, today) {
  const stats = Object.fromEntries(STATS.map((s) => [s, 10]));
  let gold = 100;
  let stress = 20;
  const pts = {};
  const blocks = [];
  for (const { y, m } of months) {
    for (let i = 0; i < 3; i++) {
      const k = keyOf(y, m, i);
      const a = plannedActivity(state, k);
      const d = marks(state, k);
      if (!a || !d.some(Boolean)) continue;
      const R = range(y, m, i);
      let g = 0;
      let burntDays = 0;
      d.forEach((v, idx) => {
        if (idx >= R.len || v < 2) return;
        const r = rankOf(pts[a.id] || 0);
        const mult = MULT[r];
        const burnt = stress >= 80 && a.kind !== "free";
        if (burnt) burntDays++;
        const f = DAYF[v] * (burnt ? 0.5 : 1);
        (a.up || []).forEach((s) => {
          stats[s] += (GAIN[a.kind] || 0) * mult * f / R.len;
        });
        (a.down || []).forEach((s) => {
          stats[s] = Math.max(0, stats[s] - DROP / R.len);
        });
        let dg = 0;
        if (a.kind === "job") dg = (a.pay * mult * DAYF[v]) / R.len;
        if (a.kind === "class") dg = -FEE / R.len;
        g += dg;
        gold += dg;
        stress = Math.min(100, Math.max(0, stress + ((a.stress ?? STRESS[a.kind]) * (a.kind === "free" ? DAYF[v] : 1)) / R.len));
        pts[a.id] = (pts[a.id] || 0) + PTS[v];
      });
      blocks.push({ k, y, m, i, R, a, g: Math.round(g), res: blockResult(state, k, R, today), burntDays });
    }
  }
  Object.keys(stats).forEach((s) => (stats[s] = Math.round(stats[s])));
  return { stats, gold: Math.round(gold), stress: Math.round(stress), pts, blocks };
}

export function currentBlock(today) {
  const y = today.getFullYear();
  const m = today.getMonth();
  const dd = today.getDate();
  const i = dd <= 10 ? 0 : dd <= 20 ? 1 : 2;
  const R = range(y, m, i);
  return { k: keyOf(y, m, i), R, idx: dd - R.s, i, m };
}

export function calendarRecord(state, y, m, day) {
  const i = day <= 10 ? 0 : day <= 20 ? 1 : 2;
  const k = keyOf(y, m, i);
  const a = plannedActivity(state, k);
  const R = range(y, m, i);
  return { k, a, v: a ? marks(state, k)[day - R.s] || 0 : 0, date: new Date(y, m, day), day };
}

export function diaryEntries(state, months, today) {
  const entries = [];
  for (const { y, m } of months) {
    for (let i = 0; i < 3; i++) {
      const k = keyOf(y, m, i);
      const a = plannedActivity(state, k);
      if (!a) continue;
      const R = range(y, m, i);
      marks(state, k).forEach((v, j) => {
        if (v < 1 || v > 3 || j >= R.len) return;
        const date = new Date(y, m, R.s + j);
        if (date > today && !sameDay(date, today)) return;
        entries.push({ a, v, date, stamp: date.getTime() });
      });
    }
  }
  return entries.sort((a, b) => b.stamp - a.stamp);
}

// Applies one daily-log change and returns the new state plus a `lastResult`
// summary describing what changed (points/gold/stress/rank), mirroring the
// before/after diffing the original setDay() performed against globals.
export function applySetDay(state, months, today, k, idx, v) {
  const old = marks(state, k)[idx] || 0;
  if (old === v) return { state, lastResult: null, changed: false };
  const before = compute(state, months, today);
  const a = plannedActivity(state, k);
  const oldRank = a ? rankOf(before.pts[a.id] || 0) : null;
  const d = (state.days[k] || []).slice();
  d[idx] = v;
  while (d.length && !d[d.length - 1]) d.pop();
  const newDays = { ...state.days };
  if (d.length) newDays[k] = d;
  else delete newDays[k];
  const newState = { ...state, days: newDays };
  const after = compute(newState, months, today);
  const newRank = a ? rankOf(after.pts[a.id] || 0) : null;
  const lastResult = {
    k,
    idx,
    v,
    old,
    activity: a?.name || "Activity",
    points: a ? (after.pts[a.id] || 0) - (before.pts[a.id] || 0) : 0,
    gold: after.gold - before.gold,
    stress: after.stress - before.stress,
    rankChange:
      oldRank !== newRank && newRank
        ? `${RANKS.indexOf(newRank) > RANKS.indexOf(oldRank) ? "Rank up" : "Rank adjusted"}: ${newRank}`
        : null,
    stats: STATS.filter((st) => after.stats[st] !== before.stats[st]).map(
      (st) => `${st} ${after.stats[st] > before.stats[st] ? "+" : ""}${after.stats[st] - before.stats[st]}`
    ),
  };
  return { state: newState, lastResult, changed: true };
}

export function statusTitle(c) {
  const groups = Object.entries(STAT_GROUPS).map(([name, stats]) => ({
    name,
    gain: stats.reduce((sum, k) => sum + (c.stats[k] - 10), 0),
  }));
  const total = groups.reduce((sum, g) => sum + g.gain, 0);
  const mastered = ACTS.filter((a) => a.kind !== "free" && rankOf(c.pts[a.id] || 0) === "S").length;
  const nonzero = groups.filter((g) => g.gain > 0).length;
  if (mastered >= 3) return { name: "The Polymath", description: "Many disciplines, mastered with patience and care." };
  if (
    total >= 45 &&
    nonzero === 4 &&
    Math.max(...groups.map((g) => g.gain)) - Math.min(...groups.map((g) => g.gain)) <= total * 0.3
  )
    return { name: "The Renaissance Princess", description: "A life richly balanced across many pursuits." };
  if (total < 5) return { name: "The Beginning of a Story", description: "Every great adventure starts with a first step." };
  const top = groups.slice().sort((a, b) => b.gain - a.gain)[0];
  const names = { Body: "The Adventurer", Mind: "The Scholar", Society: "The Diplomat", Arts: "The Muse" };
  return { name: names[top.name], description: STATUS_STYLE[top.name].line };
}
