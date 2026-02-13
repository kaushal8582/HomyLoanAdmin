import React from "react";
import AdminPageContentEditor, { renderHeroVideoField, renderImageField } from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "self-employed";
const TITLE = "Self Employed Content";

const defaultAssistanceTypes = [
  { type: "Statement History", description: "12- or 24-month Personal and Business Bank Statements allowed.", keyFeature: "24-Month Personal and Business Bank Statements required." },
  { type: "Loan-to-Value (LTV)", description: "LTV up to 85% with No Mortgage Insurance (MI).", keyFeature: "LTV up to 85% with No Mortgage Insurance (MI)." },
  { type: "Loan Amounts", description: "Loans up to $3 Million.", keyFeature: "Loans up to $3 Million." },
  { type: "Debt-to-Income (DTI)", description: "DTI up to 50%.", keyFeature: "DTI up to 43%." },
  { type: "Credit Score", description: "Credit Scores as low as 620.", keyFeature: "Credit Scores as low as 620." },
  { type: "Rate Term", description: "30-Year Fixed with 10-Year Interest-Only Option available.", keyFeature: "30-Year Fixed with 10-Year Interest-Only Option available." },
  { type: "Property Types", description: "Primary, Second, and Investment Homes.", keyFeature: "Primary, Second, and Investment Homes." },
];

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "Self-Employed Mortgages",
      description: "Homy Loans offers a proprietary Bank Statement Program designed to use alternative qualification methods, allowing self-employed individuals to qualify based on their cash flow.",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    bankStatement: {
      heading: "What Is The Bank Statement Program?",
      description: "This program is a specialized lending option for self-employed borrowers that allows them to use their personal or business bank statements, rather than traditional tax forms, to document income and qualify for a mortgage. This is a great fit for those who need to utilize their bank statements to accurately reflect their true earnings.",
      imageUrl: "/self.svg",
    },
    types: {
      heading: "Types Of Assistance Available",
      description: "Down Payment Assistance comes in various forms, each designed to meet different financial needs. Our loan officers will help you determine which type you qualify for.",
      assistanceTypes: defaultAssistanceTypes.map((x) => ({ ...x })),
    },
    faq: { faqs: [] },
  };
}

function mergeContent(empty, data) {
  const assistItems = Array.isArray(data?.types?.assistanceTypes) && data.types.assistanceTypes.length > 0
    ? data.types.assistanceTypes.map((it, i) => ({
        type: it?.type ?? empty.types.assistanceTypes[i]?.type ?? "",
        description: it?.description ?? empty.types.assistanceTypes[i]?.description ?? "",
        keyFeature: it?.keyFeature ?? empty.types.assistanceTypes[i]?.keyFeature ?? "",
      }))
    : empty.types.assistanceTypes;
  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;
  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    bankStatement: mergeWithDefaults(empty.bankStatement, data?.bankStatement),
    types: { ...mergeWithDefaults(empty.types, data?.types), assistanceTypes: assistItems },
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "bankStatement", "types", "faq"];
const sectionLabels = { hero: "Hero", bankStatement: "Bank Statement", types: "Types", faq: "FAQ" };

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
  if (activeTab === "bankStatement") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        {renderImageField("bankStatement", "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "types") {
    const items = s.assistanceTypes || [];
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>Assistance types (type, description, keyFeature per row)</label>
        {items.map((item, i) => (
          <div key={i} style={{ marginBottom: 16, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <input style={inputStyle} placeholder="Type" value={item.type || ""} onChange={(e) => updateArray("types", "assistanceTypes", i, { ...item, type: e.target.value })} />
            <input style={inputStyle} placeholder="Description" value={item.description || ""} onChange={(e) => updateArray("types", "assistanceTypes", i, { ...item, description: e.target.value })} />
            <input style={inputStyle} placeholder="Key Feature" value={item.keyFeature || ""} onChange={(e) => updateArray("types", "assistanceTypes", i, { ...item, keyFeature: e.target.value })} />
            {removeArrayItem && <button type="button" onClick={() => removeArrayItem("types", "assistanceTypes", i)} style={{ marginTop: 8, padding: "6px 12px", background: "#999", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Remove</button>}
          </div>
        ))}
        {addArrayItem && <button type="button" onClick={() => addArrayItem("types", "assistanceTypes", { type: "", description: "", keyFeature: "" })} style={{ padding: "8px 16px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add row</button>}
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

export default function AdminSelfEmployedContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
