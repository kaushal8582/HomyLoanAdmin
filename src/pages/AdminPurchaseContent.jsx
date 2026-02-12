import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";
import { uploadImage } from "../services/uploadApi";

const purchaseEmptyContent = {
  hero: {
    mainHeading: "HOME PURCHASE LOANS",
    subText:
      "Owning a home offers more than equity—it brings stability, fulfillment, and community. At Homy Loans, we make it possible with financing starting at just 3% down**. Let's clear up common myths so you can buy with confidence.",
    ctaPrimaryLabel: "Check Today's Rate",
    ctaSecondaryLabel: "Get a Quote",
    imageUrls: ["", "", "", ""],
    factHeading: "FACT VERSUS FICTION:\nYOUR DOWN PAYMENT",
    factText:
      "Many people still believe a 20% down payment is required to buy a home. This is simply not true. We offer a multitude of programs that could work for your home purchase, with many options requiring a much smaller down payment.",
  },
  loanOptions: {
    heading: "Our Loan Program Options",
    subtext:
      "Lorem Ipsum: The industry standard since the 1500s. It is derived from a 1st-century BC Latin text by Cicero, De finibus bonorum et malorum.",
    cards: [
      { title: "FHA Loans", description: "Requires as low as 3.5% down payment.", image: "", route: "/fha-loan" },
      { title: "VA Loans", description: "Often allows for zero down payment for eligible veterans.", image: "", route: "/va-loan" },
      { title: "USDA Loans", description: "Offers zero down payment for eligible properties in rural areas.", image: "", route: "/usdaloan" },
      { title: "Conventional Loans", description: "Down payments can be as low as 3%.", image: "", route: "/conventional-loan" },
      { title: "DPA Loans", description: "Programs are available to help cover down payment.", image: "", route: "/Downpaymentassistance" },
    ],
  },
  advantage: {
    heading: "The Homy Loans Human Advantage",
    bodyText:
      "Purchasing a home is one of life's biggest decisions. At Homy Loans, we ensure you have dedicated human support every step of the way. We believe in a human powered mortgage process, meaning you work with one caring, experienced loan officer from application to close. We are here to answer your questions, ease your worries, and make your homebuying experience as smooth as possible.",
    ctaLabel: "Get a Quote",
    backgroundImage: "",
  },
};

const sectionOrder = ["hero", "loanOptions", "advantage"];
const sectionLabels = { hero: "Hero", loanOptions: "Loan Options", advantage: "Advantage" };

