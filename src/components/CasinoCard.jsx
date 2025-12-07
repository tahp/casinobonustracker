import React, { forwardRef, useEffect, useRef } from "react";
import TimePicker from "react-time-picker";
import CasinoTimer from "./CasinoTimer";

const CasinoCard = forwardRef(
  (
    {
      casino,
      onUpdate,
      onRemove,
      onClaim,
      onPauseSorting,
      onResumeSorting,
      isNew, // New prop
    },
    ref
  ) => {
    const inputRef = useRef(null);

    useEffect(() => {
      if (isNew && inputRef.current) {
        inputRef.current.focus();
        // Optionally, select the text for easier editing
        inputRef.current.select();
      }
    }, [isNew]);

    return (
      <div className="casino-card" ref={ref}>
        <div className="casino-content">
          {/* Editable casino name */}
          <input
            type="text"
            value={casino.name}
            onChange={(e) => onUpdate(casino.id, "name", e.target.value)}
            onFocus={onPauseSorting}
            onBlur={onResumeSorting}
            className="casino-input"
            ref={inputRef} // Attach ref to input
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
);

CasinoCard.displayName = 'CasinoCard'; // Added for react/display-name ESLint rule

export default CasinoCard;
