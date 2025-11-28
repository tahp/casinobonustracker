import React, { useState, useEffect, useMemo } from "react";
import CasinoCard from "./CasinoCard";
import { sortCasinos } from "../utils/sortCasinos";
import initialCasinos from "../data/casino.json";
import "./Dashboard.css";

const sortConfig = [
  { mode: "timeLeft", label: "⏳ Sort by Time Left" },
  { mode: "resetTime", label: "🕒 Sort by Reset Time" },
  { mode: "alpha", label: "🔤 Sort Alphabetically" },
];

function Dashboard() {
  const [casinos, setCasinos] = useState(() => {
    const saved = localStorage.getItem("casinos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((c) => ({
          ...c,
          id: c.id || crypto.randomUUID(),
          resetTime: c.resetTime || "",
          bonusReady: c.bonusReady || false,
          lastClaimed: c.lastClaimed || null,
        }));
      } catch {
        return initialCasinos.map((c) => ({
          ...c,
          id: crypto.randomUUID(),
          resetTime: "",
          bonusReady: false,
          lastClaimed: null,
        }));
      }
    }
    return initialCasinos.map((c) => ({
      ...c,
      id: crypto.randomUUID(),
      resetTime: "",
      bonusReady: false,
      lastClaimed: null,
    }));
  });

  const [sortMode, setSortMode] = useState("timeLeft");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSortingPaused, setIsSortingPaused] = useState(false);

  const pauseSorting = () => setIsSortingPaused(true);
  const resumeSorting = () => setIsSortingPaused(false);

  useEffect(() => {
    localStorage.setItem("casinos", JSON.stringify(casinos));
  }, [casinos]);

  const handleChange = (id, field, value) => {
    const updated = casinos.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    setCasinos(updated);
  };

  const addCasino = () => {
    const newCasino = {
      id: crypto.randomUUID(),
      name: "New Casino",
      resetTime: "",
      bonusReady: false,
      lastClaimed: null,
    };
    setCasinos((prev) => [...prev, newCasino]);
  };

  const removeCasino = (id) => {
    setCasinos((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClaim = (id, markReadyOnly = false) => {
    const now = Date.now();
    const updated = casinos.map((c) =>
      c.id === id
        ? {
            ...c,
            bonusReady: markReadyOnly ? true : false,
            lastClaimed: markReadyOnly ? c.lastClaimed : now,
          }
        : c
    );
    setCasinos(updated);
  };

  const sortedCasinos = useMemo(() => {
    if (isSortingPaused) {
      return casinos;
    }
    return sortCasinos(casinos, sortMode);
  }, [casinos, sortMode, isSortingPaused]);

  return (
    <div className="dashboard-root">
      <div className="dashboard-header">
        <h2 className="dashboard-title">🎰 Daily Bonus Dashboard</h2>

        <div className="hamburger-container">
          <button
            className="hamburger-icon"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Sort options"
          >
            ☰
          </button>
          {menuOpen && (
            <div className="hamburger-dropdown">
              {sortConfig.map(({ mode, label }) => (
                <button
                  key={mode}
                  onClick={() => {
                    setSortMode(mode);
                    setMenuOpen(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="casino-list">
        {sortedCasinos.map((casino) => (
          <CasinoCard
            key={casino.id}
            casino={casino}
            onUpdate={handleChange}
            onRemove={removeCasino}
            onClaim={handleClaim}
            onPauseSorting={pauseSorting}
            onResumeSorting={resumeSorting}
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
