"use client";

const TABS = [
  { v: "sched", icon: "✦", label: "Schedule" },
  { v: "status", icon: "♛", label: "Status" },
  { v: "cal", icon: "▦", label: "Calendar" },
  { v: "log", icon: "✒", label: "Diary" },
];

export default function CommandNav({ view, onChange }) {
  return (
    <nav className="cmds" role="tablist" aria-label="Commands">
      {TABS.map((t) => (
        <button
          key={t.v}
          type="button"
          className="cmd"
          role="tab"
          aria-selected={view === t.v}
          onClick={() => onChange(t.v)}
        >
          <span className="cmd-icon" aria-hidden="true">
            {t.icon}
          </span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
