import React, { useState, useEffect } from "react";
import * as subscriptionApi from "../services/subscriptionApi";

export default function AdminSubscriptions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    subscriptionApi
      .getAllSubscriptions()
      .then(setList)
      .catch((err) => setError(err.message || "Failed to load subscriptions"))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div>
      <h1 style={{ margin: "0 0 24px", fontSize: 24 }}>Subscribers</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Emails that subscribed via the website.
      </p>
      {error && (
        <div style={{ padding: 12, background: "#fee", color: "#c00", borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th style={{ textAlign: "left", padding: 12 }}>#</th>
                <th style={{ textAlign: "left", padding: 12 }}>Email</th>
                <th style={{ textAlign: "left", padding: 12 }}>Subscribed on</th>
              </tr>
            </thead>
            <tbody>
              {list.map((sub, i) => (
                <tr key={sub._id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 12, color: "#666" }}>{i + 1}</td>
                  <td style={{ padding: 12 }}>{sub.email}</td>
                  <td style={{ padding: 12, color: "#666" }}>{formatDate(sub.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && !loading && (
            <p style={{ padding: 24, color: "#666", margin: 0 }}>No subscribers yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
