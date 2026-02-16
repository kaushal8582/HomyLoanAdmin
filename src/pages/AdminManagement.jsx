import React, { useState, useEffect } from "react";
import { getAllAdmins, updateAdmin, deleteAdmin, getStoredAdmin } from "../services/adminApi";
import toast from "react-hot-toast";

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "admin" });
  const currentAdmin = getStoredAdmin();
  const isSuperAdmin = currentAdmin?.role === "superadmin";

  useEffect(() => {
    if (isSuperAdmin) {
      loadAdmins();
    }
  }, [isSuperAdmin]);

  const loadAdmins = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllAdmins();
      setAdmins(data.admins || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to load admins");
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (admin) => {
    setEditingId(admin.id || admin._id);
    setEditForm({
      name: admin.name || "",
      email: admin.email || "",
      role: admin.role || "admin",
    });
  };

  const closeEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", email: "", role: "admin" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await updateAdmin(editingId, editForm);
      toast.success("Admin updated successfully");
      closeEdit();
      loadAdmins();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to update admin";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteAdmin(id);
      toast.success("Admin deleted successfully");
      loadAdmins();
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to delete admin";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 14,
  };

  const labelStyle = {
    display: "block",
    marginBottom: 4,
    fontWeight: 500,
    fontSize: 14,
    color: "#333",
  };

  if (!isSuperAdmin) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Admin Management</h1>
        <div
          style={{
            padding: 16,
            background: "#fee",
            color: "#c00",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          Access denied. Only superadmins can manage admins.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Admin Management</h1>
        <p>Loading admins...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Admin Management</h1>
      </div>

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

      {editingId && (
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 16 }}>Edit Admin</h2>
          <form onSubmit={handleUpdate}>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              style={inputStyle}
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />

            <label style={labelStyle}>Email</label>
            <input
              type="email"
              style={inputStyle}
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              required
            />

            <label style={labelStyle}>Role</label>
            <select
              style={inputStyle}
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
              disabled={editingId === currentAdmin?.id}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
            {editingId === currentAdmin?.id && (
              <small style={{ color: "#666", fontSize: 12, display: "block", marginTop: -8, marginBottom: 12 }}>
                You cannot change your own role
              </small>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  background: "#1a1a2e",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Update Admin
              </button>
              <button
                type="button"
                onClick={closeEdit}
                style={{
                  padding: "10px 20px",
                  background: "#ccc",
                  color: "#333",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>All Admins ({admins.length})</h2>
        {admins.length === 0 ? (
          <p style={{ color: "#666" }}>No admins found</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, fontSize: 14 }}>Name</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, fontSize: 14 }}>Email</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, fontSize: 14 }}>Role</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, fontSize: 14 }}>Created</th>
                  <th style={{ padding: "12px", textAlign: "left", fontWeight: 600, fontSize: 14 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => {
                  const adminId = admin.id || admin._id;
                  const isCurrentAdmin = adminId === currentAdmin?.id;
                  return (
                    <tr key={adminId} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px", fontSize: 14 }}>{admin.name}</td>
                      <td style={{ padding: "12px", fontSize: 14 }}>{admin.email}</td>
                      <td style={{ padding: "12px", fontSize: 14 }}>
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 500,
                            background: admin.role === "superadmin" ? "#E6FF4B" : "#e0e0e0",
                            color: admin.role === "superadmin" ? "#000" : "#333",
                          }}
                        >
                          {admin.role === "superadmin" ? "Super Admin" : "Admin"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", fontSize: 14, color: "#666" }}>
                        {formatDate(admin.createdAt)}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => openEdit(admin)}
                            style={{
                              padding: "6px 12px",
                              background: "#1a1a2e",
                              color: "#fff",
                              border: "none",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontSize: 12,
                            }}
                          >
                            Edit
                          </button>
                          {!isCurrentAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDelete(adminId)}
                              style={{
                                padding: "6px 12px",
                                background: "#c00",
                                color: "#fff",
                                border: "none",
                                borderRadius: 6,
                                cursor: "pointer",
                                fontSize: 12,
                              }}
                            >
                              Delete
                            </button>
                          )}
                          {isCurrentAdmin && (
                            <span style={{ fontSize: 12, color: "#666", padding: "6px 12px" }}>You</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
