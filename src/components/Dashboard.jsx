import React, { useState, useEffect, useMemo, useRef } from "react";
import CasinoCard from "./CasinoCard";
import { sortCasinos } from "../utils/sortCasinos";
import getInitialCasinos from '../utils/getInitialCasinos';
import "./Dashboard.css";

const sortConfig = [
  { mode: "timeLeft", label: "⏳ Time Left" },
  { mode: "resetTime", label: "🕒 Next Reset" },
  { mode: "alphabetical", label: "🔤 Alphabetical" },
  { mode: "newlyAdded", label: "✨ Newly Added" },

];

function Dashboard() {
  const [casinos, setCasinos] = useState(getInitialCasinos);

  const [sortMode, setSortMode] = useState("newlyAdded"); // Default to newly added
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSortingPaused, setIsSortingPaused] = useState(false);
  const [editingCasinoId, setEditingCasinoId] = useState(null); // State to track the casino being edited

  const casinoListRef = useRef(null);
  const casinoCardRefs = useRef({});

  const pauseSorting = () => setIsSortingPaused(true);
  const resumeSorting = () => setIsSortingPaused(false);

  useEffect(() => {
    localStorage.setItem("casinos", JSON.stringify(casinos));
  }, [casinos]);

  useEffect(() => {
    if (editingCasinoId) {
      const timer = setTimeout(() => {
        const newCardElement = casinoCardRefs.current[editingCasinoId];
        if (newCardElement) {
          newCardElement.scrollIntoView({ behavior: "smooth", block: "center" });
          newCardElement.classList.add("highlight");
          const highlightTimer = setTimeout(() => {
            newCardElement.classList.remove("highlight");
            setEditingCasinoId(null); // Clear the ID after use, only after highlight is removed
          }, 1500);
          return () => clearTimeout(highlightTimer);
        }
      }, 100); // Small delay to ensure DOM update
      return () => clearTimeout(timer); // Clear the initial timer if component unmounts early
    }
  }, [editingCasinoId]); // Only depend on editingCasinoId

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
      dateAdded: Date.now(), // New casinos are added with current timestamp
    };
    setCasinos((prev) => [newCasino, ...prev]);
    setEditingCasinoId(newCasino.id); // Set the new casino for editing
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
              <button
                onClick={() => {
                  addCasino();
                  setMenuOpen(false);
                }}
              >
                ➕ Add Casino
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="casino-list" ref={casinoListRef}>
        {sortedCasinos.map((casino) => (
          <CasinoCard
            key={casino.id}
            casino={casino}
            onUpdate={handleChange}
            onRemove={removeCasino}
            onClaim={handleClaim}
            onPauseSorting={pauseSorting}
            onResumeSorting={resumeSorting}
            ref={(el) => (casinoCardRefs.current[casino.id] = el)}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
