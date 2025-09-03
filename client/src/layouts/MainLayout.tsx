import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "white",
      }}
    >
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main style={{ flex: 1, padding: "20px" }}></main>
      </div>
    </div>
  );
}