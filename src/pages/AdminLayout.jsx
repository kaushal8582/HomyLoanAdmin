import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { adminLogout, getStoredAdmin } from "../services/adminApi";

export default function AdminLayout() {
  const navigate = useNavigate();
  const admin = getStoredAdmin();

  const handleLogout = () => {
    adminLogout();
    navigate("/login", { replace: true });
  };

  const navStyle = ({ isActive }) => ({
    padding: "8px 16px",
    textDecoration: "none",
    color: isActive ? "#fff" : "#b0b0b0",
    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
    borderRadius: 8,
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 240,
          background: "#1a1a2e",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ color: "#fff", fontWeight: 600, marginBottom: 24 }}>
          HomyLoan Admin
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <NavLink to="/" end style={navStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/blogs" style={navStyle}>
            Blogs
          </NavLink>
          <NavLink to="/press" style={navStyle}>
            Press
          </NavLink>
          <NavLink to="/subscriptions" style={navStyle}>
            Subscriptions
          </NavLink>
          <NavLink to="/homepage" style={navStyle}>
            Homepage Content
          </NavLink>
        </nav>
        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          {admin && (
            <div style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>
              {admin.email}
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "#b0b0b0",
              border: "1px solid #444",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main
        style={{
          flex: 1,
          padding: 24,
          overflow: "auto",
          background: "#f5f5f5",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
