"use client";

import ActivityIcon from "./ActivityIcon";
import ResultIcon from "./ResultIcon";
import ResultCard from "./ResultCard";
import { DAYNAMES } from "@/lib/gameConfig";

export default function TodayPanel({ activity, value, cb, lastResult, onVerdict, onPlanNow }) {
  return (
    <section className="win" aria-label="Today">
      <span className="plate">Today</span>
      <div className="today">
        {activity ? (
          <>
            <div className="today-head">
              <ActivityIcon activity={activity} />
              <div>
                <p>Did you work on it today?</p>
                <b>{activity.name}</b>
                <p>{activity.sub}</p>
              </div>
            </div>
            <div className="verdicts">
              {[1, 2, 3].map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`verdict v${v}`}
                  aria-pressed={value === v}
                  onClick={() => onVerdict(v)}
                >
                  <span>
                    <ResultIcon value={v} />
                  </span>
                  {DAYNAMES[v]}
                  <small>{v === 1 ? "No gains" : v === 2 ? "Normal gains" : "×1.5 gains"}</small>
                </button>
              ))}
            </div>
            <ResultCard lastResult={lastResult} k={cb.k} idx={cb.idx} />
          </>
        ) : (
          <>
            <p className="today-empty">Nothing planned for this block yet.</p>
            <button type="button" className="small-btn" onClick={onPlanNow}>
              Plan this block
            </button>
          </>
        )}
      </div>
    </section>
  );
}
