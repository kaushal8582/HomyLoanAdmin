import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";
import { uploadImage } from "../services/uploadApi";

const aboutUsEmptyContent = {
  hero: {
    heading: "About Us",
    pillText: "HOMY LOANS",
  },
  homyLoan: {
    heading: "Homy Loans",
    description: "At Homy Loans, our mission is to approach every aspect of our business from the inside-out. By focusing on our loan originators and support staff first, we ensure an exceptional experience for every customer. Founded on the principle of \"Be Human,\" our culture prioritizes care for people—both our team and the homeowners we serve.",
  },
  philosophy: {
    heading: "Our Philosophy",
    description: "While the mortgage industry trends toward automation, we double down on the human element. Home Loans Powered by Humans® represents our commitment to providing personalized guidance, expert advice, and support through every step of the homebuying journey. We assign you one licensed Mortgage Loan Officer to work with you from application to closing, available nights, weekends, or early mornings—whatever fits your schedule.",
    image: "",
  },
  whatWeOffer: {
    heading: "What We Offer",
    description: "Homy Loans provides a wide range of mortgage solutions tailored to your needs, including Conventional, FHA, VA, USDA, Refinance, Reverse, Jumbo, and Condo Financing, as well as Down Payment Assistance Programs, First-Time Homebuyer Programs, Physician Loans, and Hero Loans for first responders, police, firefighters, nurses, and teachers. Our goal is to make homeownership accessible, seamless, and human-centered.",
    image: "",
  },
};

const sectionOrder = ["hero", "homyLoan", "philosophy", "whatWeOffer"];
const sectionLabels = {
  hero: "Hero Section",
  homyLoan: "Homy Loan Section",
  philosophy: "Our Philosophy",
  whatWeOffer: "What We Offer",
};

function mergeAboutUsContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    homyLoan: { ...empty.homyLoan, ...(data?.homyLoan || {}) },
    philosophy: { ...empty.philosophy, ...(data?.philosophy || {}) },
    whatWeOffer: { ...empty.whatWeOffer, ...(data?.whatWeOffer || {}) },
  };
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

export default function AdminAboutUsContent() {
  const [content, setContent] = useState(aboutUsEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("hero");
  const [imageUploading, setImageUploading] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("aboutus")
      .then((data) => {
        setContent(mergeAboutUsContent(aboutUsEmptyContent, data && typeof data === "object" ? data : {}));
        setActiveTab("hero");
      })
      .catch((err) => {
        setContent(mergeAboutUsContent(aboutUsEmptyContent, {}));
        setError(err.message || "Failed to load About Us content.");
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
      await pageContentApi.updatePageContent("aboutus", content);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const isImageUrl = (s) => typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://"));
  const thumbStyle = { width: 48, height: 48, objectFit: "cover", borderRadius: 4, marginLeft: 8 };

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>About Us Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>About Us Content</h1>
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
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.hero?.heading || ""} onChange={(e) => updateSection("hero", "heading", e.target.value)} />
              <label style={labelStyle}>Pill Text</label>
              <input style={inputStyle} value={content.hero?.pillText || ""} onChange={(e) => updateSection("hero", "pillText", e.target.value)} />
            </>
          )}

          {activeTab === "homyLoan" && (
            <>
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.homyLoan?.heading || ""} onChange={(e) => updateSection("homyLoan", "heading", e.target.value)} />
              <label style={labelStyle}>Description</label>
              <textarea style={inputStyle} rows={5} value={content.homyLoan?.description || ""} onChange={(e) => updateSection("homyLoan", "description", e.target.value)} />
            </>
          )}

          {activeTab === "philosophy" && (
            <>
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.philosophy?.heading || ""} onChange={(e) => updateSection("philosophy", "heading", e.target.value)} />
              <label style={labelStyle}>Description</label>
              <textarea style={inputStyle} rows={6} value={content.philosophy?.description || ""} onChange={(e) => updateSection("philosophy", "description", e.target.value)} />
              <label style={labelStyle}>Image (URL or upload)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={content.philosophy?.image || ""} onChange={(e) => updateSection("philosophy", "image", e.target.value)} placeholder="Paste URL or upload below" />
                {(content.philosophy?.image && isImageUrl(content.philosophy.image)) && <img src={content.philosophy.image} alt="" style={thumbStyle} />}
              </div>
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageUploading("philosophy-img");
                try {
                  const url = await uploadImage(file);
                  updateSection("philosophy", "image", url);
                } catch (err) { setError(err.message || "Image upload failed"); }
                setImageUploading(null);
              }} disabled={!!imageUploading} style={{ marginBottom: 0 }} />
              {imageUploading === "philosophy-img" && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
            </>
          )}

          {activeTab === "whatWeOffer" && (
            <>
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.whatWeOffer?.heading || ""} onChange={(e) => updateSection("whatWeOffer", "heading", e.target.value)} />
              <label style={labelStyle}>Description</label>
              <textarea style={inputStyle} rows={6} value={content.whatWeOffer?.description || ""} onChange={(e) => updateSection("whatWeOffer", "description", e.target.value)} />
              <label style={labelStyle}>Image (URL or upload)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={content.whatWeOffer?.image || ""} onChange={(e) => updateSection("whatWeOffer", "image", e.target.value)} placeholder="Paste URL or upload below" />
                {(content.whatWeOffer?.image && isImageUrl(content.whatWeOffer.image)) && <img src={content.whatWeOffer.image} alt="" style={thumbStyle} />}
              </div>
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageUploading("whatWeOffer-img");
                try {
                  const url = await uploadImage(file);
                  updateSection("whatWeOffer", "image", url);
                } catch (err) { setError(err.message || "Image upload failed"); }
                setImageUploading(null);
              }} disabled={!!imageUploading} style={{ marginBottom: 0 }} />
              {imageUploading === "whatWeOffer-img" && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
