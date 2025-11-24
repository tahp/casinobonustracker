import React from "react";
import TimePicker from "react-time-picker";
import CasinoTimer from "./CasinoTimer";

function CasinoCard({ casino, onUpdate, onRemove }) {
  return (
    <div className="casino-card">
      <div className="casino-content">
        <input
          type="text"
          value={casino.name}
          onChange={(e) => onUpdate(casino.id, "name", e.target.value)}
          className="casino-input"
        />
        <div className="casino-row">
          <TimePicker
            value={casino.resetTime || ""}
            onChange={(value) => onUpdate(casino.id, "resetTime", value)}
            disableClock={true}
            clearIcon={null}
            format="h:mm a"
            clockIcon={null}
          />
          <CasinoTimer casino={casino} />
        </div>
      </div>
      <button
        onClick={() => onRemove(casino.id)}
        className="delete-button"
        aria-label="Delete casino"
      >
        🗑️
      </button>
    </div>
  );
}

export default CasinoCard;