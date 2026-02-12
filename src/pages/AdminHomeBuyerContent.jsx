import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";

const homeBuyerEmptyContent = {
  hero: {
    pillText: "HOMY LOANS",
    heading: "Homebuyer's guide",
    ctaText: "Check Today's Rate",
  },
  homeBuyerGuide: {
    heading: "HOMEBUYER'S GUIDE",
    guides: [
      { title: "HOMEBUYER'S GUIDE", desc: "The Do's and Don'ts guide helps ensure your credit and qualifications stay unchanged during loan processing, protecting your home loan approval.", downloadFile: "" },
      { title: "FREE CHECKLISTS", desc: "Join a team of visionary architects and designers who inspire, challenge, and support each other to create extraordinary spaces.", downloadFile: "" },
      { title: "6 STEPS TO HOMEOWNERSHIP", desc: "Homy Loans makes home buying simple, guiding you from application to closing and beyond.", downloadFile: "" },
      { title: "HOMEOWNERSHIP BENEFITS", desc: "Homy Loans helps families achieve homeownership, an exciting milestone with lasting financial and personal benefits.", downloadFile: "" },
    ],
  },
};

function mergeHomeBuyerContent(empty, data) {
  const getValue = (dataVal, defaultVal) => (dataVal !== null && dataVal !== undefined ? dataVal : defaultVal);

  const heroData = data?.hero || {};
  const homeBuyerGuideData = data?.homeBuyerGuide || {};
  
  let guides = [];
  if (Array.isArray(homeBuyerGuideData.guides) && homeBuyerGuideData.guides.length > 0) {
    guides = homeBuyerGuideData.guides.map((guide, i) => ({
      title: getValue(guide?.title, empty.homeBuyerGuide.guides[i]?.title || ""),
      desc: getValue(guide?.desc, empty.homeBuyerGuide.guides[i]?.desc || ""),
      downloadFile: getValue(guide?.downloadFile, empty.homeBuyerGuide.guides[i]?.downloadFile || ""),
    }));
  } else {
    guides = [...(empty.homeBuyerGuide.guides || [])];
  }
  while (guides.length < 4) guides.push({ title: "", desc: "", downloadFile: "" });

  return {
    hero: {
      pillText: getValue(heroData.pillText, empty.hero.pillText),
      heading: getValue(heroData.heading, empty.hero.heading),
      ctaText: getValue(heroData.ctaText, empty.hero.ctaText),
    },
    homeBuyerGuide: {
      heading: getValue(homeBuyerGuideData.heading, empty.homeBuyerGuide.heading),
      guides: guides.slice(0, 4),
    },
  };
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

const sectionOrder = ["hero", "homeBuyerGuide"];
const sectionLabels = { hero: "Hero", homeBuyerGuide: "Homebuyer Guide" };

export default function AdminHomeBuyerContent() {
  const [content, setContent] = useState(homeBuyerEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("homebuyer")
      .then((data) => {
        setContent(mergeHomeBuyerContent(homeBuyerEmptyContent, data && typeof data === "object" ? data : {}));
        setActiveTab("hero");
      })
      .catch((err) => {
        setContent(mergeHomeBuyerContent(homeBuyerEmptyContent, {}));
        setError(err.message || "Failed to load Homebuyer Guide content.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSection = (section, field, value) => {
    setContent((c) => ({ ...c, [section]: { ...(c[section] || {}), [field]: value } }));
  };

  const updateGuide = (index, field, value) => {
    setContent((c) => {
      const guides = [...(c.homeBuyerGuide?.guides || [])];
      guides[index] = { ...(guides[index] || {}), [field]: value };
      return { ...c, homeBuyerGuide: { ...(c.homeBuyerGuide || {}), guides } };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent("homebuyer", content);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Homebuyer Guide Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Homebuyer Guide Content</h1>
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
          {activeTab === "hero" && (
            <>
              <label style={labelStyle}>Pill Text</label>
              <input style={inputStyle} value={content.hero?.pillText || ""} onChange={(e) => updateSection("hero", "pillText", e.target.value)} />
              <label style={labelStyle}>Hero Heading</label>
              <input style={inputStyle} value={content.hero?.heading || ""} onChange={(e) => updateSection("hero", "heading", e.target.value)} />
              <label style={labelStyle}>CTA Text</label>
              <input style={inputStyle} value={content.hero?.ctaText || ""} onChange={(e) => updateSection("hero", "ctaText", e.target.value)} />
            </>
          )}

          {activeTab === "homeBuyerGuide" && (
            <>
              <label style={labelStyle}>Section Heading</label>
              <input style={inputStyle} value={content.homeBuyerGuide?.heading || ""} onChange={(e) => updateSection("homeBuyerGuide", "heading", e.target.value)} />
              
              <label style={labelStyle}>Guides</label>
              {(content.homeBuyerGuide?.guides || []).map((guide, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <label style={{ ...labelStyle, fontSize: 12 }}>Guide {i + 1}</label>
                  <input style={inputStyle} placeholder="Title" value={guide.title || ""} onChange={(e) => updateGuide(i, "title", e.target.value)} />
                  <textarea style={inputStyle} rows={2} placeholder="Description" value={guide.desc || ""} onChange={(e) => updateGuide(i, "desc", e.target.value)} />
                  <label style={{ ...labelStyle, fontSize: 12 }}>Download File URL (PDF, DOC, etc.)</label>
                  <input style={inputStyle} placeholder="https://example.com/guide.pdf" value={guide.downloadFile || ""} onChange={(e) => updateGuide(i, "downloadFile", e.target.value)} />
                  <small style={{ color: "#666", fontSize: 12 }}>Enter the full URL to the file that will be downloaded when users click the download button</small>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
