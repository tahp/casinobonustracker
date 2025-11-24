import React, { useState, useEffect } from "react";

function CasinoTimer({ casino }) {
  const [timeLeft, setTimeLeft] = useState("No reset time set");

  useEffect(() => {
    if (casino.resetTime && casino.resetTime.includes(":")) {
      const [hours, minutes] = casino.resetTime.split(":").map(Number);
      const now = new Date();
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);
      if (target <= now) {
        target.setDate(target.getDate() + 1);
      }

      const updateTimer = () => {
        const remaining = target.getTime() - Date.now();
        if (remaining <= 0) {
          setTimeLeft("Bonus Ready!");
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
    }
  }, [casino.resetTime]);

  return <span className="countdown-box">{timeLeft}</span>;
}

export default CasinoTimer;