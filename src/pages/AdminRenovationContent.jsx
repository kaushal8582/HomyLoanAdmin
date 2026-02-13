import React from "react";
import AdminPageContentEditor from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "renovation-loans";
const TITLE = "Renovation Loans Content";

function getEmptyContent() {
  return {
    hero: {
      heading: "Renovation\nLoans",
      description:
        "The HomeStyle Renovation Loan lets you finance both the purchase (or refinance) of a home and the cost of renovations with one convenient loan. Whether you're buying a fixer-upper or upgrading your current property, this program rolls the improvement costs right into your mortgage—simplifying the process and helping you create the home you've always envisioned.",
      ctaLabel: "Explore Loan Programs",
      imageUrl: "",
    },
    what: { heading: "", description: "", ctaLabel: "" },
    homestyle: { heading: "", description: "", ctaLabel: "", imageUrl: "" },
    faq: { faqs: [] },
  };
}

function mergeContent(empty, data) {
  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;
  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    what: mergeWithDefaults(empty.what, data?.what),
    homestyle: mergeWithDefaults(empty.homestyle, data?.homestyle),
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "what", "homestyle", "faq"];
const sectionLabels = { hero: "Hero", what: "What are Renovation Loans", homestyle: "Homestyle", faq: "FAQ" };

function renderForm(activeTab, content, updateSection, updateArray, opts = {}) {
  const { inputStyle, labelStyle, addArrayItem, removeArrayItem } = opts;
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const base = (
    <>
      <label style={labelStyle}>Heading</label>
      <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
      <label style={labelStyle}>Description</label>
      <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
      <label style={labelStyle}>CTA Label</label>
      <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
    </>
  );
  if (activeTab === "hero" || activeTab === "homestyle") {
    return (
      <>
        {base}
        <label style={labelStyle}>Image URL</label>
        <input style={inputStyle} value={s.imageUrl || ""} onChange={(e) => set("imageUrl", e.target.value)} />
      </>
    );
  }
  if (activeTab === "what") return base;
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
  return <p>Select a section.</p>;
}

export default function AdminRenovationContent() {
  return (
    <AdminPageContentEditor
      pageKey={PAGE_KEY}
      title={TITLE}
      getEmptyContent={getEmptyContent}
      mergeContent={mergeContent}
      sectionOrder={sectionOrder}
      sectionLabels={sectionLabels}
      renderForm={renderForm}
    />
  );
}
