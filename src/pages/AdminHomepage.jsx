import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";
import { uploadImage, uploadVideo } from "../services/uploadApi";

const emptyContent = {
  landing: { mainHeading: "", subHeading: "", rotatingTexts: [], videoUrls: [], logoUrl: "", tagline: "", ctaPrimaryText: "", ctaSecondaryText: "" },
  whyPeople: { heading: "", description: "", buttonText: "", cards: [] },
  mortgage: { heading: "", subtitle: "", cards: [] },
  homeFinancingOption: { options: [] },
  goodHuman: { stories: [] },
  client: { testimonials: [] },
  faq: { faqs: [] },
  humanPoweredMortgage: { heading: "", subtext: "", stats: [] },
};

const sectionOrder = ["landing", "whyPeople", "mortgage", "homeFinancingOption", "goodHuman", "client", "faq", "humanPoweredMortgage"];
const sectionLabels = {
  landing: "Landing",
  whyPeople: "Why People",
  mortgage: "Mortgage",
  homeFinancingOption: "Home Financing Options",
  goodHuman: "Good Human",
  client: "Client Testimonials",
  faq: "FAQ",
  humanPoweredMortgage: "Human Powered Mortgage",
};

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

function mergeContent(prev, next) {
  const out = { ...emptyContent };
  sectionOrder.forEach((key) => {
    out[key] = { ...(out[key] || {}), ...(prev[key] || {}), ...(next[key] || {}) };
  });
  return out;
}

