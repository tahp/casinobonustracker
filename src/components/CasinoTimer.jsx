import React, { useState, useEffect } from "react";

function CasinoTimer({ casino, onClaim }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    let target;

    if (casino.lastClaimed) {
      // Next reset is 24h after last claim
      target = new Date(casino.lastClaimed + 24 * 60 * 60 * 1000);
    } else if (casino.resetTime && casino.resetTime.includes(":")) {
      // Daily reset time string
      const [hours, minutes] = casino.resetTime.split(":").map(Number);
      target = new Date();
      target.setHours(hours, minutes, 0, 0);
      // If that time has already passed today, just mark ready
      if (target <= new Date()) {
        setTimeLeft("Bonus Ready!");
        if (!casino.bonusReady) {
          onClaim(casino.id, true); // persist ready state
        }
        return;
      }
    }

    if (!target) {
      setTimeLeft("No reset time set");
      return;
    }

    const updateTimer = () => {
      const remaining = target.getTime() - Date.now();
      if (remaining <= 0) {
        setTimeLeft("Bonus Ready!");
        if (!casino.bonusReady) {
          onClaim(casino.id, true);
        }
      } else {
        const h = Math.floor(remaining / (1000 * 60 * 60));
        const m = Math.floor((remaining / (1000 * 60)) % 60);
        const s = Math.floor((remaining / 1000) % 60);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [casino.resetTime, casino.lastClaimed, casino.bonusReady]);

  return (
    <span
      className={`countdown-box ${timeLeft === "Bonus Ready!" ? "ready" : ""}`}
      onClick={() => {
        if (timeLeft === "Bonus Ready!") {
          onClaim(casino.id, false); // reset countdown
          if (casino.url) {
            window.open(casino.url, "_blank");
          }
        }
      }}
    >
      {timeLeft}
    </span>
  );
}

export default CasinoTimer;
