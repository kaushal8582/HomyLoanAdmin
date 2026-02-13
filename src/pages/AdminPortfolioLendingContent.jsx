import React from "react";
import AdminPageContentEditor, { renderImageField, renderHeroVideoField } from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "portfolio-lending";
const TITLE = "Portfolio Lending Content";

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "Portfolio Lending Solutions",
      description: "Focused on making sensible private money loans utilizing its own capital to be held in portfolio.",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    whatIs: {
      heading: "What Is A Portfolio Loan?",
      description: "A Portfolio Loan is a mortgage that conforms to the loan limits and underwriting guidelines set by Fannie Mae and Freddie Mac. These are ideal for borrowers with strong credit and stable income, offering flexible terms for both home purchases and refinancing.\n\nConventional Loans are typically broken down into two main types:",
      conformingCard: { title: "Conforming Loans", description: "These adhere to the loan limits set by the FHFA, which are updated annually." },
      nonConformingCard: { title: "Non-Conforming Loans", description: "These are mortgages that exceed the Conforming Loan limits." },
    },
    info: {
      heading: "What Is VA Loan?",
      description: "Portfolio lending refers to loans a lender originates and keeps on its own books (in its \"portfolio\") rather than selling them to large government-backed agencies like Fannie Mae or Freddie Mac. This allows us to create custom loan products and underwriting guidelines to serve borrowers with unique needs, such as investors, renovators, and those requiring fast, creative financing.",
      imageUrl: "/Portfolio_Lending.svg",
    },
    fixFlip: {
      heading: "FIX N FLIP LOANS (INVESTMENT FOCUS)",
      description: "Designed for investors buying a property, repairing it, and quickly selling it for a profit.",
      ctaLabel: "Explore",
      imageUrl: "",
    },
    faq: { faqs: [] },
  };
}

function mergeContent(empty, data) {
  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;
  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    whatIs: mergeWithDefaults(empty.whatIs, data?.whatIs),
    info: mergeWithDefaults(empty.info, data?.info),
    fixFlip: mergeWithDefaults(empty.fixFlip, data?.fixFlip),
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "whatIs", "info", "fixFlip", "faq"];
const sectionLabels = { hero: "Hero", whatIs: "What Is", info: "Info", fixFlip: "Fix & Flip", faq: "FAQ" };

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
  if (activeTab === "fixFlip") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        {renderImageField("fixFlip", "imageUrl", s.imageUrl, set, opts)}
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
  if (activeTab === "info") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        {renderImageField("info", "imageUrl", s.imageUrl, set, opts)}
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

export default function AdminPortfolioLendingContent() {
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
