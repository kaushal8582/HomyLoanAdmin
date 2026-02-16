import React, { useState, useEffect } from "react";
import { getStoredAdmin, setStoredAuth, updateOwnProfile } from "../services/adminApi";
import toast from "react-hot-toast";

export default function AdminAccountSettings() {
  const currentAdmin = getStoredAdmin();
  const [form, setForm] = useState({
    name: currentAdmin?.name || "",
    email: currentAdmin?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentAdmin) {
      setForm({
        name: currentAdmin.name || "",
        email: currentAdmin.email || "",
      });
    }
  }, [currentAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email) {
      setError("All fields are required");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const data = await updateOwnProfile(form);
      // Update stored admin data
      const updatedAdmin = {
        ...currentAdmin,
        name: data.admin.name,
        email: data.admin.email,
      };
      setStoredAuth(null, updatedAdmin);
      toast.success("Profile updated successfully");
      // Reload page to reflect changes
      window.location.reload();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to update profile";
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

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, marginBottom: 24, color: "#333" }}>Account Settings</h1>

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

      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Profile Information</h2>
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Name</label>
          <input
            type="text"
            style={inputStyle}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter your name"
            disabled={loading}
            required
          />

          <label style={labelStyle}>Email</label>
          <input
            type="email"
            style={inputStyle}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter your email"
            disabled={loading}
            required
          />

          <label style={labelStyle}>Role</label>
          <input
            type="text"
            style={{ ...inputStyle, background: "#f5f5f5", cursor: "not-allowed" }}
            value={currentAdmin?.role === "superadmin" ? "Super Admin" : "Admin"}
            disabled
          />
          <small style={{ color: "#666", fontSize: 12, display: "block", marginTop: -12, marginBottom: 16 }}>
            Role cannot be changed. Contact a superadmin to change your role.
          </small>

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>

      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>Account Information</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Account ID</div>
            <div style={{ fontSize: 14, color: "#333", fontFamily: "monospace" }}>
              {currentAdmin?.id || "—"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>Role</div>
            <div style={{ fontSize: 14, color: "#333" }}>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  background: currentAdmin?.role === "superadmin" ? "#E6FF4B" : "#e0e0e0",
                  color: currentAdmin?.role === "superadmin" ? "#000" : "#333",
                }}
              >
                {currentAdmin?.role === "superadmin" ? "Super Admin" : "Admin"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
