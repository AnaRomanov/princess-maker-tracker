"use client";

import { MN, WHEN } from "@/lib/gameConfig";

export default function Hud({ today, cb, gold, stress }) {
  const todayText = `${today.getDate()} ${MN[today.getMonth()].slice(0, 3)} ${today.getFullYear()}`;
  const todayBlockText = `${WHEN[cb.i]} ${MN[cb.m]} · day ${cb.idx + 1} of ${cb.R.len}`;
  // "Condition" is the inverse of the underlying stress value: full bar = calm,
  // empty bar = burnt out, matching Princess Maker's gauge convention. The
  // stress value and its burnout thresholds are unchanged — only the display is flipped.
  const condition = 100 - stress;
  const barClass = stress >= 80 ? "hot" : stress >= 60 ? "warn" : "";
  const alertText = stress >= 80 ? "Burnt out! Gains are halved until you rest with Free Time." : gold < 0 ? "The purse is empty. Work a job block to pay for classes." : null;

  return (
    <section className="win hud" aria-label="Status">
      <div className="date">
        <b>{todayText}</b>
        <span>{todayBlockText}</span>
      </div>
      <div className="meter">
        <div className="meter-top">
          <span>Condition</span>
          <span className="num">{condition} / 100</span>
        </div>
        <div className="bar">
          <i className={barClass} style={{ width: `${condition}%` }} />
        </div>
      </div>
      <div className="purse">
        <span className="coin" aria-hidden="true" />
        <b className={`num${gold < 0 ? " debt" : ""}`}>{gold}</b>
        <span className="num" style={{ color: "var(--muted)", fontSize: ".8rem" }}>
          G
        </span>
      </div>
      {alertText && <p className="alert">{alertText}</p>}
    </section>
  );
}