export default function AdminHomepage() {
  const [content, setContent] = useState(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("landing");
  const [videoUploading, setVideoUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getHomePageContent()
      .then((data) => {
        setContent(mergeContent(emptyContent, data && typeof data === "object" ? data : {}));
        setActiveTab("landing");
      })
      .catch((err) => {
        setContent(mergeContent(emptyContent, {}));
        setError(err.message || "Failed to load home content. Check backend URL.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSection = (section, field, value) => {
    setContent((c) => ({
      ...c,
      [section]: { ...(c[section] || {}), [field]: value },
    }));
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
      await pageContentApi.updateHomePageContent(content);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    try {
      const url = await uploadVideo(file);
      updateSection("landing", "videoUrls", [...(content.landing?.videoUrls || []), url]);
    } catch (err) {
      setError(err.message || "Video upload failed");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading("landing-logo");
    try {
      const url = await uploadImage(file);
      updateSection("landing", "logoUrl", url);
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setImageUploading(null);
    }
  };

  const handleImageUploadForArray = async (section, field, index, urlField, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = `${section}-${field}-${index}`;
    setImageUploading(key);
    try {
      const url = await uploadImage(file);
      updateArray(section, field, index, { [urlField]: url });
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setImageUploading(null);
    }
  };

  const isImageUrl = (s) => typeof s === "string" && (s.startsWith("http://") || s.startsWith("https://"));
  const thumbStyle = { width: 48, height: 48, objectFit: "cover", borderRadius: 4, marginLeft: 8 };

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Homepage Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Homepage Content</h1>
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
          {activeTab === "landing" && (
            <>
              <label style={labelStyle}>Main heading</label>
              <input style={inputStyle} value={content.landing?.mainHeading || ""} onChange={(e) => updateSection("landing", "mainHeading", e.target.value)} />
              <label style={labelStyle}>Sub heading</label>
              <input style={inputStyle} value={content.landing?.subHeading || ""} onChange={(e) => updateSection("landing", "subHeading", e.target.value)} />
              <label style={labelStyle}>Tagline</label>
              <textarea style={inputStyle} rows={2} value={content.landing?.tagline || ""} onChange={(e) => updateSection("landing", "tagline", e.target.value)} />
              <label style={labelStyle}>Logo URL</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={content.landing?.logoUrl || ""} onChange={(e) => updateSection("landing", "logoUrl", e.target.value)} placeholder="Paste URL or upload below" />
                {content.landing?.logoUrl && isImageUrl(content.landing.logoUrl) && <img src={content.landing.logoUrl} alt="" style={thumbStyle} />}
              </div>
              <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={!!imageUploading} style={{ marginBottom: 8 }} />
              {imageUploading === "landing-logo" && <span style={{ fontSize: 12, color: "#666" }}> Uploading…</span>}
              <label style={labelStyle}>CTA primary / secondary</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={inputStyle} placeholder="Buying" value={content.landing?.ctaPrimaryText || ""} onChange={(e) => updateSection("landing", "ctaPrimaryText", e.target.value)} />
                <input style={inputStyle} placeholder="Refinance" value={content.landing?.ctaSecondaryText || ""} onChange={(e) => updateSection("landing", "ctaSecondaryText", e.target.value)} />
              </div>
              <label style={labelStyle}>Rotating texts (one per line)</label>
              <textarea style={inputStyle} rows={4} value={(content.landing?.rotatingTexts || []).join("\n")} onChange={(e) => updateSection("landing", "rotatingTexts", e.target.value.split("\n").filter(Boolean))} />
              <label style={labelStyle}>Videos (upload or paste URLs)</label>
              <input type="file" accept="video/*" onChange={handleVideoUpload} disabled={videoUploading} style={{ marginBottom: 8 }} />
              {(content.landing?.videoUrls || []).map((url, i) => (
                <div key={i} style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
                  <input style={inputStyle} value={url} onChange={(e) => {
                    const urls = [...(content.landing?.videoUrls || [])];
                    urls[i] = e.target.value;
                    updateSection("landing", "videoUrls", urls);
                  }} />
                  <button type="button" onClick={() => updateSection("landing", "videoUrls", (content.landing?.videoUrls || []).filter((_, j) => j !== i))} style={{ padding: "6px 12px", background: "#c00", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Remove</button>
                </div>
              ))}
            </>
          )}

          {activeTab === "whyPeople" && (
            <>
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.whyPeople?.heading || ""} onChange={(e) => updateSection("whyPeople", "heading", e.target.value)} />
              <label style={labelStyle}>Description</label>
              <textarea style={inputStyle} rows={3} value={content.whyPeople?.description || ""} onChange={(e) => updateSection("whyPeople", "description", e.target.value)} />
              <label style={labelStyle}>Button text</label>
              <input style={inputStyle} value={content.whyPeople?.buttonText || ""} onChange={(e) => updateSection("whyPeople", "buttonText", e.target.value)} />
              <label style={labelStyle}>Cards</label>
              {(content.whyPeople?.cards || []).map((card, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <input style={inputStyle} placeholder="Title" value={card.title || ""} onChange={(e) => updateArray("whyPeople", "cards", i, { title: e.target.value })} />
                  <label style={{ ...labelStyle, marginTop: 8 }}>Image URL</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="Image URL" value={card.image || ""} onChange={(e) => updateArray("whyPeople", "cards", i, { image: e.target.value })} />
                    {(card.image && isImageUrl(card.image)) && <img src={card.image} alt="" style={thumbStyle} />}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUploadForArray("whyPeople", "cards", i, "image", e)} disabled={!!imageUploading} style={{ marginBottom: 8 }} />
                  {imageUploading === `whyPeople-cards-${i}` && <span style={{ fontSize: 12, color: "#666" }}> Uploading…</span>}
                  <textarea style={inputStyle} rows={2} placeholder="Description" value={card.description || ""} onChange={(e) => updateArray("whyPeople", "cards", i, { description: e.target.value })} />
                </div>
              ))}
            </>
          )}

          {activeTab === "mortgage" && (
            <>
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.mortgage?.heading || ""} onChange={(e) => updateSection("mortgage", "heading", e.target.value)} />
              <label style={labelStyle}>Subtitle</label>
              <textarea style={inputStyle} rows={2} value={content.mortgage?.subtitle || ""} onChange={(e) => updateSection("mortgage", "subtitle", e.target.value)} />
              <label style={labelStyle}>Cards (title, iconSrc, route, description)</label>
              {(content.mortgage?.cards || []).map((card, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <input style={inputStyle} placeholder="Title" value={card.title || ""} onChange={(e) => updateArray("mortgage", "cards", i, { title: e.target.value })} />
                  <label style={{ ...labelStyle, marginTop: 8 }}>Icon URL</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="Icon URL" value={card.iconSrc || ""} onChange={(e) => updateArray("mortgage", "cards", i, { iconSrc: e.target.value })} />
                    {(card.iconSrc && isImageUrl(card.iconSrc)) && <img src={card.iconSrc} alt="" style={thumbStyle} />}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUploadForArray("mortgage", "cards", i, "iconSrc", e)} disabled={!!imageUploading} style={{ marginBottom: 8 }} />
                  {imageUploading === `mortgage-cards-${i}` && <span style={{ fontSize: 12, color: "#666" }}> Uploading…</span>}
                  <input style={inputStyle} placeholder="Route" value={card.route || ""} onChange={(e) => updateArray("mortgage", "cards", i, { route: e.target.value })} />
                  <textarea style={inputStyle} rows={2} placeholder="Description" value={card.description || ""} onChange={(e) => updateArray("mortgage", "cards", i, { description: e.target.value })} />
                </div>
              ))}
            </>
          )}

          {activeTab === "homeFinancingOption" && (
            <>
              <label style={labelStyle}>Options (id, title, image, route, description)</label>
              {(content.homeFinancingOption?.options || []).map((opt, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <input style={inputStyle} placeholder="ID" value={opt.id || ""} onChange={(e) => updateArray("homeFinancingOption", "options", i, { id: e.target.value })} />
                  <input style={inputStyle} placeholder="Title" value={opt.title || ""} onChange={(e) => updateArray("homeFinancingOption", "options", i, { title: e.target.value })} />
                  <label style={{ ...labelStyle, marginTop: 8 }}>Image URL</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="Image URL" value={opt.image || ""} onChange={(e) => updateArray("homeFinancingOption", "options", i, { image: e.target.value })} />
                    {(opt.image && isImageUrl(opt.image)) && <img src={opt.image} alt="" style={thumbStyle} />}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUploadForArray("homeFinancingOption", "options", i, "image", e)} disabled={!!imageUploading} style={{ marginBottom: 8 }} />
                  {imageUploading === `homeFinancingOption-options-${i}` && <span style={{ fontSize: 12, color: "#666" }}> Uploading…</span>}
                  <input style={inputStyle} placeholder="Route" value={opt.route || ""} onChange={(e) => updateArray("homeFinancingOption", "options", i, { route: e.target.value })} />
                  <textarea style={inputStyle} rows={2} placeholder="Description" value={opt.description || ""} onChange={(e) => updateArray("homeFinancingOption", "options", i, { description: e.target.value })} />
                </div>
              ))}
            </>
          )}

          {activeTab === "goodHuman" && (
            <>
              <label style={labelStyle}>Stories (id, image, title)</label>
              {(content.goodHuman?.stories || []).map((s, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <input style={inputStyle} placeholder="ID" type="number" value={String(s.id ?? "")} onChange={(e) => updateArray("goodHuman", "stories", i, { id: parseInt(e.target.value, 10) || 0 })} />
                  <label style={{ ...labelStyle, marginTop: 8 }}>Image URL</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="Image URL" value={s.image || ""} onChange={(e) => updateArray("goodHuman", "stories", i, { image: e.target.value })} />
                    {(s.image && isImageUrl(s.image)) && <img src={s.image} alt="" style={thumbStyle} />}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUploadForArray("goodHuman", "stories", i, "image", e)} disabled={!!imageUploading} style={{ marginBottom: 8 }} />
                  {imageUploading === `goodHuman-stories-${i}` && <span style={{ fontSize: 12, color: "#666" }}> Uploading…</span>}
                  <input style={inputStyle} placeholder="Title" value={s.title || ""} onChange={(e) => updateArray("goodHuman", "stories", i, { title: e.target.value })} />
                </div>
              ))}
            </>
          )}

          {activeTab === "client" && (
            <>
              <label style={labelStyle}>Testimonials (name, role, message, avatar)</label>
              {(content.client?.testimonials || []).map((t, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <input style={inputStyle} placeholder="Name" value={t.name || ""} onChange={(e) => updateArray("client", "testimonials", i, { name: e.target.value })} />
                  <input style={inputStyle} placeholder="Role" value={t.role || ""} onChange={(e) => updateArray("client", "testimonials", i, { role: e.target.value })} />
                  <textarea style={inputStyle} rows={2} placeholder="Message" value={t.message || ""} onChange={(e) => updateArray("client", "testimonials", i, { message: e.target.value })} />
                  <label style={{ ...labelStyle, marginTop: 8 }}>Avatar URL</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="Avatar URL" value={t.avatar || ""} onChange={(e) => updateArray("client", "testimonials", i, { avatar: e.target.value })} />
                    {(t.avatar && isImageUrl(t.avatar)) && <img src={t.avatar} alt="" style={{ ...thumbStyle, borderRadius: "50%" }} />}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUploadForArray("client", "testimonials", i, "avatar", e)} disabled={!!imageUploading} style={{ marginBottom: 8 }} />
                  {imageUploading === `client-testimonials-${i}` && <span style={{ fontSize: 12, color: "#666" }}> Uploading…</span>}
                </div>
              ))}
            </>
          )}

          {activeTab === "faq" && (
            <>
              <label style={labelStyle}>FAQs (q, a)</label>
              {(content.faq?.faqs || []).map((faq, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <input style={inputStyle} placeholder="Question" value={faq.q || ""} onChange={(e) => updateArray("faq", "faqs", i, { q: e.target.value })} />
                  <textarea style={inputStyle} rows={2} placeholder="Answer" value={faq.a || ""} onChange={(e) => updateArray("faq", "faqs", i, { a: e.target.value })} />
                  <button type="button" onClick={() => removeArrayItem("faq", "faqs", i)} style={{ marginTop: 8, padding: "6px 12px", background: "#999", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem("faq", "faqs", { q: "", a: "" })} style={{ padding: "8px 16px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add FAQ</button>
            </>
          )}

          {activeTab === "humanPoweredMortgage" && (
            <>
              <label style={labelStyle}>Heading</label>
              <textarea style={inputStyle} rows={2} value={content.humanPoweredMortgage?.heading || ""} onChange={(e) => updateSection("humanPoweredMortgage", "heading", e.target.value)} placeholder="Use \n for line break" />
              <label style={labelStyle}>Subtext</label>
              <textarea style={inputStyle} rows={2} value={content.humanPoweredMortgage?.subtext || ""} onChange={(e) => updateSection("humanPoweredMortgage", "subtext", e.target.value)} />
              <label style={labelStyle}>Stats (value, label, bg, text, size)</label>
              {(content.humanPoweredMortgage?.stats || []).map((stat, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <input style={inputStyle} placeholder="Value" value={stat.value || ""} onChange={(e) => updateArray("humanPoweredMortgage", "stats", i, { value: e.target.value })} />
                  <input style={inputStyle} placeholder="Label" value={stat.label || ""} onChange={(e) => updateArray("humanPoweredMortgage", "stats", i, { label: e.target.value })} />
                  <input style={inputStyle} placeholder="bg (e.g. bg-black)" value={stat.bg || ""} onChange={(e) => updateArray("humanPoweredMortgage", "stats", i, { bg: e.target.value })} />
                  <input style={inputStyle} placeholder="text (e.g. text-white)" value={stat.text || ""} onChange={(e) => updateArray("humanPoweredMortgage", "stats", i, { text: e.target.value })} />
                  <input style={inputStyle} placeholder="size (e.g. w-[160px] h-[160px])" value={stat.size || ""} onChange={(e) => updateArray("humanPoweredMortgage", "stats", i, { size: e.target.value })} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
