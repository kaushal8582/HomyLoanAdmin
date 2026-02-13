import React from "react";
import AdminPageContentEditor, { renderImageField, renderHeroVideoField } from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "conventional-loan";
const TITLE = "Conventional Loan Content";

const defaultFaqs = [
  { q: "What is a conventional loan?", a: "A conventional loan is a mortgage that conforms to limits and guidelines set by Fannie Mae and Freddie Mac, typically for borrowers with strong credit." },
  { q: "What is PMI?", a: "Private Mortgage Insurance is generally required when your down payment is less than 20%. It can be canceled once you reach 20% equity." },
];

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "Conventional Loans",
      description: "Traditional mortgage options with competitive rates and flexible terms for qualified buyers.",
      ctaLabel: "Check Today's Rate",
      videoUrl: "",
      imageUrl: "",
    },
    whatIs: {
      heading: "What Is A Conventional Loan?",
      description: "A Conventional Loan is a mortgage that conforms to the loan limits and underwriting guidelines set by Fannie Mae and Freddie Mac. These are ideal for borrowers with strong credit and stable income, offering flexible terms for both home purchases and refinancing.\n\nConventional Loans are typically broken down into two main types:",
      conformingCard: { title: "Conforming Loans", description: "These adhere to the loan limits set by the FHFA, which are updated annually." },
      nonConformingCard: { title: "Non-Conforming Loans", description: "These are mortgages that exceed the Conforming Loan limits." },
    },
    keyBenefit: {
      heading: "Key Requirements & Benefits",
      description: "Conventional loans typically require more from the borrower than government-backed loans, but they offer distinct advantages, especially once you build equity.",
      imageUrl: "/FHA.svg",
    },
    requirement: {
      heading: "Requirements",
      items: [
        { title: "Minimum Credit Score:", description: "Generally requires a minimum 620 FICO score.", benefit: "Seller Contributions: Sellers are allowed to contribute towards closing costs, helping reduce your out-of-pocket expenses." },
        { title: "Down Payment:", description: "Can be as low as 3% (for first-time homebuyers) or 5% for others.", benefit: "Property Types: Available for primary residences, second homes, and investment properties." },
        { title: "Source of Funds:", description: "Down payments can often be a gift from a relative.", benefit: "Cancelable Mortgage Insurance (MI): If your down payment is less than 20%, you'll need Private Mortgage Insurance (PMI), but you can typically request to cancel it once you reach 20% equity, lowering your monthly payment." },
      ],
    },
    pmi: {
      heading: "Mortgage Insurance (PMI)",
      description: "If your down payment is less than 20%, you are generally required to pay Private Mortgage Insurance (PMI). However, with a Conventional Loan, PMI is temporary:",
      bodyText: "You can request to have PMI canceled once your loan-to-value (LTV) ratio reaches 80% (meaning you have 20% equity). Your lender is required to automatically cancel PMI once your LTV ratio reaches 78%.\n\nThis differs significantly from FHA loans, where mortgage insurance often lasts for the life of the loan.",
      ctaLabel: "Get a Quote",
      imageUrl: "/mortgage_insurance.svg",
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
    pmi: mergeWithDefaults(empty.pmi, data?.pmi),
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "whatIs", "keyBenefit", "requirement", "pmi", "faq"];
const sectionLabels = { hero: "Hero", whatIs: "What Is", keyBenefit: "Key Benefits", requirement: "Requirements", pmi: "PMI", faq: "FAQ" };

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
        <textarea style={{ ...inputStyle, minHeight: 120 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>Conforming Card – Title</label>
        <input style={inputStyle} value={s.conformingCard?.title || ""} onChange={(e) => set("conformingCard", { ...s.conformingCard, title: e.target.value })} />
        <label style={labelStyle}>Conforming Card – Description</label>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={s.conformingCard?.description || ""} onChange={(e) => set("conformingCard", { ...s.conformingCard, description: e.target.value })} />
        <label style={labelStyle}>Non-Conforming Card – Title</label>
        <input style={inputStyle} value={s.nonConformingCard?.title || ""} onChange={(e) => set("nonConformingCard", { ...s.nonConformingCard, title: e.target.value })} />
        <label style={labelStyle}>Non-Conforming Card – Description</label>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={s.nonConformingCard?.description || ""} onChange={(e) => set("nonConformingCard", { ...s.nonConformingCard, description: e.target.value })} />
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
  if (activeTab === "pmi") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>Body Text</label>
        <textarea style={{ ...inputStyle, minHeight: 120 }} value={s.bodyText || ""} onChange={(e) => set("bodyText", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        {renderImageField("pmi", "imageUrl", s.imageUrl, set, opts)}
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

export default function AdminConventionalLoanContent() {
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
