"use client";

import ResultIcon from "./ResultIcon";

// v8 · Results are decorative, accessible and tied to the specific logged day.
export default function ResultCard({ lastResult, k, idx }) {
  const r = lastResult;
  if (!r || r.k !== k || r.idx !== idx) return null;

  const type = r.v === 3 ? "great" : r.v === 2 ? "success" : r.v === 1 ? "missed" : "cleared";
  const heading =
    r.v === 3 ? "Big success!" : r.v === 2 ? "Success!" : r.v === 1 ? "A rest or a reset — tomorrow is another day ♡" : "Entry cleared";
  const intro =
    r.v === 3
      ? "Extra effort pays off!"
      : r.v === 2
      ? "Progress made, one day at a time."
      : r.v === 1
      ? "Missing a day is part of real life."
      : "Your progress has been recalculated.";

  const rewards = [];
  if (r.points) rewards.push(`Practice ${r.points > 0 ? "+" : ""}${r.points} pts`);
  if (r.gold) rewards.push(`Gold ${r.gold > 0 ? "+" : ""}${r.gold}G`);
  if (r.stress) rewards.push(`Stress ${r.stress > 0 ? "+" : ""}${r.stress}`);
  if (r.rankChange) rewards.push(r.rankChange);
  rewards.push(...r.stats);

  return (
    <div className={`result-card ${type}`} role="status">
      {(r.v === 2 || r.v === 3) && (
        <div className="result-seal">
          <ResultIcon value={r.v} />
        </div>
      )}
      <div className="result-heading">{heading}</div>
      <p className="result-detail">{intro}</p>
      {rewards.length > 0 && (
        <div className="result-rewards">
          {rewards.map((t, i) => (
            <span key={i} className={t.startsWith("Rank up") ? "rank-up" : undefined}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
