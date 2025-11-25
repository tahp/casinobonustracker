import React, { useState, useEffect, useMemo } from "react";
import CasinoCard from "./CasinoCard";
import { sortCasinos } from "../utils";
import initialCasinos from "../data/casino.json";
import "./Dashboard.css";

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

  // Persist casinos
  useEffect(() => {
    localStorage.setItem("casinos", JSON.stringify(casinos));
  }, [casinos]);

  const handleChange = (id, field, value) => {
    const updated = casinos.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    setCasinos(updated);
    // No sorting here — let render handle it
  };

  const addCasino = () => {
    const updated = [
      ...casinos,
      {
        id: crypto.randomUUID(),
        name: "New Casino",
        resetTime: "",
        bonusReady: false,
        lastClaimed: null,
      },
    ];
    setCasinos(updated);
  };

  const removeCasino = (id) => {
    const updated = casinos.filter((c) => c.id !== id);
    setCasinos(updated);
  };

  const handleClaim = (id, markReadyOnly = false) => {
    const updated = casinos.map((c) =>
      c.id === id
        ? {
            ...c,
            bonusReady: markReadyOnly ? true : false,
            lastClaimed: markReadyOnly ? c.lastClaimed : Date.now(),
          }
        : c
    );
    setCasinos(updated);
  };

  const sortedCasinos = useMemo(
    () => sortCasinos(casinos, sortMode),
    [casinos, sortMode]
  );

  return (
    <div className="dashboard-root">
      <div className="dashboard-header">
        <h2 className="dashboard-title">🎰 Daily Bonus Dashboard</h2>

        {/* Hamburger menu */}
        <div className="hamburger-container">
          <button
            className="hamburger-icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          {menuOpen && (
            <div className="hamburger-dropdown">
              <button
                onClick={() => {
                  setSortMode("timeLeft");
                  setMenuOpen(false);
                }}
              >
                ⏳ Sort by Time Left
              </button>
              <button
                onClick={() => {
                  setSortMode("resetTime");
                  setMenuOpen(false);
                }}
              >
                🕒 Sort by Reset Time
              </button>
              <button
                onClick={() => {
                  setSortMode("alpha");
                  setMenuOpen(false);
                }}
              >
                🔤 Sort Alphabetically
              </button>
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
