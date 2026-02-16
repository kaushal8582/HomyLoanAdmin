import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as pageContentApi from "../services/pageContentApi";
import { uploadImage, uploadVideo } from "../services/uploadApi";

const leadershipEmptyContent = {
  hero: {
    heading: "Our Leadership Team",
    videoUrls: [],
  },
  leaders: [
    { name: "Nick Hunt", role: "Chief Financial Officer", image: "" },
    { name: "Nick Hunt", role: "Chief Financial Officer", image: "" },
    { name: "Nick Hunt", role: "Chief Financial Officer", image: "" },
  ],
};

function mergeLeadershipContent(empty, data) {
  const leaders = Array.isArray(data?.leaders) && data.leaders.length > 0 ? data.leaders : empty.leaders;
  // Ensure at least 3 leaders, pad if needed
  const paddedLeaders = [...leaders];
  while (paddedLeaders.length < 3) {
    paddedLeaders.push({ name: "", role: "", image: "" });
  }
  const heroData = data?.hero || {};
  let heroVideoUrls = [];
  if (Array.isArray(heroData.videoUrls) && heroData.videoUrls.length > 0) {
    heroVideoUrls = heroData.videoUrls;
  } else if (heroData.videoUrl && String(heroData.videoUrl).trim()) {
    heroVideoUrls = [heroData.videoUrl.trim()];
  }
  const hero = { ...empty.hero, ...heroData, videoUrls: heroVideoUrls };
  return {
    hero,
    leaders: paddedLeaders.slice(0, 10), // Allow up to 10 leaders
  };
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

export default function AdminLeadershipContent() {
  const [content, setContent] = useState(leadershipEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("leadership")
      .then((data) => {
        setContent(mergeLeadershipContent(leadershipEmptyContent, data && typeof data === "object" ? data : {}));
      })
      .catch((err) => {
        setContent(mergeLeadershipContent(leadershipEmptyContent, {}));
        setError(err.message || "Failed to load Leadership content.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSection = (section, field, value) => {
    setContent((c) => ({ ...c, [section]: { ...(c[section] || {}), [field]: value } }));
  };

  const updateLeader = (index, field, value) => {
    setContent((c) => {
      const leaders = [...(c.leaders || [])];
      leaders[index] = { ...(leaders[index] || {}), [field]: value };
      return { ...c, leaders };
    });
  };

  const addLeader = () => {
    setContent((c) => ({
      ...c,
      leaders: [...(c.leaders || []), { name: "", role: "", image: "" }],
    }));
  };

  const removeLeader = (index) => {
    setContent((c) => {
      const leaders = (c.leaders || []).filter((_, i) => i !== index);
      return { ...c, leaders };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent("leadership", content);
      toast.success("Saved successfully");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Save failed");
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const isImageUrl = (s) => typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://"));
  const thumbStyle = { width: 48, height: 48, objectFit: "cover", borderRadius: 4, marginLeft: 8 };

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Leadership Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Leadership Content</h1>
        <button type="button" onClick={handleSave} disabled={saving} style={{ padding: "10px 20px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Saving…" : "Save all"}
        </button>
      </div>
      {error && <div style={{ padding: 12, background: "#fee", color: "#c00", borderRadius: 8, marginBottom: 16 }}>{error}</div>}

      <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <label style={labelStyle}>Hero Heading</label>
        <input style={inputStyle} value={content.hero?.heading || ""} onChange={(e) => updateSection("hero", "heading", e.target.value)} />

        <label style={labelStyle}>Videos (upload or paste URLs)</label>
        <input type="file" accept="video/*" onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setVideoUploading(true);
          setError("");
          try {
            const url = await uploadVideo(file);
            updateSection("hero", "videoUrls", [...(content.hero?.videoUrls || []), url]);
          } catch (err) { setError(err.message || "Video upload failed"); }
          setVideoUploading(false);
          e.target.value = "";
        }} disabled={videoUploading} style={{ marginBottom: 8 }} />
        {videoUploading && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
        {(content.hero?.videoUrls || []).map((url, i) => (
          <div key={i} style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <input style={inputStyle} value={url} onChange={(e) => {
              const urls = [...(content.hero?.videoUrls || [])];
              urls[i] = e.target.value;
              updateSection("hero", "videoUrls", urls);
            }} placeholder="Video URL" />
            <button type="button" onClick={() => updateSection("hero", "videoUrls", (content.hero?.videoUrls || []).filter((_, j) => j !== i))} style={{ padding: "6px 12px", background: "#c00", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Remove</button>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 16 }}>
          <label style={labelStyle}>Leadership Team Members</label>
          <button
            type="button"
            onClick={addLeader}
            style={{ padding: "6px 12px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}
          >
            + Add Leader
          </button>
        </div>

        {(content.leaders || []).map((leader, index) => (
          <div key={index} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>Leader {index + 1}</span>
              <button
                type="button"
                onClick={() => removeLeader(index)}
                style={{ padding: "4px 8px", background: "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
              >
                Remove
              </button>
            </div>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} value={leader.name || ""} onChange={(e) => updateLeader(index, "name", e.target.value)} />
            <label style={labelStyle}>Role</label>
            <input style={inputStyle} value={leader.role || ""} onChange={(e) => updateLeader(index, "role", e.target.value)} />
            <label style={labelStyle}>Image (URL or upload)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={leader.image || ""} onChange={(e) => updateLeader(index, "image", e.target.value)} placeholder="Paste URL or upload below" />
              {(leader.image && isImageUrl(leader.image)) && <img src={leader.image} alt="" style={thumbStyle} />}
            </div>
            <input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setImageUploading(`leader-${index}`);
              try {
                const url = await uploadImage(file);
                updateLeader(index, "image", url);
              } catch (err) { setError(err.message || "Image upload failed"); }
              setImageUploading(null);
            }} disabled={!!imageUploading} style={{ marginBottom: 0 }} />
            {imageUploading === `leader-${index}` && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
