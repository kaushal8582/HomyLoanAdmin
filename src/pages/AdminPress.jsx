import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as pressApi from "../services/pressApi";
import { uploadImage } from "../services/uploadApi";

const formStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  box: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90vh",
    overflow: "auto",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 8,
    fontSize: 16,
  },
  row: { display: "flex", gap: 12, marginTop: 16 },
  btn: (primary) => ({
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    fontSize: 14,
    cursor: "pointer",
    background: primary ? "#1a1a2e" : "#e0e0e0",
    color: primary ? "#fff" : "#333",
  }),
};

export default function AdminPress() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    tag: "",
  });
  const [uploading, setUploading] = useState(false);

  const loadPress = async () => {
    try {
      setLoading(true);
      const data = await pressApi.getAllPress();
      setList(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load press");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPress();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ title: "", description: "", image: "", tag: "" });
    setFormOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title,
      description: p.description,
      image: p.image || "",
      tag: Array.isArray(p.tag) ? p.tag.join(", ") : (p.tag || ""),
    });
    setFormOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const tag = form.tag
      ? form.tag.split(",").map((t) => t.trim()).filter(Boolean)
      : [];
    const payload = {
      title: form.title,
      description: form.description,
      image: form.image || undefined,
      tag,
    };
    try {
      if (editingId) {
        await pressApi.updatePress(editingId, payload);
      } else {
        await pressApi.createPress(payload);
      }
      setFormOpen(false);
      loadPress();
      toast.success(editingId ? "Press item updated successfully" : "Press item created successfully");
    } catch (err) {
      setError(err.message || "Save failed");
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this press item?")) return;
    try {
      await pressApi.deletePress(id);
      loadPress();
      toast.success("Press item deleted successfully");
    } catch (err) {
      setError(err.message || "Delete failed");
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Press</h1>
        <button type="button" onClick={openAdd} style={formStyles.btn(true)}>
          Add press
        </button>
      </div>
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
                <th style={{ textAlign: "left", padding: 12 }}>Title</th>
                <th style={{ textAlign: "left", padding: 12 }}>Image</th>
                <th style={{ textAlign: "right", padding: 12 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p._id} style={{ borderTop: "1px solid #eee" }}>
                  <td style={{ padding: 12 }}>{p.title}</td>
                  <td style={{ padding: 12 }}>
                    {p.image ? (
                      <img src={p.image} alt="" style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td style={{ padding: 12, textAlign: "right" }}>
                    <button type="button" onClick={() => openEdit(p)} style={{ ...formStyles.btn(false), marginRight: 8 }}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(p._id)} style={{ ...formStyles.btn(false), color: "#c00" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {list.length === 0 && !loading && (
            <p style={{ padding: 24, color: "#666", margin: 0 }}>No press items yet. Add one to get started.</p>
          )}
        </div>
      )}

      {formOpen && (
        <div style={formStyles.overlay} onClick={() => setFormOpen(false)}>
          <div style={formStyles.box} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 16px" }}>{editingId ? "Edit press" : "Add press"}</h2>
            <form onSubmit={handleSubmit}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Title</label>
              <input
                style={formStyles.input}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Description</label>
              <textarea
                style={{ ...formStyles.input, minHeight: 100 }}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
              />
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Image (URL or upload)</label>
              <input
                style={formStyles.input}
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="Paste URL or upload below"
              />
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ marginBottom: 12 }} />
              {uploading && <span style={{ fontSize: 12, color: "#666" }}> Uploading…</span>}
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Tags (comma-separated)</label>
              <input
                style={formStyles.input}
                value={form.tag}
                onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                placeholder="e.g. News, Awards"
              />
              <div style={formStyles.row}>
                <button type="submit" style={formStyles.btn(true)}>
                  {editingId ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setFormOpen(false)} style={formStyles.btn(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
