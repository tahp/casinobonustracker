import React, { useState, useEffect, useMemo } from "react";
import CasinoCard from "./CasinoCard";
import { debounce, sortCasinos } from "../utils";
import initialCasinos from "../data/casino.json";
import "./Dashboard.css";

function Dashboard() {
  const [casinos, setCasinos] = useState(() => {
    const saved = localStorage.getItem("casinos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const withIds = parsed.map((c) => ({ ...c, id: c.id || crypto.randomUUID() }));
        return sortCasinos(withIds);
      } catch {
        return sortCasinos(initialCasinos.map(c => ({ ...c, id: crypto.randomUUID(), resetTime: "" })));
      }
    }
    return sortCasinos(initialCasinos.map(c => ({ ...c, id: crypto.randomUUID(), resetTime: "" })));
  });

  useEffect(() => {
    localStorage.setItem("casinos", JSON.stringify(casinos));
  }, [casinos]);

  const debouncedSort = useMemo(
    () =>
      debounce((updated) => {
        setCasinos(sortCasinos(updated));
      }, 500),
    [setCasinos]
  );

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
          <CasinoCard
            key={casino.id}
            casino={casino}
            onUpdate={handleChange}
            onRemove={removeCasino}
          />
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
