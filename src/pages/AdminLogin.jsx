import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { adminLogin, setStoredAuth, getStoredToken } from "../services/adminApi";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (getStoredToken()) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await adminLogin(email, password);
      setStoredAuth(res.token, res.admin);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 360,
          padding: 32,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <h1 style={{ margin: "0 0 24px", fontSize: 24 }}>HomyLoan Admin</h1>
        {error && (
          <div
            style={{
              padding: "10px 12px",
              marginBottom: 16,
              background: "#fee",
              color: "#c00",
              borderRadius: 8,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}
        <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 16,
            border: "1px solid #ccc",
            borderRadius: 8,
            fontSize: 16,
          }}
        />
        <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px 12px",
            marginBottom: 24,
            border: "1px solid #ccc",
            borderRadius: 8,
            fontSize: 16,
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "#1a1a2e",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
