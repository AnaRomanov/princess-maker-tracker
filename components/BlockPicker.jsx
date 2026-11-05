"use client";

import { useEffect, useRef, useState } from "react";
import ActivityIcon from "./ActivityIcon";
import Chips from "./Chips";
import ResultCard from "./ResultCard";
import ResultIcon from "./ResultIcon";
import { ACT, ACTS, DAYNAMES, FEE, MN, MULT, WHEN } from "@/lib/gameConfig";
import { blockResult, marks, plannedActivity, range, rankOf, sameDay } from "@/lib/gameLogic";

const KIND_TABS = [
  { k: "class", icon: "✦", label: "Classes" },
  { k: "job", icon: "❀", label: "Jobs" },
  { k: "free", icon: "☾", label: "Rest" },
];

const NEXT_VALUE = { 0: 2, 2: 3, 3: 1, 1: 0 };

export default function BlockPicker({ openKey, state, c, today, lastResult, onClose, onSetDay, onChooseActivity, onClearBlock }) {
  const closeRef = useRef(null);
  const initialKind = (() => {
    const a = ACT[state.plan[openKey]];
    return a ? a.kind : "class";
  })();
  const [kind, setKind] = useState(initialKind);

  useEffect(() => {
    closeRef.current?.focus();
    function onKeydown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeydown);
    return () => document.removeEventListener("keydown", onKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [y, mm, i] = openKey.split("-").map(Number);
  const m = mm - 1;
  const R = range(y, m, i);
  const cur = state.plan[openKey];
  const res = cur ? blockResult(state, openKey, R, today) : null;
  const d = marks(state, openKey);

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="pickTitle">
        <div className="win">
          <span className="plate">Block</span>
          <div className="mh">
            <div>
              <h2 id="pickTitle">
                {WHEN[i]} {MN[m]}
              </h2>
              <p>
                Days {R.s}–{R.e} · {R.len} days{res ? " · " + res.label : ""}
              </p>
            </div>
            <button className="x" aria-label="Close" ref={closeRef} onClick={onClose}>
              ✕
            </button>
          </div>

          <div>
            {cur && (
              <>
                <h3 className="subhead" style={{ marginTop: 0 }}>
                  Daily log
                </h3>
                <div className="daylog">
                  {Array.from({ length: R.len }, (_, j) => {
                    const dt = new Date(y, m, R.s + j);
                    const fut = dt > today && !sameDay(dt, today);
                    const v = d[j] || 0;
                    return (
                      <button
                        key={j}
                        type="button"
                        className={`day d${v}${sameDay(dt, today) ? " today" : ""}`}
                        disabled={fut}
                        aria-label={`${MN[m]} ${R.s + j}: ${v ? DAYNAMES[v] : "not logged"}`}
                        onClick={() => onSetDay(openKey, j, NEXT_VALUE[v])}
                      >
                        <span>{R.s + j}</span>
                        <b>
                          <ResultIcon value={v} />
                        </b>
                      </button>
                    );
                  })}
                </div>
                <p className="hint">Tap a day to cycle: green tick (success) → purple swirl (big success) → missed → blank.</p>
                {lastResult?.k === openKey && <ResultCard lastResult={lastResult} k={openKey} idx={lastResult.idx} />}
                <h3 className="subhead">Focus</h3>
              </>
            )}
          </div>

          <div className="picker-caption">
            <span aria-hidden="true">✧</span> Choose an activity <span aria-hidden="true">✧</span>
          </div>
          <div className="ktabs" role="tablist">
            {KIND_TABS.map((t) => (
              <button key={t.k} type="button" role="tab" aria-selected={kind === t.k} onClick={() => setKind(t.k)}>
                <span aria-hidden="true">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
          <div className="opts">
            {ACTS.filter((a) => a.kind === kind).map((a) => {
              const r = rankOf(c.pts[a.id] || 0);
              const money =
                a.kind === "job" ? (
                  <span className="g">+{Math.round(a.pay * MULT[r])}G</span>
                ) : a.kind === "class" ? (
                  <span className="g">−{FEE}G</span>
                ) : (
                  <span>Stress −30</span>
                );
              return (
                <button key={a.id} type="button" className="opt" aria-pressed={cur === a.id} onClick={() => onChooseActivity(openKey, a.id)}>
                  <ActivityIcon activity={a} />
                  <span className="t">
                    <b>{a.name}</b>
                    <small>{a.sub}</small>
                    <Chips activity={a} />
                  </span>
                  <span className="r">
                    {a.kind !== "free" && <b>{r}</b>}
                    {money}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="actions">
            {cur && (
              <button className="btn" type="button" onClick={() => onClearBlock(openKey)}>
                Clear block
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
