import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";

const ampEmptyContent = {
  hero: {
    heading: "HOMY LOAN-AMP",
  },
  employer: {
    topLabel: "Our Loan options",
    topHeading: "EMPLOYER MORTGAGE BENEFIT",
    topDescription: "Looking to offer your employees valuable benefits at no cost to your business? Homy Loans introduces the Homy AMP (Affinity Mortgage Program).\n\nThis program is available to businesses and institutions, helping employers provide a unique mortgage benefit to their workforce while supporting homeownership for their employees.",
    cards: [
      { title: "Zero Cost to You", desc: "This benefit costs you ZERO dollars to offer to your workforce.", dark: true },
      { title: "Dedicated Representative", desc: "Your Employees would have one dedicated Homy Representative Officer throughout the entire home buying process.", highlight: true },
      { title: "Home Buyer Education", desc: "We will educate your workforce on homeownership benefits and opportunities.", dark: true },
      { title: "Savings", desc: "By utilizing Homy AMP, your employees will receive an exclusive lender credit.", highlight: true },
    ],
    bottomLabel: "Our Loan options",
    bottomHeading: "LEARN MORE ABOUT HOMY LOAN AMP!",
  },
};

function mergeAMPContent(empty, data) {
  const cards = Array.isArray(data?.employer?.cards) && data.employer.cards.length > 0 ? data.employer.cards : empty.employer.cards;
  while (cards.length < 4) cards.push({ title: "", desc: "", dark: false, highlight: false });
  
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    employer: { ...empty.employer, cards: cards.slice(0, 10), ...(data?.employer || {}) },
  };
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

const sectionOrder = ["hero", "employer"];
const sectionLabels = { hero: "Hero", employer: "Employer" };

export default function AdminAMPContent() {
  const [content, setContent] = useState(ampEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("amp")
      .then((data) => {
        setContent(mergeAMPContent(ampEmptyContent, data && typeof data === "object" ? data : {}));
        setActiveTab("hero");
      })
      .catch((err) => {
        setContent(mergeAMPContent(ampEmptyContent, {}));
        setError(err.message || "Failed to load AMP content.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSection = (section, field, value) => {
    setContent((c) => ({ ...c, [section]: { ...(c[section] || {}), [field]: value } }));
  };

  const updateCard = (index, field, value) => {
    setContent((c) => {
      const cards = [...(c.employer?.cards || [])];
      cards[index] = { ...(cards[index] || {}), [field]: value };
      return { ...c, employer: { ...(c.employer || {}), cards } };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent("amp", content);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>AMP Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>AMP Content</h1>
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
              <label style={labelStyle}>Hero Heading</label>
              <input style={inputStyle} value={content.hero?.heading || ""} onChange={(e) => updateSection("hero", "heading", e.target.value)} />
            </>
          )}

          {activeTab === "employer" && (
            <>
              <label style={labelStyle}>Top Label</label>
              <input style={inputStyle} value={content.employer?.topLabel || ""} onChange={(e) => updateSection("employer", "topLabel", e.target.value)} />
              <label style={labelStyle}>Top Heading</label>
              <input style={inputStyle} value={content.employer?.topHeading || ""} onChange={(e) => updateSection("employer", "topHeading", e.target.value)} />
              <label style={labelStyle}>Top Description (use \n for line breaks)</label>
              <textarea style={inputStyle} rows={5} value={content.employer?.topDescription || ""} onChange={(e) => updateSection("employer", "topDescription", e.target.value)} />
              
              <label style={labelStyle}>Cards</label>
              {(content.employer?.cards || []).map((card, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <label style={{ ...labelStyle, fontSize: 12 }}>Card {i + 1}</label>
                  <input style={inputStyle} placeholder="Title" value={card.title || ""} onChange={(e) => updateCard(i, "title", e.target.value)} />
                  <textarea style={inputStyle} rows={2} placeholder="Description" value={card.desc || ""} onChange={(e) => updateCard(i, "desc", e.target.value)} />
                  <label style={{ ...labelStyle, fontSize: 12 }}>
                    <input type="checkbox" checked={card.dark || false} onChange={(e) => updateCard(i, "dark", e.target.checked)} style={{ marginRight: 8 }} />
                    Dark background
                  </label>
                  <label style={{ ...labelStyle, fontSize: 12 }}>
                    <input type="checkbox" checked={card.highlight || false} onChange={(e) => updateCard(i, "highlight", e.target.checked)} style={{ marginRight: 8 }} />
                    Highlight (yellow background)
                  </label>
                </div>
              ))}
              
              <label style={labelStyle}>Bottom Label</label>
              <input style={inputStyle} value={content.employer?.bottomLabel || ""} onChange={(e) => updateSection("employer", "bottomLabel", e.target.value)} />
              <label style={labelStyle}>Bottom Heading</label>
              <input style={inputStyle} value={content.employer?.bottomHeading || ""} onChange={(e) => updateSection("employer", "bottomHeading", e.target.value)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
