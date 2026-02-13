import React from "react";
import AdminPageContentEditor from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "reverse";
const TITLE = "Reverse Mortgage Content";

function getEmptyContent() {
  return {
    hero: {
      heading: "Reverse\nMortgage (HECM)",
      description:
        "A Reverse Mortgage is also known as a HECM (Home Equity Conversion Mortgage).",
      ctaLabel: "Explore loan programs",
      imageUrl: "",
    },
    what: { heading: "", description: "", ctaLabel: "" },
    who: { heading: "", description: "", ctaLabel: "" },
    eligibility: { heading: "", description: "", ctaLabel: "" },
    faq: { faqs: [] },
  };
}

function mergeContent(empty, data) {
  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;
  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    what: mergeWithDefaults(empty.what, data?.what),
    who: mergeWithDefaults(empty.who, data?.who),
    eligibility: mergeWithDefaults(empty.eligibility, data?.eligibility),
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "what", "who", "eligibility", "faq"];
const sectionLabels = { hero: "Hero", what: "What is Reverse Mortgage", who: "Who It's For", eligibility: "Eligibility", faq: "FAQ" };

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
  if (activeTab === "hero") {
    return (
      <>
        {base}
        <label style={labelStyle}>Image URL</label>
        <input style={inputStyle} value={s.imageUrl || ""} onChange={(e) => set("imageUrl", e.target.value)} />
      </>
    );
  }
  if (activeTab === "what" || activeTab === "who" || activeTab === "eligibility") return base;
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

export default function AdminReverseContent() {
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
