import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";

const mortgagePaymentEmptyContent = {
  hero: {
    heading: "Mortgage Payment",
    ctaText: "Check Today's Rate",
  },
  onlinePayment: {
    heading: "NOW YOU CAN MAKE YOUR",
    headingLine2: "PAYMENTS ONLINE!",
    listItems: [
      "Steps to make your mortgage payment:",
      "Click on the \"Mortgage Payment Form\" to access the DocuSign document.",
      "Fill out the DocuSign ACH Authorization form.",
      "Click Send.",
      "That's it! Someone from our team will email you confirmation when completed.",
    ],
    image: "/OnlinePayment.svg",
  },
};

function mergeMortgagePaymentContent(empty, data) {
  const getValue = (dataVal, defaultVal) => (dataVal !== null && dataVal !== undefined ? dataVal : defaultVal);

  const heroData = data?.hero || {};
  const onlinePaymentData = data?.onlinePayment || {};
  
  let listItems = [];
  if (Array.isArray(onlinePaymentData.listItems) && onlinePaymentData.listItems.length > 0) {
    listItems = onlinePaymentData.listItems.map(item => getValue(item, ""));
  } else {
    listItems = [...(empty.onlinePayment.listItems || [])];
  }
  while (listItems.length < 5) listItems.push("");

  return {
    hero: {
      heading: getValue(heroData.heading, empty.hero.heading),
      ctaText: getValue(heroData.ctaText, empty.hero.ctaText),
    },
    onlinePayment: {
      heading: getValue(onlinePaymentData.heading, empty.onlinePayment.heading),
      headingLine2: getValue(onlinePaymentData.headingLine2, empty.onlinePayment.headingLine2),
      listItems: listItems.slice(0, 5),
      image: getValue(onlinePaymentData.image, empty.onlinePayment.image),
    },
  };
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

const sectionOrder = ["hero", "onlinePayment"];
const sectionLabels = { hero: "Hero", onlinePayment: "Online Payment" };

export default function AdminMortgagePaymentContent() {
  const [content, setContent] = useState(mortgagePaymentEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("mortgagepayment")
      .then((data) => {
        setContent(mergeMortgagePaymentContent(mortgagePaymentEmptyContent, data && typeof data === "object" ? data : {}));
        setActiveTab("hero");
      })
      .catch((err) => {
        setContent(mergeMortgagePaymentContent(mortgagePaymentEmptyContent, {}));
        setError(err.message || "Failed to load Mortgage Payment content.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSection = (section, field, value) => {
    setContent((c) => ({ ...c, [section]: { ...(c[section] || {}), [field]: value } }));
  };

  const updateListItem = (index, value) => {
    setContent((c) => {
      const listItems = [...(c.onlinePayment?.listItems || [])];
      listItems[index] = value;
      return { ...c, onlinePayment: { ...(c.onlinePayment || {}), listItems } };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent("mortgagepayment", content);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Mortgage Payment Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Mortgage Payment Content</h1>
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
              <label style={labelStyle}>CTA Text</label>
              <input style={inputStyle} value={content.hero?.ctaText || ""} onChange={(e) => updateSection("hero", "ctaText", e.target.value)} />
            </>
          )}

          {activeTab === "onlinePayment" && (
            <>
              <label style={labelStyle}>Heading (Line 1)</label>
              <input style={inputStyle} value={content.onlinePayment?.heading || ""} onChange={(e) => updateSection("onlinePayment", "heading", e.target.value)} />
              <label style={labelStyle}>Heading (Line 2)</label>
              <input style={inputStyle} value={content.onlinePayment?.headingLine2 || ""} onChange={(e) => updateSection("onlinePayment", "headingLine2", e.target.value)} />
              
              <label style={labelStyle}>List Items</label>
              {(content.onlinePayment?.listItems || []).map((item, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <label style={{ ...labelStyle, fontSize: 12 }}>Item {i + 1}</label>
                  <input style={inputStyle} value={item || ""} onChange={(e) => updateListItem(i, e.target.value)} placeholder={`List item ${i + 1}`} />
                </div>
              ))}
              
              <label style={labelStyle}>Image URL</label>
              <input style={inputStyle} value={content.onlinePayment?.image || ""} onChange={(e) => updateSection("onlinePayment", "image", e.target.value)} placeholder="/OnlinePayment.svg" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
