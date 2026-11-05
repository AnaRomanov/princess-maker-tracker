"use client";

import ActivityIcon from "./ActivityIcon";
import Chips from "./Chips";
import PortraitCameo from "./PortraitCameo";
import { ACT, ACTS, RANK_PTS, RANKS, STAT_GROUPS, STATUS_STYLE } from "@/lib/gameConfig";
import { rankOf, statusTitle } from "@/lib/gameLogic";

export default function StatusView({ hidden, c, masteryFilter, selectedMastery, onFilterChange, onSelectMastery }) {
  const title = statusTitle(c);
  const top = ACTS.filter((a) => a.kind !== "free")
    .slice()
    .sort((a, b) => (c.pts[b.id] || 0) - (c.pts[a.id] || 0))[0];
  const best = c.pts[top?.id] || 0;
  const activeCount = Object.values(c.pts).filter((p) => p > 0).length;
  const max = Math.max(100, ...Object.values(c.stats));

  const activities = ACTS.filter((a) => a.kind !== "free" && (masteryFilter === "all" || a.kind === masteryFilter));
  const effectiveSelected = activities.some((a) => a.id === selectedMastery) ? selectedMastery : activities[0]?.id || "";
  const detailActivity = ACT[effectiveSelected];

  return (
    <section className="win royal-status-window" id="v-status" hidden={hidden}>
      <span className="plate">Status</span>
      <div className="royal-status-heading">
        <span aria-hidden="true">❧</span> The Royal Character Sheet <span aria-hidden="true">❧</span>
      </div>
      <p className="royal-status-intro">A record of the person you&apos;re becoming, one little adventure at a time.</p>

      <div className="royal-profile">
        <div>
          <div className="royal-profile-label">✧ Your current title ✧</div>
          <div className="royal-profile-title">{title.name}</div>
          <p className="royal-profile-description">{title.description}</p>
          <div className="royal-profile-speciality">
            <strong>Current speciality:</strong>{" "}
            {best ? `${top.name} · Rank ${rankOf(best)} · ${best} pts` : "Your first skill awaits"}
          </div>
          <div className="royal-profile-sub">{activeCount} skills practised · Titles reflect your growth, not a fixed ending</div>
        </div>
        <PortraitCameo />
      </div>

      <h3 className="status-section-heading">✧ Your Attributes ✧</h3>
      <p className="status-section-note">Twelve qualities, four paths of growth. Every number begins at 10.</p>
      <div className="royal-attribute-grid">
        {Object.entries(STAT_GROUPS).map(([group, stats]) => (
          <section className="attribute-panel" data-group={group} key={group}>
            <div className="attribute-heading">
              <span className="attribute-emblem" aria-hidden="true">
                {STATUS_STYLE[group].icon}
              </span>
              <b>{group}</b>
              <small>3 attributes</small>
            </div>
            {stats.map((st) => (
              <div className="attribute-item" key={st}>
                <div className="attribute-meta">
                  <span>{st}</span>
                  <b className="num">{c.stats[st]}</b>
                </div>
                <div
                  className="attribute-track"
                  role="meter"
                  aria-label={st}
                  aria-valuemin={0}
                  aria-valuemax={max}
                  aria-valuenow={c.stats[st]}
                >
                  <i style={{ width: `${Math.min(100, (c.stats[st] / max) * 100)}%` }} />
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>

      <div className="status-mastery-heading">
        <div>
          <h3 className="status-section-heading">✧ Skill Mastery ✧</h3>
          <p className="status-section-note">Practice builds mastery — from D to the coveted S.</p>
        </div>
        <div className="mastery-filter" role="group" aria-label="Filter skills">
          {[
            ["all", "All"],
            ["class", "Classes"],
            ["job", "Jobs"],
          ].map(([filter, label]) => (
            <button key={filter} type="button" aria-pressed={masteryFilter === filter} onClick={() => onFilterChange(filter)}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mastery-grid">
        {activities.map((a) => {
          const pts = c.pts[a.id] || 0;
          const r = rankOf(pts);
          const ri = RANKS.indexOf(r);
          const lo = RANK_PTS[ri];
          const hi = RANK_PTS[ri + 1];
          const percent = hi == null ? 100 : Math.max(0, Math.min(100, ((pts - lo) / (hi - lo)) * 100));
          return (
            <button
              key={a.id}
              type="button"
              className={`mastery-card rank-${r}`}
              aria-pressed={a.id === effectiveSelected}
              aria-label={`${a.name}, rank ${r}, ${pts} points`}
              onClick={() => onSelectMastery(a.id)}
            >
              <ActivityIcon activity={a} />
              <span className="mastery-card-name">{a.name}</span>
              <span className="mastery-card-sub">{a.sub}</span>
              <span className="mastery-card-rank">
                {r}
                <small>Rank</small>
              </span>
              <span className="mastery-mini-track">
                <i style={{ width: `${percent}%` }} />
              </span>
              <span className="mastery-card-points">
                {pts} pts{hi == null ? " · Mastered" : ` · ${hi - pts} to ${RANKS[ri + 1]}`}
              </span>
            </button>
          );
        })}
      </div>
      {detailActivity &&
        (() => {
          const pts = c.pts[detailActivity.id] || 0;
          const r = rankOf(pts);
          const ri = RANKS.indexOf(r);
          const hi = RANK_PTS[ri + 1];
          return (
            <div className="mastery-detail" aria-live="polite">
              <div className="mastery-detail-content">
                <ActivityIcon activity={detailActivity} />
                <div className="mastery-detail-copy">
                  <h4>{detailActivity.name}</h4>
                  <p>
                    {detailActivity.sub} · <strong>Rank {r}</strong> · {pts} practice points
                  </p>
                  <p>{hi == null ? "S rank achieved — this discipline is mastered!" : `${hi - pts} more practice points until Rank ${RANKS[ri + 1]}.`}</p>
                  <Chips activity={detailActivity} />
                </div>
              </div>
            </div>
          );
        })()}
    </section>
  );
}
