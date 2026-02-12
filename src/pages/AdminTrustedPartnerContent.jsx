import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";
import { uploadImage } from "../services/uploadApi";

const trustedPartnerEmptyContent = {
  trustedPartner: {
    heading: "Your Trusted Partner in Home Financing",
    description: "At HomyLoans, we understand that purchasing a home is a significant milestone in your life. That's why we're committed to making the home loan process as seamless and stress-free as possible. Whether you're a first-time homebuyer, looking to refinance, or seeking specialized loan options, our team is here to guide you every step of the way.",
    ctaText: "See Open Positions",
    image: "",
  },
  ourServices: {
    heading: "Our Services",
    description: "Homy Loans offers a variety of mortgage options: Conventional loans for strong credit borrowers, FHA for first-time buyers or lower credit scores, VA for veterans and eligible spouses, USDA with no down payment for eligible rural or suburban homes, Jumbo for high-value properties, Refinance to lower payments or access equity, Reverse mortgages to convert home equity into funds, Down Payment Assistance to reduce upfront costs, and Specialty loans for physicians, heroes, and other targeted groups.",
    ctaText: "Get a Quote",
    image: "",
  },
  ourProcess: {
    heading: "Our Process",
    steps: [
      { title: "Consultation", description: "We begin by understanding your financial goals and homeownership aspirations.", highlight: false },
      { title: "Pre-Qualification", description: "We'll assess your financial situation to determine how much you can afford to borrow.", highlight: true },
      { title: "Application", description: "Submit your application and necessary documentation through our secure platform.", highlight: false },
      { title: "Undertaking", description: "Our team reviews your information and prepares your loan for approval.", highlight: true },
      { title: "Approval & Closing", description: "Once approved, we'll guide you through the closing process to finalize your loan.", highlight: false },
    ],
  },
};

const sectionOrder = ["trustedPartner", "ourServices", "ourProcess"];
const sectionLabels = {
  trustedPartner: "Trusted Partner Section",
  ourServices: "Our Services Section",
  ourProcess: "Our Process",
};

function mergeTrustedPartnerContent(empty, data) {
  const steps = Array.isArray(data?.ourProcess?.steps) && data.ourProcess.steps.length > 0 ? data.ourProcess.steps : empty.ourProcess.steps;
  while (steps.length < 5) steps.push({ title: "", description: "", highlight: false });

  return {
    trustedPartner: { ...empty.trustedPartner, ...(data?.trustedPartner || {}) },
    ourServices: { ...empty.ourServices, ...(data?.ourServices || {}) },
    ourProcess: { ...empty.ourProcess, steps: steps.slice(0, 10), ...(data?.ourProcess || {}) },
  };
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

export default function AdminTrustedPartnerContent() {
  const [content, setContent] = useState(trustedPartnerEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("trustedPartner");
  const [imageUploading, setImageUploading] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("trustedpartner")
      .then((data) => {
        setContent(mergeTrustedPartnerContent(trustedPartnerEmptyContent, data && typeof data === "object" ? data : {}));
        setActiveTab("trustedPartner");
      })
      .catch((err) => {
        setContent(mergeTrustedPartnerContent(trustedPartnerEmptyContent, {}));
        setError(err.message || "Failed to load Trusted Partner content.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSection = (section, field, value) => {
    setContent((c) => ({ ...c, [section]: { ...(c[section] || {}), [field]: value } }));
  };

  const updateStep = (index, field, value) => {
    setContent((c) => {
      const steps = [...(c.ourProcess?.steps || [])];
      steps[index] = { ...(steps[index] || {}), [field]: value };
      return { ...c, ourProcess: { ...(c.ourProcess || {}), steps } };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent("trustedpartner", content);
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
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Trusted Partner Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Trusted Partner Content</h1>
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
          {activeTab === "trustedPartner" && (
            <>
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.trustedPartner?.heading || ""} onChange={(e) => updateSection("trustedPartner", "heading", e.target.value)} />
              <label style={labelStyle}>Description</label>
              <textarea style={inputStyle} rows={4} value={content.trustedPartner?.description || ""} onChange={(e) => updateSection("trustedPartner", "description", e.target.value)} />
              <label style={labelStyle}>CTA Button Text</label>
              <input style={inputStyle} value={content.trustedPartner?.ctaText || ""} onChange={(e) => updateSection("trustedPartner", "ctaText", e.target.value)} />
              <label style={labelStyle}>Image (URL or upload)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={content.trustedPartner?.image || ""} onChange={(e) => updateSection("trustedPartner", "image", e.target.value)} placeholder="Paste URL or upload below" />
                {(content.trustedPartner?.image && isImageUrl(content.trustedPartner.image)) && <img src={content.trustedPartner.image} alt="" style={thumbStyle} />}
              </div>
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageUploading("trustedPartner-img");
                try {
                  const url = await uploadImage(file);
                  updateSection("trustedPartner", "image", url);
                } catch (err) { setError(err.message || "Image upload failed"); }
                setImageUploading(null);
              }} disabled={!!imageUploading} style={{ marginBottom: 0 }} />
              {imageUploading === "trustedPartner-img" && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
            </>
          )}

          {activeTab === "ourServices" && (
            <>
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.ourServices?.heading || ""} onChange={(e) => updateSection("ourServices", "heading", e.target.value)} />
              <label style={labelStyle}>Description</label>
              <textarea style={inputStyle} rows={6} value={content.ourServices?.description || ""} onChange={(e) => updateSection("ourServices", "description", e.target.value)} />
              <label style={labelStyle}>CTA Button Text</label>
              <input style={inputStyle} value={content.ourServices?.ctaText || ""} onChange={(e) => updateSection("ourServices", "ctaText", e.target.value)} />
              <label style={labelStyle}>Image (URL or upload)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={content.ourServices?.image || ""} onChange={(e) => updateSection("ourServices", "image", e.target.value)} placeholder="Paste URL or upload below" />
                {(content.ourServices?.image && isImageUrl(content.ourServices.image)) && <img src={content.ourServices.image} alt="" style={thumbStyle} />}
              </div>
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageUploading("ourServices-img");
                try {
                  const url = await uploadImage(file);
                  updateSection("ourServices", "image", url);
                } catch (err) { setError(err.message || "Image upload failed"); }
                setImageUploading(null);
              }} disabled={!!imageUploading} style={{ marginBottom: 0 }} />
              {imageUploading === "ourServices-img" && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
            </>
          )}

          {activeTab === "ourProcess" && (
            <>
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.ourProcess?.heading || ""} onChange={(e) => updateSection("ourProcess", "heading", e.target.value)} />
              <label style={labelStyle}>Steps</label>
              {(content.ourProcess?.steps || []).map((step, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <label style={{ ...labelStyle, fontSize: 12 }}>Step {i + 1}</label>
                  <input style={inputStyle} placeholder="Title" value={step.title || ""} onChange={(e) => updateStep(i, "title", e.target.value)} />
                  <textarea style={inputStyle} rows={2} placeholder="Description" value={step.description || ""} onChange={(e) => updateStep(i, "description", e.target.value)} />
                  <label style={{ ...labelStyle, fontSize: 12 }}>
                    <input type="checkbox" checked={step.highlight || false} onChange={(e) => updateStep(i, "highlight", e.target.checked)} style={{ marginRight: 8 }} />
                    Highlight (yellow background)
                  </label>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
