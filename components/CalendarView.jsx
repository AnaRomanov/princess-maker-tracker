"use client";

import ActivityIcon from "./ActivityIcon";
import ResultIcon from "./ResultIcon";
import { MN } from "@/lib/gameConfig";
import { calendarRecord, sameDay } from "@/lib/gameLogic";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function CalendarView({ hidden, y, m, calIdx, monthsLength, calDay, state, today, onPrev, onNext, onSelectDay, onEditBlock }) {
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const effectiveCalDay = Math.max(1, Math.min(calDay, daysInMonth));
  const records = Array.from({ length: daysInMonth }, (_, i) => calendarRecord(state, y, m, i + 1));
  const done = records.filter((r) => r.v === 2 || r.v === 3);
  const great = records.filter((r) => r.v === 3);
  const logged = records.filter((r) => r.v > 0);
  const points = done.reduce((sum, r) => sum + (r.v === 3 ? 2 : 1), 0);
  const leading = (new Date(y, m, 1).getDay() + 6) % 7;

  const r = records[effectiveCalDay - 1];
  const future = r.date > today && !sameDay(r.date, today);
  const when = r.date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const status = r.v === 3 ? "Big Success!" : r.v === 2 ? "Success!" : r.v === 1 ? "Not completed" : future ? "Coming up" : r.a ? "Not logged yet" : "An open page";
  const explanation =
    r.v === 3
      ? "Two practice points earned — wonderful effort!"
      : r.v === 2
      ? "One practice point earned."
      : r.v === 1
      ? "No practice points today. Every day is a fresh page."
      : future
      ? "This day is still ahead of you."
      : r.a
      ? "You can record your result using the daily log."
      : "Nothing has been planned for this day.";

  return (
    <section className="win royal-calendar-window" id="v-cal" hidden={hidden}>
      <span className="plate">Calendar</span>
      <div className="royal-calendar-heading">
        <span aria-hidden="true">❧</span> The Royal Calendar <span aria-hidden="true">❧</span>
      </div>
      <p className="royal-calendar-intro">A little record of the days you showed up, and the adventures still ahead.</p>
      <div className="mnav cal-month-nav">
        <button className="arrow" type="button" aria-label="Previous calendar month" disabled={calIdx === 0} onClick={onPrev}>
          ◀
        </button>
        <h2>
          {MN[m]}
          <span className="num">{y}</span>
        </h2>
        <button className="arrow" type="button" aria-label="Next calendar month" disabled={calIdx === monthsLength - 1} onClick={onNext}>
          ▶
        </button>
      </div>
      <div className="cal-summary" aria-label="Monthly achievements">
        {[
          ["Days completed", done.length],
          ["Big successes", great.length],
          ["Practice points", points],
          ["Days logged", logged.length],
        ].map(([label, value]) => (
          <div className="cal-summary-card" key={label}>
            <b className="num">{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <div className="royal-cal-frame">
        <div className="royal-cal-grid" aria-label="Monthly calendar">
          {WEEKDAYS.map((d) => (
            <div className="royal-weekday" key={d}>
              {d}
            </div>
          ))}
          {Array.from({ length: leading }, (_, i) => (
            <span className="royal-day-spacer" aria-hidden="true" key={`spacer-${i}`} />
          ))}
          {records.map((rec) => {
            const isToday = sameDay(rec.date, today);
            const isFuture = rec.date > today && !isToday;
            const kind = rec.v === 3 ? "great" : rec.v === 2 ? "success" : rec.v === 1 ? "missed" : rec.a ? "planned" : "empty";
            const outcome = rec.v === 3 ? "Big success" : rec.v === 2 ? "Success" : rec.v === 1 ? "Missed" : rec.a ? "Planned, not logged" : "Nothing planned";
            return (
              <button
                key={rec.day}
                type="button"
                className={`royal-day ${kind}${isToday ? " is-today" : ""}${effectiveCalDay === rec.day ? " chosen" : ""}${isFuture ? " future" : ""}`}
                aria-pressed={effectiveCalDay === rec.day}
                aria-label={`${rec.day} ${MN[m]}: ${rec.a ? rec.a.name + ", " : ""}${outcome}`}
                onClick={() => onSelectDay(rec.day)}
              >
                <span className="royal-day-number">{rec.day}</span>
                <span className="royal-day-mark" aria-hidden="true">
                  {rec.v === 2 || rec.v === 3 ? <ResultIcon value={rec.v} /> : rec.v === 1 ? "−" : rec.a ? "·" : ""}
                </span>
                <span className="royal-day-activity">{rec.a ? rec.a.name : ""}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="cal-key" aria-label="Result legend">
        <span>✧ Logged days:</span>
        <span>
          <ResultIcon value={2} /> Success
        </span>
        <span>
          <ResultIcon value={3} /> Big success
        </span>
        <span>· Planned</span>
        <span>— Missed</span>
      </div>
      <div className="cal-day-detail" aria-live="polite">
        <div className="cal-detail-date">{when}</div>
        <div className="cal-detail-body">
          {r.a && (
            <div className="cal-detail-art">
              <ActivityIcon activity={r.a} />
            </div>
          )}
          <div className="cal-detail-copy">
            <div className="cal-detail-title">{r.a ? r.a.name : "A day of possibilities"}</div>
            <div className="cal-detail-sub">{r.a ? r.a.sub : "Your story is yours to write."}</div>
            <div className="cal-detail-status">
              {(r.v === 2 || r.v === 3) && <ResultIcon value={r.v} />}
              <strong>{status}</strong>
            </div>
            <p>{explanation}</p>
          </div>
        </div>
        <div className="cal-detail-actions">
          <button className="btn" type="button" onClick={onEditBlock}>
            {r.a ? (future ? "View scheduled block" : "Open daily log") : "Plan this block"}
          </button>
        </div>
      </div>
    </section>
  );
}
