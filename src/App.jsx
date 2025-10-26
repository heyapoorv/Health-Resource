import React from "react";
import { Routes, Route } from "react-router-dom"; // don't import BrowserRouter here
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import "./index.css";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
