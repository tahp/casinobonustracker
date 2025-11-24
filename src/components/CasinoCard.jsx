import React, { useState } from "react";
import Countdown from "react-countdown";

export default function CasinoCard({ name, url }) {
  // Each card manages its own countdown target
  const [targetTime, setTargetTime] = useState(Date.now() + 24 * 60 * 60 * 1000);

  const handleBonusClick = (e) => {
    e.preventDefault();
    // 1️⃣ Open casino in a new tab
    window.open(url, "_blank");

    // 2️⃣ Reset countdown to 24 hours from now
    setTargetTime(Date.now() + 24 * 60 * 60 * 1000);
  };

  return (
    <div className="casino-card">
      <div className="casino-row">
        <span className="casino-name">{name}</span>
        <Countdown
          date={targetTime}
          renderer={({ hours, minutes, seconds, completed }) =>
            completed ? (
              <a href="#" onClick={handleBonusClick} className="bonus-link">
                🎉 Bonus Ready! Click to claim
              </a>
            ) : (
              <span className="countdown-pill">
                {hours.toString().padStart(2, "0")}:
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
              </span>
            )
          }
        />
      </div>
    </div>
  );
}
