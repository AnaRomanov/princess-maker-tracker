"use client";

export default function Chips({ activity }) {
  return (
    <span className="chips">
      {(activity.up || []).map((s) => (
        <span className="chip" key={`up-${s}`}>
          +{s}
        </span>
      ))}
      {(activity.down || []).map((s) => (
        <span className="chip dn" key={`dn-${s}`}>
          −{s}
        </span>
      ))}
    </span>
  );
}
