import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";
import { uploadImage, uploadVideo } from "../services/uploadApi";

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };
const thumbStyle = { width: 48, height: 48, objectFit: "cover", borderRadius: 4, marginLeft: 8 };
const isImageUrl = (s) => typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/"));

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
  const [imageUploading, setImageUploading] = useState(null);
  const [videoUploading, setVideoUploading] = useState(null);

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

  const addArrayItem = (section, field, defaultItem) => {
    setContent((c) => {
      const arr = [...(c[section]?.[field] || []), defaultItem];
      return { ...c, [section]: { ...(c[section] || {}), [field]: arr } };
    });
  };

  const removeArrayItem = (section, field, index) => {
    setContent((c) => {
      const arr = [...(c[section]?.[field] || [])];
      arr.splice(index, 1);
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
          {renderForm(activeTab, content, updateSection, updateArray, {
        inputStyle,
        labelStyle,
        uploadImage,
        uploadVideo,
        imageUploading,
        setImageUploading,
        videoUploading,
        setVideoUploading,
        setError,
        isImageUrl,
        thumbStyle,
        addArrayItem,
        removeArrayItem,
      })}
        </div>
      </div>
    </div>
  );
}

/** Renders label, URL input, thumbnail, and file upload for an image field. Use inside renderForm with opts from 5th argument. */
/** Renders Video URL input + Upload video file input. Use for hero.videoUrl. */
export function renderHeroVideoField(section, field, value, setField, opts) {
  const { inputStyle, labelStyle, uploadVideo, videoUploading, setVideoUploading, setError } = opts || {};
  const key = `${section}-${field}`;
  const uploading = videoUploading === key;
  const handleFile = async (e) => {
    const file = e.target?.files?.[0];
    if (!file || !uploadVideo) return;
    setVideoUploading?.(key);
    setError?.("");
    try {
      const url = await uploadVideo(file);
      setField(field, url);
    } catch (err) {
      setError?.(err.message || "Video upload failed");
    } finally {
      setVideoUploading?.(null);
      e.target.value = "";
    }
  };
  return (
    <>
      <label style={labelStyle}>Hero video (URL or upload)</label>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        <input style={{ ...inputStyle, flex: 1, minWidth: 200 }} value={value || ""} onChange={(e) => setField(field, e.target.value)} placeholder="Video URL" />
      </div>
      <input type="file" accept="video/*" onChange={handleFile} disabled={uploading} style={{ marginBottom: 8 }} />
      {uploading && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
    </>
  );
}

export function renderImageField(section, field, value, setField, opts) {
  const { inputStyle, labelStyle, uploadImage, imageUploading, setImageUploading, setError, isImageUrl, thumbStyle } = opts || {};
  const key = `${section}-${field}`;
  const uploading = imageUploading === key;
  const handleFile = async (e) => {
    const file = e.target?.files?.[0];
    if (!file || !uploadImage) return;
    setImageUploading?.(key);
    setError?.("");
    try {
      const url = await uploadImage(file);
      setField(field, url);
    } catch (err) {
      setError?.(err.message || "Image upload failed");
    } finally {
      setImageUploading?.(null);
      e.target.value = "";
    }
  };
  return (
    <>
      <label style={labelStyle}>Image (URL or upload)</label>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
        <input style={{ ...inputStyle, flex: 1, minWidth: 200 }} value={value || ""} onChange={(e) => setField(field, e.target.value)} placeholder="Image URL" />
        {isImageUrl?.(value) && <img src={value} alt="" style={thumbStyle} />}
      </div>
      <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} style={{ marginBottom: 8 }} />
      {uploading && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
    </>
  );
}

export { inputStyle, labelStyle };
