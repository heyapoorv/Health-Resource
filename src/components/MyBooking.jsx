import React, { useState } from "react";

const API = import.meta.env.VITE_API_BASE;

export default function MyBookings() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchBookings() {
    if (!phone || phone.trim().length !== 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/bookings?phone=${phone}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch bookings");
      }

      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>My Bookings 📝</h2>

      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Enter your phone number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <button onClick={fetchBookings}>Fetch</button>
      </div>

      {loading && <div>Loading bookings...</div>}
      {error && <div style={{ color: "crimson" }}>{error}</div>}

      {bookings.length > 0 && (
        <ul>
          {bookings.map(b => {
            // Format date
            const dateStr = b.date
              ? new Date(b.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })
              : "-";

            // Format time
            const timeStr = b.time || "-";

            return (
              <li
                key={b._id}
                style={{
                  marginBottom: "12px",
                  padding: "8px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  backgroundColor: "#f9fafb"
                }}
              >
                <div>
                  <strong>Resource:</strong>{" "}
                  {b.resourceId?.name || "N/A"}
                </div>
                <div>
                  <strong>Requirement:</strong>{" "}
                  {b.requirement
                    ? b.requirement.charAt(0).toUpperCase() +
                      b.requirement.slice(1)
                    : "-"}
                </div>
                <div>
                  <strong>Date/Time:</strong>{" "}
                  {dateStr} {timeStr !== "-" ? timeStr : ""}
                </div>
                <div>
                  <strong>Ref:</strong> {b.referenceId || "-"}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {bookings.length === 0 && !loading && !error && (
        <div>No bookings found.</div>
      )}
    </div>
  );
}
