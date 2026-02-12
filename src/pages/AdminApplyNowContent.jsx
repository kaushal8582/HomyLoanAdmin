import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";

const applyNowEmptyContent = {
  hero: {
    heading: "Unlock Your Dream Home: Find the",
    headingLine2: "Perfect Mortgage",
    subheading: "Welcome to the Easiest Home Loan Experience!",
    description: "Apply in just one minute and take the first step toward owning your dream home today.",
    zipCodeLabel: "Enter your ZIP Code",
    zipCodePlaceholder: "Enter Your Zip Code",
    ctaText: "Start Your Application",
  },
};

function mergeApplyNowContent(empty, data) {
  const getValue = (dataVal, defaultVal) => (dataVal !== null && dataVal !== undefined ? dataVal : defaultVal);

  const heroData = data?.hero || {};

  return {
    hero: {
      heading: getValue(heroData.heading, empty.hero.heading),
      headingLine2: getValue(heroData.headingLine2, empty.hero.headingLine2),
      subheading: getValue(heroData.subheading, empty.hero.subheading),
      description: getValue(heroData.description, empty.hero.description),
      zipCodeLabel: getValue(heroData.zipCodeLabel, empty.hero.zipCodeLabel),
      zipCodePlaceholder: getValue(heroData.zipCodePlaceholder, empty.hero.zipCodePlaceholder),
      ctaText: getValue(heroData.ctaText, empty.hero.ctaText),
    },
  };
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

export default function AdminApplyNowContent() {
  const [content, setContent] = useState(applyNowEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("applynow")
      .then((data) => {
        setContent(mergeApplyNowContent(applyNowEmptyContent, data && typeof data === "object" ? data : {}));
      })
      .catch((err) => {
        setContent(mergeApplyNowContent(applyNowEmptyContent, {}));
        setError(err.message || "Failed to load Apply Now content.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSection = (section, field, value) => {
    setContent((c) => ({ ...c, [section]: { ...(c[section] || {}), [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent("applynow", content);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Apply Now Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Apply Now Content</h1>
        <button type="button" onClick={handleSave} disabled={saving} style={{ padding: "10px 20px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Saving…" : "Save all"}
        </button>
      </div>
      {error && <div style={{ padding: 12, background: "#fee", color: "#c00", borderRadius: 8, marginBottom: 16 }}>{error}</div>}

      <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Hero Section</h2>
        
        <label style={labelStyle}>Heading (Line 1)</label>
        <input style={inputStyle} value={content.hero?.heading || ""} onChange={(e) => updateSection("hero", "heading", e.target.value)} />
        
        <label style={labelStyle}>Heading (Line 2)</label>
        <input style={inputStyle} value={content.hero?.headingLine2 || ""} onChange={(e) => updateSection("hero", "headingLine2", e.target.value)} />
        
        <label style={labelStyle}>Subheading</label>
        <input style={inputStyle} value={content.hero?.subheading || ""} onChange={(e) => updateSection("hero", "subheading", e.target.value)} />
        
        <label style={labelStyle}>Description</label>
        <textarea style={inputStyle} rows={3} value={content.hero?.description || ""} onChange={(e) => updateSection("hero", "description", e.target.value)} />
        
        <label style={labelStyle}>Zip Code Label</label>
        <input style={inputStyle} value={content.hero?.zipCodeLabel || ""} onChange={(e) => updateSection("hero", "zipCodeLabel", e.target.value)} />
        
        <label style={labelStyle}>Zip Code Placeholder</label>
        <input style={inputStyle} value={content.hero?.zipCodePlaceholder || ""} onChange={(e) => updateSection("hero", "zipCodePlaceholder", e.target.value)} />
        
        <label style={labelStyle}>CTA Button Text</label>
        <input style={inputStyle} value={content.hero?.ctaText || ""} onChange={(e) => updateSection("hero", "ctaText", e.target.value)} />
      </div>
    </div>
  );
}
