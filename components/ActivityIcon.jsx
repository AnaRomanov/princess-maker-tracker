"use client";

import { ACT_IMAGES } from "@/lib/gameConfig";

export default function ActivityIcon({ activity }) {
  return (
    <span className={`crest art k-${activity.kind} art-${activity.id}`} data-mono={activity.mono || "?"} aria-hidden="true">
      <img
        className="activity-illustration"
        src={ACT_IMAGES[activity.id]}
        alt=""
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.parentElement?.classList.add("img-fail");
        }}
      />
    </span>
  );
}
