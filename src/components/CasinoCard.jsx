import React from "react";
import TimePicker from "react-time-picker";
import CasinoTimer from "./CasinoTimer";

function CasinoCard({
  casino,
  onUpdate,
  onRemove,
  onClaim,
  onPauseSorting,
  onResumeSorting,
}) {
  return (
    <div className="casino-card">
      <div className="casino-content">
        {/* Editable casino name */}
        <input
          type="text"
          value={casino.name}
          onChange={(e) => onUpdate(casino.id, "name", e.target.value)}
          onFocus={onPauseSorting}
          onBlur={onResumeSorting}
          className="casino-input"
        />

        <div className="casino-row">
          {/* Editable reset time */}
          <TimePicker
            value={casino.resetTime || ""}
            onChange={(value) => onUpdate(casino.id, "resetTime", value)}
            disableClock={true}
            clearIcon={null}
            format="h:mm a"
            clockIcon={null}
          />

          {/* Countdown timer with per-card claim logic */}
          <CasinoTimer casino={casino} onClaim={onClaim} />
        </div>
      </div>

      {/* Delete button */}
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
