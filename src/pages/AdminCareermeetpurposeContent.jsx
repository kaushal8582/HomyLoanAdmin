import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";
import { uploadImage, uploadVideo } from "../services/uploadApi";

const careermeetpurposeEmptyContent = {
    hero: {
      heading: "Career Meets Purpose",
      headingLine2: "LOANS",
      subtext: "At HomyLoans, we're more than just a mortgage lender—we're a community committed to transforming the homebuying experience. Whether you're an experienced mortgage professional or just starting out, we offer a supportive environment where your growth is our priority.",
      ctaText: "See Open Positions",
      videoUrl: "",
    },
  whyFitlife: {
    heading: "Why Choose Fitlife Studio?",
    items: [
      { title: "Human-Centered Culture", description: "We believe in the power of personal connections. You're not just an employee; you're a valued member of a team that prioritizes empathy, collaboration, and mutual respect.", image: "" },
      { title: "Comprehensive Training", description: "From day one, you'll receive the tools and knowledge needed to succeed. Our training programs are designed to equip you with industry-leading skills and insights.", image: "" },
      { title: "Innovative Technology", description: "Leverage modern tools and platforms that streamline the process, allowing you to focus on what truly matters—serving clients.", image: "" },
    ],
    images: ["", "", ""],
  },
  careerOpportunities: {
    heading: "Career Opportunities at HomyLoans",
    cards: [
      { title: "Mortgage Loan Officers", iconSrc: "", description: "Reduced Out of Pocket Costs", path: "/careers/mortgage-loan-officers" },
      { title: "Operations Support", iconSrc: "", description: "Explore refinancing solutions designed to lower rates and payments.", path: "/careers/operations-support" },
      { title: "Branch Managers", iconSrc: "", description: "lorem dduwchdw wdfedwgfvdewwdg dw", path: "/careers/branch-managers" },
      { title: "Marketing & Sales", iconSrc: "", description: "Finance home improvements and renovations with ease.", path: "/careers/marketing-sales" },
    ],
  },
  ourCommitment: {
    heading: "Our Commitment to You",
    description: "At HomyLoans, we understand that a fulfilling career is built on trust, growth, and purpose. That's why we invest in our team's development, celebrate achievements, and foster an inclusive environment where everyone can thrive.",
    image: "",
  },
  whatWeOffer: {
    heading: "What We Offer",
    description: "Homy Loans provides a wide range of mortgage solutions tailored to your needs, including Conventional, FHA, VA, USDA, Refinance, Reverse, Jumbo, and Condo Financing, as well as Down Payment Assistance Programs, First-Time Homebuyer Programs, Physician Loans, and Hero Loans for first responders, police, firefighters, nurses, and teachers. Our goal is to make homeownership accessible, seamless, and human-centered.",
    image: "",
  },
};

const sectionOrder = ["hero", "whyFitlife", "careerOpportunities", "ourCommitment", "whatWeOffer"];
const sectionLabels = {
  hero: "Hero Section",
  whyFitlife: "Why Fitlife",
  careerOpportunities: "Career Opportunities",
  ourCommitment: "Our Commitment",
  whatWeOffer: "What We Offer",
};

function mergeCareermeetpurposeContent(empty, data) {
  const whyFitlifeItems = Array.isArray(data?.whyFitlife?.items) && data.whyFitlife.items.length > 0 ? data.whyFitlife.items : empty.whyFitlife.items;
  const whyFitlifeImages = Array.isArray(data?.whyFitlife?.images) ? data.whyFitlife.images.slice(0, 3) : [];
  while (whyFitlifeImages.length < 3) whyFitlifeImages.push("");
  
  const careerCards = Array.isArray(data?.careerOpportunities?.cards) && data.careerOpportunities.cards.length > 0 ? data.careerOpportunities.cards : empty.careerOpportunities.cards;
  while (careerCards.length < 4) careerCards.push({ title: "", iconSrc: "", description: "", path: "" });

  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    whyFitlife: { ...empty.whyFitlife, items: whyFitlifeItems, images: whyFitlifeImages, ...(data?.whyFitlife || {}) },
    careerOpportunities: { ...empty.careerOpportunities, cards: careerCards.slice(0, 10), ...(data?.careerOpportunities || {}) },
    ourCommitment: { ...empty.ourCommitment, ...(data?.ourCommitment || {}) },
    whatWeOffer: { ...empty.whatWeOffer, ...(data?.whatWeOffer || {}) },
  };
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

