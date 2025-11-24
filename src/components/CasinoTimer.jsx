import React, { useEffect, useState } from "react";

function SimpleCountdown({ targetTime }) {
  const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());

  useEffect(() => {
    setTimeLeft(targetTime - Date.now());
    const timer = setInterval(() => {
      setTimeLeft(targetTime - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  if (timeLeft <= 0) return <span>Bonus ready!</span>;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span>
      {hours}h {minutes}m {seconds}s
    </span>
  );
}

function CasinoTimer({ casino }) {
  let resetTime = null;

  if (casino.resetTime && casino.resetTime.includes(":")) {
    const [hours, minutes] = casino.resetTime.split(":").map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    resetTime = target.getTime();
  }

  return (
    <div>
      <h3>{casino.name}</h3>
      {resetTime ? (
        <SimpleCountdown targetTime={resetTime} />
      ) : (
        <p>No reset time set</p>
      )}
    </div>
  );
}

export default CasinoTimer;
