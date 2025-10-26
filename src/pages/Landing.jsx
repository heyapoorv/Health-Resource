import React from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <header className="landing-header">
        <h1>Welcome to BloodConnect</h1>
        <p>Your one-stop platform for donating and requesting blood & medical resources.</p>
        <div className="landing-buttons">
          <button onClick={() => navigate("/home")}>See Nearby Resources</button>
          <button onClick={() => navigate("/home")}>Book a Demo</button>
        </div>
      </header>
      <section className="landing-info">
        <div className="info-card">
          <h3>Easy Donations</h3>
          <p>Find blood banks near you and schedule a donation in minutes.</p>
        </div>
        <div className="info-card">
          <h3>Request Blood</h3>
          <p>Submit an emergency request, and we’ll notify nearby donors immediately.</p>
        </div>
        <div className="info-card">
          <h3>Health Tips</h3>
          <p>Learn how to stay safe before and after donating blood.</p>
        </div>
      </section>
    </div>
  );
}
