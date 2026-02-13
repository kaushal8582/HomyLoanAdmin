import React from "react";
import AdminPageContentEditor, { renderHeroVideoField, renderImageField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "firsttimehomebuyers";
const TITLE = "First Time Home Buyers Content";

const defaultTypesCards = [
  { title: "FHA LOAN", description: "OFFERS LOWER DOWN PAYMENT OPTIONS, MAKING IT IDEAL FOR FIRST-TIME BUYERS. LEARN MORE ABOUT FHA LOANS HERE.", href: "/fha-loan" },
  { title: "CONVENTIONAL LOAN", description: "FLEXIBLE DOWN PAYMENT OPTIONS WITH NO REQUIRED MORTGAGE INSURANCE. LEARN MORE ABOUT CONVENTIONAL LOANS HERE.", href: "/conventional-loan" },
  { title: "VA LOAN", description: "DESIGNED FOR VETERANS, OFFERING HOME LOANS WITH LIMITED CLOSING COSTS USING YOUR VA BENEFITS. LEARN MORE ABOUT VA LOANS HERE.", href: "/va-loan" },
];

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "First-Time Home Buyers",
      description: "Buying a home is exciting, and Homy Loans makes it smooth, guiding you every step and answering your questions.",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    types: {
      heading: "Types Of Assistance Available",
      description: "Down Payment Assistance comes in various forms, each designed to meet different financial needs. Our loan officers will help you determine which type you qualify for.",
      cards: defaultTypesCards,
    },
    faq: { faqs: [] },
  };
}

function mergeContent(empty, data) {
  const cards = Array.isArray(data?.types?.cards) && data.types.cards.length > 0 ? data.types.cards : empty.types.cards;
  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    types: { ...empty.types, ...(data?.types || {}), cards },
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "types", "faq"];
const sectionLabels = { hero: "Hero", types: "Types", faq: "FAQ" };

function renderForm(activeTab, content, updateSection, updateArray, opts = {}) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const { inputStyle, labelStyle, addArrayItem, removeArrayItem } = opts;
  if (activeTab === "hero") {
    return (
      <>
        <label style={labelStyle}>Badge</label>
        <input style={inputStyle} value={s.badge || ""} onChange={(e) => set("badge", e.target.value)} />
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        {renderHeroVideoField("hero", "videoUrl", s.videoUrl, set, opts)}
        {renderImageField("hero", "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "types") {
    const cards = s.cards || [];
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>Card 1: title, description, href (one per line)</label>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={cards[0] ? [cards[0].title, cards[0].description, cards[0].href].join("\n") : ""} onChange={(e) => { const lines = e.target.value.split("\n"); updateArray("types", "cards", 0, { title: lines[0] || "", description: lines[1] || "", href: lines[2] || "" }); }} placeholder="Title\nDescription\nHref" />
        <label style={labelStyle}>Card 2: title, description, href (one per line)</label>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={cards[1] ? [cards[1].title, cards[1].description, cards[1].href].join("\n") : ""} onChange={(e) => { const lines = e.target.value.split("\n"); updateArray("types", "cards", 1, { title: lines[0] || "", description: lines[1] || "", href: lines[2] || "" }); }} placeholder="Title\nDescription\nHref" />
        <label style={labelStyle}>Card 3: title, description, href (one per line)</label>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={cards[2] ? [cards[2].title, cards[2].description, cards[2].href].join("\n") : ""} onChange={(e) => { const lines = e.target.value.split("\n"); updateArray("types", "cards", 2, { title: lines[0] || "", description: lines[1] || "", href: lines[2] || "" }); }} placeholder="Title\nDescription\nHref" />
      </>
    );
  }
  if (activeTab === "faq") {
    const faqs = content.faq?.faqs || [];
    return (
      <>
        <label style={labelStyle}>FAQs</label>
        {faqs.map((faq, i) => (
          <div key={i} style={{ marginBottom: 12, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <input style={inputStyle} placeholder="Question" value={faq.q || ""} onChange={(e) => updateArray("faq", "faqs", i, { ...faq, q: e.target.value })} />
            <textarea style={{ ...inputStyle, minHeight: 60 }} placeholder="Answer" value={faq.a || ""} onChange={(e) => updateArray("faq", "faqs", i, { ...faq, a: e.target.value })} />
            {removeArrayItem && <button type="button" onClick={() => removeArrayItem("faq", "faqs", i)} style={{ marginTop: 8, padding: "6px 12px", background: "#999", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Remove</button>}
          </div>
        ))}
        {addArrayItem && <button type="button" onClick={() => addArrayItem("faq", "faqs", { q: "", a: "" })} style={{ padding: "8px 16px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add FAQ</button>}
      </>
    );
  }
  return null;
}

export default function AdminFirstTimeHomeBuyersContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
