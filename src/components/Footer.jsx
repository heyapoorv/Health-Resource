import React from "react";

export default function Footer(){
  return (
    <footer className="footer">
      © {new Date().getFullYear()} Community Health Resource Tracker
    </footer>
  );
}
