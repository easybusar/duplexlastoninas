"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingWidget() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ checkIn, checkOut, guests });
    router.push(`/reservar?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSearch}
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: "var(--radius-xl)",
        padding: "8px 8px 8px 8px",
        boxShadow: "var(--shadow-xl), 0 0 0 1px rgba(255,255,255,0.5)",
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "stretch",
        maxWidth: 760,
      }}
    >
      {/* Check-in */}
      <div
        style={{
          flex: "1 1 160px",
          padding: "12px 16px",
          borderRadius: "var(--radius-lg)",
          background: "var(--sand-50)",
          border: "1.5px solid var(--border-light)",
          cursor: "pointer",
        }}
      >
        <label
          htmlFor="checkin"
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "var(--text-muted)",
            marginBottom: 4,
          }}
        >
          Llegada
        </label>
        <input
          id="checkin"
          type="date"
          min={today}
          value={checkIn}
          onChange={(e) => {
            setCheckIn(e.target.value);
            if (checkOut && e.target.value >= checkOut) setCheckOut("");
          }}
          required
          style={{
            border: "none",
            background: "transparent",
            fontSize: 15,
            fontWeight: 600,
            color: checkIn ? "var(--text-primary)" : "var(--text-muted)",
            width: "100%",
            outline: "none",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Check-out */}
      <div
        style={{
          flex: "1 1 160px",
          padding: "12px 16px",
          borderRadius: "var(--radius-lg)",
          background: "var(--sand-50)",
          border: "1.5px solid var(--border-light)",
        }}
      >
        <label
          htmlFor="checkout"
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "var(--text-muted)",
            marginBottom: 4,
          }}
        >
          Salida
        </label>
        <input
          id="checkout"
          type="date"
          min={checkIn || today}
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          required
          style={{
            border: "none",
            background: "transparent",
            fontSize: 15,
            fontWeight: 600,
            color: checkOut ? "var(--text-primary)" : "var(--text-muted)",
            width: "100%",
            outline: "none",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Guests */}
      <div
        style={{
          flex: "1 1 130px",
          padding: "12px 16px",
          borderRadius: "var(--radius-lg)",
          background: "var(--sand-50)",
          border: "1.5px solid var(--border-light)",
        }}
      >
        <label
          htmlFor="guests-widget"
          style={{
            display: "block",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "var(--text-muted)",
            marginBottom: 4,
          }}
        >
          Huéspedes
        </label>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            type="button"
            onClick={() => setGuests(Math.max(1, guests - 1))}
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "1.5px solid var(--border-medium)",
              background: "white",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            −
          </button>
          <span style={{ fontWeight: 700, fontSize: 16, minWidth: 20, textAlign: "center" }}>
            {guests}
          </span>
          <button
            type="button"
            onClick={() => setGuests(Math.min(6, guests + 1))}
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "1.5px solid var(--border-medium)",
              background: "white",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        style={{
          flex: "0 0 auto",
          padding: "12px 28px",
          background: "var(--gradient-brand)",
          color: "white",
          fontWeight: 700,
          fontSize: 15,
          borderRadius: "var(--radius-lg)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(24,120,184,0.4)",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: 8,
          whiteSpace: "nowrap",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Buscar
      </button>
    </form>
  );
}
