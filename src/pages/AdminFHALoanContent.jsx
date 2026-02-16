import React from "react";
import AdminPageContentEditor, { renderImageField, renderHeroVideoField } from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "fha-loan";
const TITLE = "FHA Loan Content";

const defaultFaqs = [
  { q: "What is an FHA loan?", a: "An FHA loan is a mortgage insured by the Federal Housing Administration, allowing down payments as low as 3.5% and more flexible credit requirements." },
  { q: "Who qualifies for an FHA loan?", a: "FHA loans are popular with first-time homebuyers and those with lower credit scores. Specific eligibility criteria apply." },
];

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "FHA Loans Guide",
      description: "FHA Loan are often a popular choice for first-time homebuyers and those with lower credit scores.",
      ctaLabel: "Check Today's Rate",
      videoUrl: "",
      imageUrl: "/FHA.svg",
    },
    whatIs: {
      heading: "What Is An FHA Loan?",
      description: "An FHA Loan is a mortgage that is insured by the Federal Housing Administration, an agency within the U.S. Department of Housing and Urban Development (HUD). This insurance protects lenders against losses, allowing them to offer financing with less strict qualification criteria. FHA Loans allow borrowers to finance homes with down payments as low as 3.5%.",
      imageUrl: "/WhatWeOffer.svg",
    },
    keyBenefit: {
      heading: "Key Requirements & Benefits",
      description: "FHA loans have more flexible requirements than conventional loans, making them ideal for first-time buyers or those with lower credit, while still offering reliable homeownership benefits.",
      imageUrl: "/FHA.svg",
    },
    requirement: {
      heading: "Requirements",
      items: [
        { title: "Minimum Down Payment:", description: "As low as 3.5% of the purchase price.", benefit: "Lower Down Payment: The 3.5% minimum down payment is much lower than many conventional options." },
        { title: "Credit Score:", description: "A FICO score of 580 or higher typically qualifies for the 3.5% down payment.", benefit: "Flexible Credit: FHA loans are more forgiving of past credit issues compared to conventional loans." },
        { title: "Debt-to-Income Ratio (DTI):", description: "Generally requires a DTI ratio of 43% or less.", benefit: "Lower Deposit: FHA loans generally require a lesser deposit than a conventional loan." },
        { title: "Residency:", description: "The home must be the borrower's primary residence.", benefit: "Keep Costs Low: FHA loans are effective at helping keep that upfront cash required low when purchasing a home." },
        { title: "Income Stability:", description: "Borrower must have steady income and proof of employment.", benefit: "MIP: FHA loans require a MIP, which includes both an upfront premium (paid at closing or financed) and an annual premium that breaks down into monthly payments that allows for the low down payment and flexible requirements." },
      ],
    },
    faq: { faqs: defaultFaqs.map((f) => ({ ...f })) },
  };
}

function mergeContent(empty, data) {
  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;
  const reqItems = Array.isArray(data?.requirement?.items) && data.requirement.items.length > 0
    ? data.requirement.items.map((it, i) => ({
        title: it?.title ?? empty.requirement.items[i]?.title ?? "",
        description: it?.description ?? empty.requirement.items[i]?.description ?? "",
        benefit: it?.benefit ?? empty.requirement.items[i]?.benefit ?? "",
      }))
    : empty.requirement.items;
  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    whatIs: mergeWithDefaults(empty.whatIs, data?.whatIs),
    keyBenefit: mergeWithDefaults(empty.keyBenefit, data?.keyBenefit),
    requirement: { ...mergeWithDefaults(empty.requirement, data?.requirement), items: reqItems },
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "whatIs", "keyBenefit", "requirement", "faq"];
const sectionLabels = { hero: "Hero", whatIs: "What Is", keyBenefit: "Key Benefits", requirement: "Requirements", faq: "FAQ" };

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
  if (activeTab === "whatIs") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        {renderImageField("whatIs", "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "keyBenefit") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        {renderImageField("keyBenefit", "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "requirement") {
    const items = s.items || [];
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Requirement rows (title, description, benefit)</label>
        {items.map((item, i) => (
          <div key={i} style={{ marginBottom: 16, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <label style={{ ...labelStyle, fontSize: 12 }}>Row {i + 1} – Title</label>
            <input style={inputStyle} value={item.title || ""} onChange={(e) => updateArray("requirement", "items", i, { ...item, title: e.target.value })} />
            <label style={{ ...labelStyle, fontSize: 12 }}>Description</label>
            <input style={inputStyle} value={item.description || ""} onChange={(e) => updateArray("requirement", "items", i, { ...item, description: e.target.value })} />
            <label style={{ ...labelStyle, fontSize: 12 }}>Benefit</label>
            <textarea style={{ ...inputStyle, minHeight: 60 }} value={item.benefit || ""} onChange={(e) => updateArray("requirement", "items", i, { ...item, benefit: e.target.value })} />
            {removeArrayItem && <button type="button" onClick={() => removeArrayItem("requirement", "items", i)} style={{ marginTop: 8, padding: "6px 12px", background: "#999", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Remove row</button>}
          </div>
        ))}
        {addArrayItem && <button type="button" onClick={() => addArrayItem("requirement", "items", { title: "", description: "", benefit: "" })} style={{ padding: "8px 16px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add row</button>}
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
  return <p>Select a section.</p>;
}

export default function AdminFHALoanContent() {
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
