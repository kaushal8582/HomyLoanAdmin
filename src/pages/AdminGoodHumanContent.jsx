import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";
import { uploadImage } from "../services/uploadApi";

const goodHumanEmptyContent = {
  heading: "Be A Good Human",
  description: "It all started with a t-shirt. Now our Be A Good Human initiative is a driving force behind what it means to work at Homy Loans. Our number one Core Value is to \"Be Human\" – our way of adding a personal touch to the Mortgage Origination experience that cannot be found anywhere else. Whether in the office or off the clock, we at Homy Loans believe in the importance of giving back and sharing real-life examples of kindness from our own communities all while providing a unique human element to everything we do.",
  cards: [
    { img: "", title: "Mortgage Rates Just Saw Their Biggest Drop in a Year", desc: "You've been waiting for what feels like forever for mortgage rates to finally budge. And last week, they did in a big way. On Friday, September 8th, the average 30-year" },
    { img: "", title: "Mortgage Rates Just Saw Their Biggest Drop in a Year", desc: "You've been waiting for what feels like forever for mortgage rates to finally budge. And last week, they did in a big way. On Friday, September 8th, the average 30-year" },
    { img: "", title: "Mortgage Rates Just Saw Their Biggest Drop in a Year", desc: "You've been waiting for what feels like forever for mortgage rates to finally budge. And last week, they did in a big way. On Friday, September 8th, the average 30-year" },
  ],
};

function mergeGoodHumanContent(empty, data) {
  const cards = Array.isArray(data?.cards) && data.cards.length > 0 ? data.cards : empty.cards;
  // Ensure at least 3 cards, pad if needed
  const paddedCards = [...cards];
  while (paddedCards.length < 3) {
    paddedCards.push({ img: "", title: "", desc: "" });
  }
  return {
    heading: data?.heading || empty.heading,
    description: data?.description || empty.description,
    cards: paddedCards.slice(0, 10), // Allow up to 10 cards
  };
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

export default function AdminGoodHumanContent() {
  const [content, setContent] = useState(goodHumanEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("goodhuman")
      .then((data) => {
        setContent(mergeGoodHumanContent(goodHumanEmptyContent, data && typeof data === "object" ? data : {}));
      })
      .catch((err) => {
        setContent(mergeGoodHumanContent(goodHumanEmptyContent, {}));
        setError(err.message || "Failed to load Good Human content.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateField = (field, value) => {
    setContent((c) => ({ ...c, [field]: value }));
  };

  const updateCard = (index, field, value) => {
    setContent((c) => {
      const cards = [...(c.cards || [])];
      cards[index] = { ...(cards[index] || {}), [field]: value };
      return { ...c, cards };
    });
  };

  const addCard = () => {
    setContent((c) => ({
      ...c,
      cards: [...(c.cards || []), { img: "", title: "", desc: "" }],
    }));
  };

  const removeCard = (index) => {
    setContent((c) => {
      const cards = (c.cards || []).filter((_, i) => i !== index);
      return { ...c, cards };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent("goodhuman", content);
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
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Be A Good Human Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Be A Good Human Content</h1>
        <button type="button" onClick={handleSave} disabled={saving} style={{ padding: "10px 20px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Saving…" : "Save all"}
        </button>
      </div>
      {error && <div style={{ padding: 12, background: "#fee", color: "#c00", borderRadius: 8, marginBottom: 16 }}>{error}</div>}

      <div style={{ background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={content.heading || ""} onChange={(e) => updateField("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={inputStyle} rows={6} value={content.description || ""} onChange={(e) => updateField("description", e.target.value)} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 16 }}>
          <label style={labelStyle}>Cards</label>
          <button
            type="button"
            onClick={addCard}
            style={{ padding: "6px 12px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 14 }}
          >
            + Add Card
          </button>
        </div>

        {(content.cards || []).map((card, index) => (
          <div key={index} style={{ border: "1px solid #eee", padding: 12, marginBottom: 12, borderRadius: 8, position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>Card {index + 1}</span>
              <button
                type="button"
                onClick={() => removeCard(index)}
                style={{ padding: "4px 8px", background: "#f44336", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12 }}
              >
                Remove
              </button>
            </div>
            <label style={labelStyle}>Title</label>
            <input style={inputStyle} value={card.title || ""} onChange={(e) => updateCard(index, "title", e.target.value)} />
            <label style={labelStyle}>Description</label>
            <textarea style={inputStyle} rows={3} value={card.desc || ""} onChange={(e) => updateCard(index, "desc", e.target.value)} />
            <label style={labelStyle}>Image (URL or upload)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <input style={{ ...inputStyle, marginBottom: 0, flex: 1 }} value={card.img || ""} onChange={(e) => updateCard(index, "img", e.target.value)} placeholder="Paste URL or upload below" />
              {(card.img && isImageUrl(card.img)) && <img src={card.img} alt="" style={thumbStyle} />}
            </div>
            <input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setImageUploading(`card-${index}`);
              try {
                const url = await uploadImage(file);
                updateCard(index, "img", url);
              } catch (err) { setError(err.message || "Image upload failed"); }
              setImageUploading(null);
            }} disabled={!!imageUploading} style={{ marginBottom: 0 }} />
            {imageUploading === `card-${index}` && <span style={{ fontSize: 12, color: "#666", marginLeft: 8 }}>Uploading…</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
