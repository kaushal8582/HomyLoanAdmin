import React from "react";
import AdminPageContentEditor, { renderHeroVideoField, renderImageField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "physician-loan";
const TITLE = "Physician Loan Content";

const defaultEligibilityItems = [
  "Low down payment",
  "Loan amounts up to $850,000",
  "5/1 and 7/1 adjustable-rate mortgage options available",
  "Deferred student debt may be excluded from payment ratios¹",
  "Interested party contributions allowed",
];

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "Physician Loan (Doctor Loan)",
      description: "Student loans can make buying a home tough. Our Doctor Loan helps residents, recent grads, and early-career physicians with tailored terms to reach homeownership sooner.",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    overview: {
      heading: "Program Overview",
      description: "Caring for others is admirable, but student loan debt can make homeownership challenging. If you're a resident, recent medical school graduate, or early in your career, the Doctor Loan is designed for you. This program offers terms tailored to homebuyers with strong earning potential, helping you achieve your homeownership goals sooner.",
      imageUrl: "/physician.svg",
    },
    eligibility: {
      heading: "Eligibility",
      items: defaultEligibilityItems,
      ctaLabel: "Get a Quote",
      imageUrl: "",
    },
    faq: { faqs: [] },
  };
}

function mergeContent(empty, data) {
  const eligItems = Array.isArray(data?.eligibility?.items) && data.eligibility.items.length > 0 ? data.eligibility.items : empty.eligibility.items;
  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    overview: { ...empty.overview, ...(data?.overview || {}) },
    eligibility: { ...empty.eligibility, ...(data?.eligibility || {}), items: eligItems },
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "overview", "eligibility", "faq"];
const sectionLabels = { hero: "Hero", overview: "Overview", eligibility: "Eligibility", faq: "FAQ" };

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
  if (activeTab === "overview") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        {renderImageField("overview", "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "eligibility") {
    const items = s.items || [];
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        {renderImageField("eligibility", "imageUrl", s.imageUrl, set, opts)}
        <label style={labelStyle}>List items (one per line)</label>
        <textarea style={{ ...inputStyle, minHeight: 120 }} value={(items || []).join("\n")} onChange={(e) => updateSection("eligibility", "items", e.target.value.split("\n").filter(Boolean))} placeholder="One item per line" />
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

export default function AdminPhysicianLoanContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
