import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as jobApi from "../services/jobApi";
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
    maxWidth: 600,
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

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    type: "Full-time",
    department: "",
    image: "",
    tag: "",
    applicationLink: "",
  });
  const [uploading, setUploading] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await jobApi.getAllJobs();
      setJobs(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      title: "",
      description: "",
      location: "",
      type: "Full-time",
      department: "",
      image: "",
      tag: "",
      applicationLink: "",
    });
    setFormOpen(true);
  };

  const openEdit = (j) => {
    setEditingId(j.id);
    setForm({
      title: j.title,
      description: j.description,
      location: j.location,
      type: j.type || "Full-time",
      department: j.department || "",
      image: j.image || "",
      tag: Array.isArray(j.tag) ? j.tag.join(", ") : (j.tag || ""),
      applicationLink: j.applicationLink || "",
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
      location: form.location,
      type: form.type,
      department: form.department || undefined,
      image: form.image || undefined,
      tag,
      applicationLink: form.applicationLink || undefined,
    };
    try {
      if (editingId) {
        await jobApi.updateJob(editingId, payload);
      } else {
        await jobApi.createJob(payload);
      }
      setFormOpen(false);
      loadJobs();
      toast.success(editingId ? "Job updated successfully" : "Job created successfully");
    } catch (err) {
      setError(err.message || "Save failed");
      toast.error("Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job position?")) return;
    try {
      await jobApi.deleteJob(id);
      loadJobs();
      toast.success("Job deleted successfully");
    } catch (err) {
      setError(err.message || "Delete failed");
      toast.error("Delete failed");
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  };

  const excerpt = (text, max = 120) => {
    if (!text) return "";
    return text.length <= max ? text.slice(0, max).trim() + "…" : text;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Job Positions</h1>
        <button type="button" onClick={openAdd} style={formStyles.btn(true)}>
          Add Job
        </button>
      </div>
      {error && (
        <div style={{ padding: 12, background: "#fee", color: "#c00", borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}
      {loading ? (
        <p>Loading…</p>
      ) : jobs.length === 0 ? (
        <p style={{ padding: 24, color: "#666" }}>No job positions yet. Add one to get started.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {jobs.map((j) => (
            <div
              key={j.id}
              style={{
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 6px rgba(0,0,0,0.07)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ position: "relative", height: 200, background: "#eee" }}>
                {j.image ? (
                  <img
                    src={j.image}
                    alt={j.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
                    No image
                  </div>
                )}
                <span
                  style={{
                    position: "absolute",
                    left: 12,
                    bottom: 12,
                    background: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                >
                  {formatDate(j.createdAt)}
                </span>
              </div>
              <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: "#e3f2fd",
                      color: "#1976d2",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {j.type}
                  </span>
                  {(Array.isArray(j.tag) ? j.tag : []).map((t) => (
                    <span
                      key={t}
                      style={{
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: "#f3f4f6",
                        color: "#374151",
                        fontSize: 12,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>
                  {j.title}
                </h2>
                <p style={{ margin: "0 0 8px", fontSize: 14, color: "#666" }}>
                  📍 {j.location}
                </p>
                {j.department && (
                  <p style={{ margin: "0 0 8px", fontSize: 14, color: "#666" }}>
                    🏢 {j.department}
                  </p>
                )}
                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: 14,
                    color: "#4b5563",
                    lineHeight: 1.5,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {excerpt(j.description)}
                </p>
                <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => openEdit(j)}
                    style={{ ...formStyles.btn(false), flex: 1 }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(j.id)}
                    style={{ ...formStyles.btn(false), color: "#c00" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div style={formStyles.overlay} onClick={() => setFormOpen(false)}>
          <div style={formStyles.box} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 16px" }}>{editingId ? "Edit job" : "Add job"}</h2>
            <form onSubmit={handleSubmit}>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Title *</label>
              <input
                style={formStyles.input}
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Description *</label>
              <textarea
                style={{ ...formStyles.input, minHeight: 100 }}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
              />
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Location *</label>
              <input
                style={formStyles.input}
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                required
              />
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Type *</label>
              <select
                style={formStyles.input}
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Department</label>
              <input
                style={formStyles.input}
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                placeholder="e.g. Engineering, Sales"
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
                placeholder="e.g. Engineering, Sales, Marketing"
              />
              <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Application Link</label>
              <input
                style={formStyles.input}
                value={form.applicationLink}
                onChange={(e) => setForm((f) => ({ ...f, applicationLink: e.target.value }))}
                placeholder="https://..."
                type="url"
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
