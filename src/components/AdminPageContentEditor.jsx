import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

export default function AdminPageContentEditor({
  pageKey,
  title,
  getEmptyContent,
  mergeContent,
  sectionOrder,
  sectionLabels,
  renderForm,
}) {
  const [content, setContent] = useState(getEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(sectionOrder[0] || "");

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent(pageKey)
      .then((data) => {
        setContent(mergeContent(getEmptyContent(), data && typeof data === "object" ? data : {}));
        setActiveTab(sectionOrder[0] || "");
      })
      .catch((err) => {
        setContent(mergeContent(getEmptyContent(), {}));
        setError(err.message || "Failed to load content.");
      })
      .finally(() => setLoading(false));
  }, [pageKey]);

  const updateSection = (section, field, value) => {
    setContent((c) => ({ ...c, [section]: { ...(c[section] || {}), [field]: value } }));
  };

  const updateArray = (section, field, index, itemUpdate) => {
    setContent((c) => {
      const arr = [...(c[section]?.[field] || [])];
      arr[index] = { ...(arr[index] || {}), ...itemUpdate };
      return { ...c, [section]: { ...(c[section] || {}), [field]: arr } };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent(pageKey, content);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>{title}</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>{title}</h1>
        <button type="button" onClick={handleSave} disabled={saving} style={{ padding: "10px 20px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Saving…" : "Save all"}
        </button>
      </div>
      {error && <div style={{ padding: 12, background: "#fee", color: "#c00", borderRadius: 8, marginBottom: 16 }}>{error}</div>}

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ minWidth: 160, borderRight: "1px solid #eee", paddingRight: 16 }}>
          {sectionOrder.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                marginBottom: 4,
                textAlign: "left",
                background: activeTab === key ? "#eee" : "transparent",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {sectionLabels[key]}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 300, background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {renderForm(activeTab, content, updateSection, updateArray, { inputStyle, labelStyle })}
        </div>
      </div>
    </div>
  );
}

export { inputStyle, labelStyle };
