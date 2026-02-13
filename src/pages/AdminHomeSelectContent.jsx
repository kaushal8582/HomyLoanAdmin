import React from "react";
import AdminPageContentEditor, { renderImageField, renderHeroVideoField } from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "home-select";
const TITLE = "Home Select Content";

const defaultLeftItems = [
  { title: "Interest Savings:", description: "Daily deposits reduce principal and interest" },
  { title: "Reduced Monthly Payments:", description: "Deposits act as payments; only short falls pay interest" },
  { title: "30-Year Equity Access:", description: "Functions like a long-term line of credit" },
  { title: "Flexible Loan Terms:", description: "No balloon payment or prepayment penalties" },
  { title: "Banking Features:", description: "Includes checking account perks like online bill-pay and debit access" },
  { title: "Property Eligibility:", description: "Valid for primary, secondary, and investment properties" },
];

const defaultRightItems = [
  { title: "Minimum FICO:", description: "700 (Primary/Second), 720 (Investment)" },
  { title: "Maximum LTV:", description: "90% for primary home purchase/refinance" },
  { title: "Maximum DTI:", description: "43%" },
  { title: "Reserves:", description: "Up to 18% of LOC required" },
  { title: "Rate Option:", description: "1-month adjustable, competitive with conventional loans" },
  { title: "Loan Amount:", description: "Up to $3M, no geographic limits" },
];

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "Home Select Loan: The Checking Account Mortgage",
      description: "FHA Loan are often a popular choice for a first-time homebuyer.",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    whatIs: {
      heading: "What Is A Home Select Loan?",
      description: "This innovative mortgage works by allowing funds deposited into the checking account portion to \"offset\" the principal balance of your home loan. By doing this, you instantly and drastically reduce the amount of interest that accrues daily, potentially saving you tens of thousands of dollars and cutting years off your mortgage term—all without requiring you to change your budget or lifestyle.",
      imageUrl: "/HomeSelect.svg",
    },
    benefit: {
      heading: "Key Requirements & Benefits",
      description: "FHA loans have more flexible requirements than conventional loans, making them ideal for first-time buyers or those with lower credit, while still offering reliable homeownership benefits.",
      imageUrl: "/FHA.svg",
    },
    requirement: {
      heading: "Requirements",
      guidelinesHeading: "Guidelines for Home Select",
      leftItems: defaultLeftItems.map((x) => ({ ...x })),
      rightItems: defaultRightItems.map((x) => ({ ...x })),
    },
    faq: { faqs: [] },
  };
}

function mergeContent(empty, data) {
  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;
  const leftItems = Array.isArray(data?.requirement?.leftItems) && data.requirement.leftItems.length > 0
    ? data.requirement.leftItems.map((it, i) => ({ title: it?.title ?? "", description: it?.description ?? "" }))
    : empty.requirement.leftItems;
  const rightItems = Array.isArray(data?.requirement?.rightItems) && data.requirement.rightItems.length > 0
    ? data.requirement.rightItems.map((it, i) => ({ title: it?.title ?? "", description: it?.description ?? "" }))
    : empty.requirement.rightItems;
  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    whatIs: mergeWithDefaults(empty.whatIs, data?.whatIs),
    benefit: mergeWithDefaults(empty.benefit, data?.benefit),
    requirement: { ...mergeWithDefaults(empty.requirement, data?.requirement), leftItems, rightItems },
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "whatIs", "benefit", "requirement", "faq"];
const sectionLabels = { hero: "Hero", whatIs: "What Is", benefit: "Key Benefits", requirement: "Requirements", faq: "FAQ" };

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
  if (activeTab === "whatIs" || activeTab === "benefit") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        {renderImageField(activeTab, "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "requirement") {
    const leftItems = s.leftItems || [];
    const rightItems = s.rightItems || [];
    return (
      <>
        <label style={labelStyle}>Requirements Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Guidelines Heading</label>
        <input style={inputStyle} value={s.guidelinesHeading || ""} onChange={(e) => set("guidelinesHeading", e.target.value)} />
        <label style={labelStyle}>Left column (Requirements) – items</label>
        {leftItems.map((item, i) => (
          <div key={i} style={{ marginBottom: 12, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <input style={inputStyle} placeholder="Title" value={item.title || ""} onChange={(e) => updateArray("requirement", "leftItems", i, { ...item, title: e.target.value })} />
            <input style={inputStyle} placeholder="Description" value={item.description || ""} onChange={(e) => updateArray("requirement", "leftItems", i, { ...item, description: e.target.value })} />
            {removeArrayItem && <button type="button" onClick={() => removeArrayItem("requirement", "leftItems", i)} style={{ marginTop: 8, padding: "6px 12px", background: "#999", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Remove</button>}
          </div>
        ))}
        {addArrayItem && <button type="button" onClick={() => addArrayItem("requirement", "leftItems", { title: "", description: "" })} style={{ padding: "8px 16px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", marginBottom: 16 }}>+ Add left item</button>}
        <label style={labelStyle}>Right column (Guidelines) – items</label>
        {rightItems.map((item, i) => (
          <div key={i} style={{ marginBottom: 12, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <input style={inputStyle} placeholder="Title" value={item.title || ""} onChange={(e) => updateArray("requirement", "rightItems", i, { ...item, title: e.target.value })} />
            <input style={inputStyle} placeholder="Description" value={item.description || ""} onChange={(e) => updateArray("requirement", "rightItems", i, { ...item, description: e.target.value })} />
            {removeArrayItem && <button type="button" onClick={() => removeArrayItem("requirement", "rightItems", i)} style={{ marginTop: 8, padding: "6px 12px", background: "#999", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Remove</button>}
          </div>
        ))}
        {addArrayItem && <button type="button" onClick={() => addArrayItem("requirement", "rightItems", { title: "", description: "" })} style={{ padding: "8px 16px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add right item</button>}
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

export default function AdminHomeSelectContent() {
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
