import React from "react";

export default function Navbar(){
  return (
    <header className="navbar">
      <div className="logo">Community Health Tracker</div>
      <nav>
        <a href="#resources" style={{marginRight:12}}>Resources</a>
        <a href="#book">Book</a>
      </nav>
    </header>
  );
}
