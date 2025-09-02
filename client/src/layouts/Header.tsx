import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Header() {
  return (
    <header
      style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        borderBottom: "1px solid #ddd",
        background: "none",
      }}
    >
      {/* Left Side Title */}
      <h2 style={{ margin: 0, fontSize: 20, color: "#8b5e3c" }}>
        AURCT PLACEMENT DASHBOARD
      </h2>

      {/* Right Side Bell Icon */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <i
          className="fas fa-bell"
          style={{ fontSize: 20, cursor: "pointer", color: "#8b5e3c" }}
        ></i>
      </div>
    </header>
  );
}