export default function AdminCareermeetpurposeContent() {
  const [content, setContent] = useState(careermeetpurposeEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("hero");
  const [imageUploading, setImageUploading] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("careermeetpurpose")
      .then((data) => {
        setContent(mergeCareermeetpurposeContent(careermeetpurposeEmptyContent, data && typeof data === "object" ? data : {}));
        setActiveTab("hero");
      })
      .catch((err) => {
        setContent(mergeCareermeetpurposeContent(careermeetpurposeEmptyContent, {}));
        setError(err.message || "Failed to load Career Meet Purpose content.");
      })
      .finally(() => setLoading(false));
  }, []);

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
      const arr = (c[section]?.[field] || []).filter((_, i) => i !== index);
      return { ...c, [section]: { ...(c[section] || {}), [field]: arr } };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent("careermeetpurpose", content);
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
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Career Meet Purpose Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Career Meet Purpose Content</h1>
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
              <label style={labelStyle}>Heading (Line 1)</label>
              <input style={inputStyle} value={content.hero?.heading || ""} onChange={(e) => updateSection("hero", "heading", e.target.value)} />
              <label style={labelStyle}>Heading (Line 2)</label>
              <input style={inputStyle} value={content.hero?.headingLine2 || ""} onChange={(e) => updateSection("hero", "headingLine2", e.target.value)} />
              <label style={labelStyle}>Subtext</label>
              <textarea style={inputStyle} rows={4} value={content.hero?.subtext || ""} onChange={(e) => updateSection("hero", "subtext", e.target.value)} />
              <label style={labelStyle}>CTA Button Text</label>
              <input style={inputStyle} value={content.hero?.ctaText || ""} onChange={(e) => updateSection("hero", "ctaText", e.target.value)} />
              <label style={labelStyle}>Hero Video (URL or upload)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={content.hero?.videoUrl || ""} onChange={(e) => updateSection("hero", "videoUrl", e.target.value)} placeholder="Paste video URL or upload below" />
              </div>
              <input type="file" accept="video/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setVideoUploading(true);
                try {
                  const url = await uploadVideo(file);
                  updateSection("hero", "videoUrl", url);
                } catch (err) { setError(err.message || "Video upload failed"); }
                setVideoUploading(false);
              }} disabled={videoUploading} style={{ marginBottom: 0 }} />
              {videoUploading && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
            </>
          )}

          {activeTab === "whyFitlife" && (
            <>
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.whyFitlife?.heading || ""} onChange={(e) => updateSection("whyFitlife", "heading", e.target.value)} />
              <label style={labelStyle}>Images (3 images)</label>
              {(content.whyFitlife?.images || []).slice(0, 3).map((url, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <label style={{ ...labelStyle, fontSize: 12 }}>Image {i + 1}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={url || ""} onChange={(e) => {
                      const images = [...(content.whyFitlife?.images || ["", "", ""])];
                      images[i] = e.target.value;
                      updateSection("whyFitlife", "images", images);
                    }} placeholder="Paste URL or upload below" />
                    {(url && isImageUrl(url)) && <img src={url} alt="" style={thumbStyle} />}
                  </div>
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImageUploading(`whyFitlife-img-${i}`);
                    try {
                      const url = await uploadImage(file);
                      const images = [...(content.whyFitlife?.images || ["", "", ""])];
                      images[i] = url;
                      updateSection("whyFitlife", "images", images);
                    } catch (err) { setError(err.message || "Image upload failed"); }
                    setImageUploading(null);
                  }} disabled={!!imageUploading} style={{ marginBottom: 0 }} />
                  {imageUploading === `whyFitlife-img-${i}` && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
                </div>
              ))}
              <label style={labelStyle}>Items</label>
              {(content.whyFitlife?.items || []).map((item, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <label style={{ ...labelStyle, fontSize: 12 }}>Item {i + 1}</label>
                  <input style={inputStyle} placeholder="Title" value={item.title || ""} onChange={(e) => updateArray("whyFitlife", "items", i, { title: e.target.value })} />
                  <textarea style={inputStyle} rows={2} placeholder="Description" value={item.description || ""} onChange={(e) => updateArray("whyFitlife", "items", i, { description: e.target.value })} />
                </div>
              ))}
            </>
          )}

          {activeTab === "careerOpportunities" && (
            <>
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.careerOpportunities?.heading || ""} onChange={(e) => updateSection("careerOpportunities", "heading", e.target.value)} />
              <label style={labelStyle}>Cards</label>
              {(content.careerOpportunities?.cards || []).map((card, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <label style={{ ...labelStyle, fontSize: 12 }}>Card {i + 1}</label>
                  <input style={inputStyle} placeholder="Title" value={card.title || ""} onChange={(e) => updateArray("careerOpportunities", "cards", i, { title: e.target.value })} />
                  <textarea style={inputStyle} rows={2} placeholder="Description" value={card.description || ""} onChange={(e) => updateArray("careerOpportunities", "cards", i, { description: e.target.value })} />
                  <input style={inputStyle} placeholder="Icon URL" value={card.iconSrc || ""} onChange={(e) => updateArray("careerOpportunities", "cards", i, { iconSrc: e.target.value })} />
                  <input style={inputStyle} placeholder="Path (e.g. /careers/mortgage-loan-officers)" value={card.path || ""} onChange={(e) => updateArray("careerOpportunities", "cards", i, { path: e.target.value })} />
                </div>
              ))}
            </>
          )}

          {activeTab === "ourCommitment" && (
            <>
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.ourCommitment?.heading || ""} onChange={(e) => updateSection("ourCommitment", "heading", e.target.value)} />
              <label style={labelStyle}>Description</label>
              <textarea style={inputStyle} rows={4} value={content.ourCommitment?.description || ""} onChange={(e) => updateSection("ourCommitment", "description", e.target.value)} />
              <label style={labelStyle}>Image (URL or upload)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={content.ourCommitment?.image || ""} onChange={(e) => updateSection("ourCommitment", "image", e.target.value)} placeholder="Paste URL or upload below" />
                {(content.ourCommitment?.image && isImageUrl(content.ourCommitment.image)) && <img src={content.ourCommitment.image} alt="" style={thumbStyle} />}
              </div>
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageUploading("ourCommitment-img");
                try {
                  const url = await uploadImage(file);
                  updateSection("ourCommitment", "image", url);
                } catch (err) { setError(err.message || "Image upload failed"); }
                setImageUploading(null);
              }} disabled={!!imageUploading} style={{ marginBottom: 0 }} />
              {imageUploading === "ourCommitment-img" && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
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
