"use client";

import { useState } from "react";
import ActivityIcon from "./ActivityIcon";
import ResultIcon from "./ResultIcon";
import { MN } from "@/lib/gameConfig";

const DIARY_PER_PAGE = 2;

function diaryDate(d) {
  return `${d.getDate()} ${MN[d.getMonth()]} ${d.getFullYear()}`;
}

function DiaryPage({ entries, pageIndex }) {
  const group = entries.slice(pageIndex * DIARY_PER_PAGE, (pageIndex + 1) * DIARY_PER_PAGE);
  const heading = pageIndex === 0 ? "Recent Adventures" : "Pages of the Past";
  return (
    <div className="diary-page" aria-label={`Diary page ${pageIndex + 1}`}>
      <div className="diary-page-head">{heading}</div>
      {group.length > 0 ? (
        group.map((e, i) => (
          <article className="diary-entry" key={`${e.a.id}-${e.stamp}-${i}`}>
            <div className="diary-entry-top">
              <time dateTime={`${e.date.getFullYear()}-${String(e.date.getMonth() + 1).padStart(2, "0")}-${String(e.date.getDate()).padStart(2, "0")}`}>
                {diaryDate(e.date)}
              </time>
              <span aria-hidden="true">❧</span>
            </div>
            <div className="diary-entry-head">
              <ActivityIcon activity={e.a} />
              <div>
                <div className="diary-entry-name">{e.a.name}</div>
                <div className="diary-entry-sub">{e.a.sub}</div>
              </div>
            </div>
            <p className="diary-entry-result">
              <ResultIcon value={e.v} />
              <span>{e.v === 3 ? "Big Success · 2 practice points" : e.v === 2 ? "Success · 1 practice point" : "Not completed · no practice points"}</span>
            </p>
          </article>
        ))
      ) : (
        <div className="diary-page-blank">
          <span className="blank-emblem">✧</span>
          {pageIndex === 0 ? "Your story begins with your first logged activity." : "More adventures are yet to be written."}
        </div>
      )}
      <div className="diary-page-number">— {pageIndex + 1} —</div>
    </div>
  );
}

export default function DiaryView({ hidden, entries, isMobile, diarySpread, onChangeSpread, cloudEnabled, onResetConfirmed, onSignOut }) {
  const [armed, setArmed] = useState(false);

  const totalPages = Math.max(1, Math.ceil(entries.length / DIARY_PER_PAGE));
  const visiblePages = isMobile ? 1 : 2;
  const totalTurns = Math.max(1, Math.ceil(totalPages / visiblePages));
  const spread = Math.min(diarySpread, totalTurns - 1);
  const startingPage = spread * visiblePages;

  function handleReset() {
    if (armed) {
      onResetConfirmed();
      setArmed(false);
    } else {
      setArmed(true);
    }
  }

  return (
    <section className="win diary-window" id="v-log" hidden={hidden}>
      <span className="plate">Diary</span>
      <div className="diary-topline">
        <span aria-hidden="true">❧</span> The Chronicle of Little Victories <span aria-hidden="true">❧</span>
      </div>
      <p className="diary-intro">Every little effort becomes a page of your story.</p>
      <div aria-live="polite">
        <div className="diary-book">
          <DiaryPage entries={entries} pageIndex={startingPage} />
          {visiblePages === 2 && <DiaryPage entries={entries} pageIndex={startingPage + 1} />}
        </div>
      </div>
      <div className="diary-controls" aria-label="Diary page navigation">
        <button className="btn diary-turn" type="button" disabled={spread === 0} onClick={() => onChangeSpread(spread - 1)}>
          ◀ Previous
        </button>
        <span className="diary-count" aria-live="polite">
          {visiblePages === 2 ? `Spread ${spread + 1} / ${totalTurns}` : `Page ${spread + 1} / ${totalTurns}`}
        </span>
        <button className="btn diary-turn" type="button" disabled={spread === totalTurns - 1} onClick={() => onChangeSpread(spread + 1)}>
          Next ▶
        </button>
      </div>
      <div className="diary-foot">
        <span>✧</span> Your story is still being written <span>✧</span>
      </div>
      <button type="button" className={`danger${armed ? " armed" : ""}`} onClick={handleReset}>
        {armed ? "Tap again to reset" : "Reset everything"}
      </button>
      {cloudEnabled && (
        <button className="danger" type="button" onClick={onSignOut}>
          Sign out
        </button>
      )}
    </section>
  );
}
