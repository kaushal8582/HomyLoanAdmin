import React, { useState } from "react";
import { addAdmin, getStoredAdmin } from "../services/adminApi";
import toast from "react-hot-toast";

export default function AdminAddAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentAdmin = getStoredAdmin();
  const isSuperAdmin = currentAdmin?.role === "superadmin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await addAdmin(name, email, password, role);
      toast.success("Admin created successfully");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("admin");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to create admin";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    marginBottom: 16,
    border: "1px solid #ccc",
    borderRadius: 8,
    fontSize: 14,
  };

  const labelStyle = {
    display: "block",
    marginBottom: 8,
    fontWeight: 500,
    fontSize: 14,
    color: "#333",
  };

  const buttonStyle = {
    padding: "12px 24px",
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: loading ? "not-allowed" : "pointer",
    fontSize: 14,
    fontWeight: 500,
    opacity: loading ? 0.6 : 1,
  };

  if (!isSuperAdmin) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, marginBottom: 24, color: "#333" }}>Add Admin</h1>
        <div
          style={{
            padding: 16,
            background: "#fee",
            color: "#c00",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          Access denied. Only superadmins can add new admins.
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, marginBottom: 24, color: "#333" }}>Add Admin</h1>

      {error && (
        <div
          style={{
            padding: 12,
            background: "#fee",
            color: "#c00",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Name</label>
        <input
          type="text"
          style={inputStyle}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter admin name"
          disabled={loading}
        />

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter admin email"
          disabled={loading}
        />

        <label style={labelStyle}>Password</label>
        <input
          type="password"
          style={inputStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password (min 6 characters)"
          disabled={loading}
        />

        <label style={labelStyle}>Confirm Password</label>
        <input
          type="password"
          style={inputStyle}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          disabled={loading}
        />

        <label style={labelStyle}>Role</label>
        <select
          style={inputStyle}
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={loading}
        >
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Creating Admin..." : "Create Admin"}
        </button>
      </form>
    </div>
  );
}
