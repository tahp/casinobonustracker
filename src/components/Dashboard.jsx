import React, { useState, useEffect } from "react";
import TimePicker from "react-time-picker";
import "./Dashboard.css"; // ✅ component-scoped styles

function SimpleCountdown({ targetTime }) {
  const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(targetTime - Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime]);

  if (timeLeft <= 0) {
    return <span className="countdown-box ready">Bonus Ready!</span>;
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="countdown-box">
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
      {resetTime ? (
        <SimpleCountdown targetTime={resetTime} />
      ) : (
        <span className="countdown-box">No reset time set</span>
      )}
    </div>
  );
}

function Dashboard() {
  const defaultCasinos = [
    { id: crypto.randomUUID(), name: "Stake.us", resetTime: "" },
    { id: crypto.randomUUID(), name: "WOW Vegas", resetTime: "" },
    { id: crypto.randomUUID(), name: "Chumba", resetTime: "" }
  ];

  const sortCasinos = (list) =>
    [...list].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  const [casinos, setCasinos] = useState(() => {
    const saved = localStorage.getItem("casinos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const withIds = parsed.map((c) => ({ ...c, id: c.id || crypto.randomUUID() }));
        return sortCasinos(withIds);
      } catch {
        return defaultCasinos;
      }
    }
    return defaultCasinos;
  });

  useEffect(() => {
    localStorage.setItem("casinos", JSON.stringify(casinos));
  }, [casinos]);

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const debouncedSort = debounce((updated) => {
    setCasinos(sortCasinos(updated));
  }, 500);

  const handleChange = (id, field, value) => {
    const updated = casinos.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    setCasinos(updated);
    debouncedSort(updated);
  };

  const addCasino = () => {
    const updated = [
      ...casinos,
      { id: crypto.randomUUID(), name: "New Casino", resetTime: "" }
    ];
    setCasinos(sortCasinos(updated));
  };

  const removeCasino = (id) => {
    const updated = casinos.filter((c) => c.id !== id);
    setCasinos(sortCasinos(updated));
  };

  return (
    <div className="dashboard-root">
      <h2 className="dashboard-title">🎰 Daily Bonus Dashboard</h2>

      <div className="casino-list">
        {casinos.map((casino) => (
          <div key={casino.id} className="casino-card">
            <div className="casino-content">
              <input
                type="text"
                value={casino.name}
                onChange={(e) => handleChange(casino.id, "name", e.target.value)}
                className="casino-input"
              />

              <div className="casino-row">
                <TimePicker
                  value={casino.resetTime || ""}
                  onChange={(value) => handleChange(casino.id, "resetTime", value)}
                  disableClock={true}
                  clearIcon={null}
                  format="h:mm a"
                  clockIcon={null}
                />
                <CasinoTimer casino={casino} />
              </div>
            </div>

            <button
              onClick={() => removeCasino(casino.id)}
              className="delete-button"
              aria-label="Delete casino"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="add-button-container">
        <button onClick={addCasino} className="add-button">
          + Add Casino
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
