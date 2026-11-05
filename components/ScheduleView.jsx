"use client";

import ActivityIcon from "./ActivityIcon";
import { blockResultIcon } from "./ResultIcon";
import { MN, WHEN } from "@/lib/gameConfig";
import { blockResult, keyOf, marks, plannedActivity, range } from "@/lib/gameLogic";

function Pips({ state, k, R }) {
  const d = marks(state, k);
  const pips = [];
  for (let j = 0; j < R.len; j++) pips.push(d[j] || 0);
  return (
    <span className="pips" aria-hidden="true">
      {pips.map((v, j) => (
        <i key={j} className={`d${v}`} />
      ))}
    </span>
  );
}

export default function ScheduleView({ hidden, y, m, mIdx, monthsLength, state, today, blocks, onPrev, onNext, onOpenSlot }) {
  let earned = 0;
  let spent = 0;
  const slots = [];
  for (let i = 0; i < 3; i++) {
    const k = keyOf(y, m, i);
    const R = range(y, m, i);
    const a = plannedActivity(state, k);
    const res = a ? blockResult(state, k, R, today) : null;
    const now = today >= R.start && today <= R.end;
    const b = blocks.find((x) => x.k === k);
    if (b) {
      if (b.g > 0) earned += b.g;
      else spent -= b.g;
    }
    slots.push({ k, i, R, a, res, now });
  }

  return (
    <section className="win" id="v-sched" hidden={hidden}>
      <span className="plate">Schedule</span>
      <div className="mnav">
        <button className="arrow" aria-label="Previous month" disabled={mIdx === 0} onClick={onPrev}>
          ◀
        </button>
        <h2>
          {MN[m]}
          <span className="num">{y}</span>
        </h2>
        <button className="arrow" aria-label="Next month" disabled={mIdx === monthsLength - 1} onClick={onNext}>
          ▶
        </button>
      </div>
      <p className="schedule-instruction">
        Choose how to spend each chapter of the month <span aria-hidden="true">❧</span> Select a card to plan your days
      </p>
      <div className="slots">
        {slots.map(({ k, i, R, a, res, now }) => (
          <button
            key={k}
            type="button"
            className={`slot${now ? " now" : ""}`}
            onClick={() => onOpenSlot(k)}
            aria-label={`${WHEN[i]} ${MN[m]}, days ${R.s} to ${R.e}${a ? ", " + a.name : ", empty"}${res ? ", " + res.label : ""}`}
          >
            {res && res.cls !== "r-open" && (
              <span className={`stamp ${res.cls}`}>
                {blockResultIcon(res)}
                {res.label === "Great success" ? "Great!" : res.label}
              </span>
            )}
            <span className="when">{WHEN[i]}</span>
            {a ? (
              <>
                <ActivityIcon activity={a} />
                <span className="n">{a.name}</span>
                <span className="s">{a.sub}</span>
              </>
            ) : (
              <>
                <span className="crest empty">+</span>
                <span className="n" style={{ color: "var(--muted)" }}>
                  Free slot
                </span>
                <span className="s">Tap to plan</span>
              </>
            )}
            {a && <Pips state={state} k={k} R={R} />}
            <span className="days">
              {R.s}–{R.e} · {R.len} days
            </span>
          </button>
        ))}
      </div>
      <div className="forecast">
        <span>
          Earned this month <b className="num">+{earned}G</b>
        </span>
        <span>
          Spent <b className="num">−{spent}G</b>
        </span>
      </div>
    </section>
  );
}