function mergePurchaseContent(empty, data) {
  // Helper to get value or default (handles null, undefined, but allows empty strings)
  const getValue = (dataVal, defaultVal) => {
    return dataVal !== null && dataVal !== undefined ? dataVal : defaultVal;
  };
  
  // Merge hero section, preserving imageUrls array properly
  const heroData = data?.hero || {};
  const heroImageUrls = Array.isArray(heroData.imageUrls) && heroData.imageUrls.length > 0 
    ? heroData.imageUrls 
    : (empty.hero.imageUrls || []);
  const heroUrls = [...heroImageUrls];
  while (heroUrls.length < 4) heroUrls.push("");
  
  // Merge loanOptions section - check if data.loanOptions exists (even if empty object)
  const loanOptionsData = data && 'loanOptions' in data ? data.loanOptions : {};
  // Merge cards: use data cards if available, otherwise use defaults, then pad to 5
  let cards = [];
  if (Array.isArray(loanOptionsData.cards) && loanOptionsData.cards.length > 0) {
    // Use data cards, but merge with defaults for missing fields in each card
    cards = loanOptionsData.cards.map((card, i) => ({
      title: getValue(card?.title, empty.loanOptions.cards[i]?.title || ""),
      description: getValue(card?.description, empty.loanOptions.cards[i]?.description || ""),
      image: getValue(card?.image, empty.loanOptions.cards[i]?.image || ""),
      route: getValue(card?.route, empty.loanOptions.cards[i]?.route || "")
    }));
  } else {
    // Use default cards
    cards = [...(empty.loanOptions.cards || [])];
  }
  // Pad to 5 cards
  while (cards.length < 5) cards.push({ title: "", description: "", image: "", route: "" });
  
  // Merge advantage section - check if data.advantage exists (even if empty object)
  const advantageData = data && 'advantage' in data ? data.advantage : {};
  
  const out = {
    hero: { 
      ...empty.hero, 
      mainHeading: getValue(heroData.mainHeading, empty.hero.mainHeading),
      subText: getValue(heroData.subText, empty.hero.subText),
      ctaPrimaryLabel: getValue(heroData.ctaPrimaryLabel, empty.hero.ctaPrimaryLabel),
      ctaSecondaryLabel: getValue(heroData.ctaSecondaryLabel, empty.hero.ctaSecondaryLabel),
      factHeading: getValue(heroData.factHeading, empty.hero.factHeading),
      factText: getValue(heroData.factText, empty.hero.factText),
      imageUrls: heroUrls.slice(0, 4)
    },
    loanOptions: { 
      ...empty.loanOptions,
      heading: getValue(loanOptionsData.heading, empty.loanOptions.heading),
      subtext: getValue(loanOptionsData.subtext, empty.loanOptions.subtext),
      cards: cards.slice(0, 5)
    },
    advantage: { 
      ...empty.advantage,
      heading: getValue(advantageData.heading, empty.advantage.heading),
      bodyText: getValue(advantageData.bodyText, empty.advantage.bodyText),
      ctaLabel: getValue(advantageData.ctaLabel, empty.advantage.ctaLabel),
      backgroundImage: getValue(advantageData.backgroundImage, empty.advantage.backgroundImage)
    },
  };
  
  return out;
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

export default function AdminPurchaseContent() {
  const [content, setContent] = useState(purchaseEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("hero");
  const [imageUploading, setImageUploading] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("purchase")
      .then((data) => {
        // The API returns doc.content directly, so data should be the content object
        const merged = mergePurchaseContent(purchaseEmptyContent, data && typeof data === "object" ? data : {});
        setContent(merged);
        setActiveTab("hero");
      })
      .catch((err) => {
        setContent(mergePurchaseContent(purchaseEmptyContent, {}));
        setError(err.message || "Failed to load purchase content.");
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

  const handleImageUploadForArray = async (section, field, index, urlField, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(`${section}-${field}-${index}`);
    try {
      const url = await uploadImage(file);
      updateArray(section, field, index, { [urlField]: url });
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setImageUploading(null);
    }
  };

  const handleHeroImageUpload = async (slotIndex, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const key = `hero-image-${slotIndex}`;
    setImageUploading(key);
    try {
      const url = await uploadImage(file);
      setContent((c) => {
        const urls = [...(c.hero?.imageUrls || ["", "", "", ""])];
        urls[slotIndex] = url;
        return { ...c, hero: { ...(c.hero || {}), imageUrls: urls } };
      });
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setImageUploading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent("purchase", content);
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
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Purchase (Buy a Home) Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Purchase (Buy a Home) Content</h1>
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
              <label style={labelStyle}>Main heading</label>
              <input style={inputStyle} value={content.hero?.mainHeading || ""} onChange={(e) => updateSection("hero", "mainHeading", e.target.value)} />
              <label style={labelStyle}>Sub text</label>
              <textarea style={inputStyle} rows={3} value={content.hero?.subText || ""} onChange={(e) => updateSection("hero", "subText", e.target.value)} />
              <label style={labelStyle}>CTA primary / secondary</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={inputStyle} placeholder="Check Today's Rate" value={content.hero?.ctaPrimaryLabel || ""} onChange={(e) => updateSection("hero", "ctaPrimaryLabel", e.target.value)} />
                <input style={inputStyle} placeholder="Get a Quote" value={content.hero?.ctaSecondaryLabel || ""} onChange={(e) => updateSection("hero", "ctaSecondaryLabel", e.target.value)} />
              </div>
              <label style={labelStyle}>Image strip (4 images) – paste URL or upload per slot</label>
              {(content.hero?.imageUrls || []).slice(0, 4).map((url, i) => (
                <div key={i} style={{ marginBottom: 12, padding: "8px 0", borderBottom: i < 3 ? "1px solid #eee" : "none" }}>
                  <label style={{ ...labelStyle, fontSize: 12 }}>Image {i + 1}</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={url || ""} onChange={(e) => {
                      const urls = [...(content.hero?.imageUrls || ["", "", "", ""])];
                      urls[i] = e.target.value;
                      updateSection("hero", "imageUrls", urls);
                    }} placeholder="Paste URL or upload below" />
                    {(url && isImageUrl(url)) && <img src={url} alt="" style={thumbStyle} />}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleHeroImageUpload(i, e)} disabled={!!imageUploading} style={{ marginBottom: 0 }} />
                  {imageUploading === `hero-image-${i}` && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
                </div>
              ))}
              <label style={labelStyle}>Fact section heading (use \n for line break)</label>
              <textarea style={inputStyle} rows={2} value={content.hero?.factHeading || ""} onChange={(e) => updateSection("hero", "factHeading", e.target.value)} />
              <label style={labelStyle}>Fact section text</label>
              <textarea style={inputStyle} rows={3} value={content.hero?.factText || ""} onChange={(e) => updateSection("hero", "factText", e.target.value)} />
            </>
          )}

          {activeTab === "loanOptions" && (
            <>
              <label style={labelStyle}>Section heading</label>
              <input style={inputStyle} value={content.loanOptions?.heading || ""} onChange={(e) => updateSection("loanOptions", "heading", e.target.value)} />
              <label style={labelStyle}>Section subtext</label>
              <textarea style={inputStyle} rows={2} value={content.loanOptions?.subtext || ""} onChange={(e) => updateSection("loanOptions", "subtext", e.target.value)} />
              <label style={labelStyle}>Cards (order: FHA big, then VA, USDA, Conventional, DPA)</label>
              {(content.loanOptions?.cards || []).map((card, i) => (
                <div key={i} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8 }}>
                  <input style={inputStyle} placeholder="Title" value={card.title || ""} onChange={(e) => updateArray("loanOptions", "cards", i, { title: e.target.value })} />
                  <textarea style={inputStyle} rows={2} placeholder="Description" value={card.description || ""} onChange={(e) => updateArray("loanOptions", "cards", i, { description: e.target.value })} />
                  <label style={{ ...labelStyle, marginTop: 8 }}>Image (URL or upload)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="Paste URL or upload below" value={card.image || ""} onChange={(e) => updateArray("loanOptions", "cards", i, { image: e.target.value })} />
                    {(card.image && isImageUrl(card.image)) && <img src={card.image} alt="" style={thumbStyle} />}
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUploadForArray("loanOptions", "cards", i, "image", e)} disabled={!!imageUploading} style={{ marginBottom: 8 }} />
                  {imageUploading === `loanOptions-cards-${i}` && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
                  <input style={inputStyle} placeholder="Route (e.g. /fha-loan)" value={card.route || ""} onChange={(e) => updateArray("loanOptions", "cards", i, { route: e.target.value })} />
                </div>
              ))}
            </>
          )}

          {activeTab === "advantage" && (
            <>
              <label style={labelStyle}>Heading</label>
              <input style={inputStyle} value={content.advantage?.heading || ""} onChange={(e) => updateSection("advantage", "heading", e.target.value)} />
              <label style={labelStyle}>Body text</label>
              <textarea style={inputStyle} rows={4} value={content.advantage?.bodyText || ""} onChange={(e) => updateSection("advantage", "bodyText", e.target.value)} />
              <label style={labelStyle}>CTA label</label>
              <input style={inputStyle} value={content.advantage?.ctaLabel || ""} onChange={(e) => updateSection("advantage", "ctaLabel", e.target.value)} />
              <label style={labelStyle}>Background image (URL or upload)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={content.advantage?.backgroundImage || ""} onChange={(e) => updateSection("advantage", "backgroundImage", e.target.value)} placeholder="Paste URL or upload below" />
                {(content.advantage?.backgroundImage && isImageUrl(content.advantage.backgroundImage)) && <img src={content.advantage.backgroundImage} alt="" style={thumbStyle} />}
              </div>
              <input type="file" accept="image/*" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImageUploading("advantage-bg");
                try {
                  const url = await uploadImage(file);
                  updateSection("advantage", "backgroundImage", url);
                } catch (err) { setError(err.message || "Image upload failed"); }
                setImageUploading(null);
              }} disabled={!!imageUploading} style={{ marginBottom: 0 }} />
              {imageUploading === "advantage-bg" && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
