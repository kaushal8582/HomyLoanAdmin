import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as pageContentApi from "../services/pageContentApi";

const findOfficerEmptyContent = {
  hero: {
    heading: "Find a Mortgage Loan Officer",
    subheading: "Welcome to the Easiest Home Loan Experience!",
    description: "Apply in just one minute and take the first step toward owning your dream home today.",
    ctaText: "Start Your Application",
  },
  branch: {
    branches: [
      { name: "UNION MORTGAGE BRANCH", address: "1496 Morris Ave Suite 1 Union NJ, 282.1 mi", image: "/branch.svg" },
      { name: "UNION MORTGAGE BRANCH", address: "1496 Morris Ave Suite 1 Union NJ, 282.1 mi", image: "/branch2.svg" },
      { name: "UNION MORTGAGE BRANCH", address: "1496 Morris Ave Suite 1 Union NJ, 282.1 mi", image: "/branch3.svg" },
      { name: "UNION MORTGAGE BRANCH", address: "1496 Morris Ave Suite 1 Union NJ, 282.1 mi", image: "/branch4.svg" },
    ],
  },
};

function mergeFindOfficerContent(empty, data) {
  const getValue = (dataVal, defaultVal) => (dataVal !== null && dataVal !== undefined ? dataVal : defaultVal);

  const heroData = data?.hero || {};
  let heroVideoUrls = [];
  if (Array.isArray(heroData.videoUrls) && heroData.videoUrls.length > 0) {
    heroVideoUrls = heroData.videoUrls;
  } else if (heroData.videoUrl && String(heroData.videoUrl).trim()) {
    heroVideoUrls = [heroData.videoUrl.trim()];
  }

  const branchData = data?.branch || {};
  let branches = [];
  if (Array.isArray(branchData.branches) && branchData.branches.length > 0) {
    branches = branchData.branches.map((branch, i) => ({
      name: getValue(branch?.name, empty.branch.branches[i]?.name || ""),
      address: getValue(branch?.address, empty.branch.branches[i]?.address || ""),
      image: getValue(branch?.image, empty.branch.branches[i]?.image || ""),
    }));
  } else {
    branches = [...(empty.branch.branches || [])];
  }
  while (branches.length < 4) branches.push({ name: "", address: "", image: "" });

  return {
    hero: {
      heading: getValue(heroData.heading, empty.hero.heading),
      subheading: getValue(heroData.subheading, empty.hero.subheading),
      description: getValue(heroData.description, empty.hero.description),
      ctaText: getValue(heroData.ctaText, empty.hero.ctaText),
    },
    branch: {
      branches: branches.slice(0, 4),
    },
  };
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

const sectionOrder = ["hero", "branch"];
const sectionLabels = { hero: "Hero", branch: "Branches" };

const isImageUrl = (s) => typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://"));
const thumbStyle = { width: 48, height: 48, objectFit: "cover", borderRadius: 4, marginLeft: 8 };

export default function AdminFindOfficerContent() {
  const [content, setContent] = useState(findOfficerEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("findofficer")
      .then((data) => {
        setContent(mergeFindOfficerContent(findOfficerEmptyContent, data && typeof data === "object" ? data : {}));
        setActiveTab("hero");
      })
      .catch((err) => {
        setContent(mergeFindOfficerContent(findOfficerEmptyContent, {}));
        setError(err.message || "Failed to load Find Officer content.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSection = (section, field, value) => {
    setContent((c) => ({ ...c, [section]: { ...(c[section] || {}), [field]: value } }));
  };

  const updateBranch = (index, field, value) => {
    setContent((c) => {
      const branches = [...(c.branch?.branches || [])];
      branches[index] = { ...(branches[index] || {}), [field]: value };
      return { ...c, branch: { ...(c.branch || {}), branches } };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent("findofficer", content);
      toast.success("Saved successfully");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Save failed");
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Find Officer (Locations) Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Find Officer (Locations) Content</h1>
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
              <label style={labelStyle}>Subheading</label>
              <input style={inputStyle} value={content.hero?.subheading || ""} onChange={(e) => updateSection("hero", "subheading", e.target.value)} />
              <label style={labelStyle}>Description</label>
              <textarea style={inputStyle} rows={3} value={content.hero?.description || ""} onChange={(e) => updateSection("hero", "description", e.target.value)} />
              <label style={labelStyle}>CTA Text</label>
              <input style={inputStyle} value={content.hero?.ctaText || ""} onChange={(e) => updateSection("hero", "ctaText", e.target.value)} />
            </>
          )}

          {activeTab === "branch" && (
            <>
              <label style={labelStyle}>Branches</label>
              {(content.branch?.branches || []).map((branch, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <label style={{ ...labelStyle, fontSize: 12 }}>Branch {i + 1}</label>
                  <input style={inputStyle} placeholder="Branch Name" value={branch.name || ""} onChange={(e) => updateBranch(i, "name", e.target.value)} />
                  <input style={inputStyle} placeholder="Address" value={branch.address || ""} onChange={(e) => updateBranch(i, "address", e.target.value)} />
                  <label style={{ ...labelStyle, fontSize: 12 }}>Image (URL or upload)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="Image URL" value={branch.image || ""} onChange={(e) => updateBranch(i, "image", e.target.value)} />
                    {(branch.image && isImageUrl(branch.image)) && <img src={branch.image} alt="" style={thumbStyle} />}
                  </div>
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageUploading(`branch-${i}`);
                    setError("");
                    try {
                      const url = await uploadImage(file);
                      updateBranch(i, "image", url);
                    } catch (err) { setError(err.message || "Image upload failed"); }
                    setImageUploading(null);
                    e.target.value = "";
                  }} disabled={!!imageUploading} style={{ marginBottom: 0 }} />
                  {imageUploading === `branch-${i}` && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
