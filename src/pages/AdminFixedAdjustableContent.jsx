import React from "react";
import AdminPageContentEditor, { renderHeroVideoField, renderImageField } from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "fixed-adjustable";
const TITLE = "Fixed vs Adjustable Content";

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "Fixed vs. Adjustable Rate Mortgage",
      description: "Fixed-rate mortgages have stable payments, while ARMs start lower but can adjust over time.",
      ctaLabel: "Check Today's Rate",
      videoUrl: "",
      imageUrl: "",
    },
    requirements: {
      heading: "ELIGIBILITY REQUIREMENTS:",
      fixedTitle: "Fixed-Rate Mortgage",
      fixedBody: "A fixed-rate mortgage has a constant interest rate for the life of the loan, typically offered as 15- or 30-year terms. A 15-year loan often comes with a lower rate but higher monthly payments, while a 30-year loan spreads payments over a longer period, resulting in lower monthly costs. Your interest rate remains the same unless you refinance or modify the loan.",
      armTitle: "Adjustable-Rate Mortgage (ARM)",
      armBody: "An ARM has a fixed interest rate for an initial period, then adjusts based on market conditions. For example, a 5/1 ARM keeps the rate fixed for 5 years, then adjusts annually. This can offer lower initial rates and payments, but your monthly payment may fluctuate once the adjustable phase begins.",
    },
    faq: { faqs: [] },
  };
}

function mergeContent(empty, data) {
  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;
  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    requirements: mergeWithDefaults(empty.requirements, data?.requirements),
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "requirements", "faq"];
const sectionLabels = { hero: "Hero", requirements: "Requirements", faq: "FAQ" };

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
  if (activeTab === "requirements") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Fixed-Rate title</label>
        <input style={inputStyle} value={s.fixedTitle || ""} onChange={(e) => set("fixedTitle", e.target.value)} />
        <label style={labelStyle}>Fixed-Rate body</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.fixedBody || ""} onChange={(e) => set("fixedBody", e.target.value)} />
        <label style={labelStyle}>ARM title</label>
        <input style={inputStyle} value={s.armTitle || ""} onChange={(e) => set("armTitle", e.target.value)} />
        <label style={labelStyle}>ARM body</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.armBody || ""} onChange={(e) => set("armBody", e.target.value)} />
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

export default function AdminFixedAdjustableContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
