import React from "react";
import AdminPageContentEditor, { renderImageField, renderHeroVideoField } from "../components/AdminPageContentEditor";

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
    },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    whatIs: { ...empty.whatIs, ...(data?.whatIs || {}) },
    info: { ...empty.info, ...(data?.info || {}) },
    fixFlip: { ...empty.fixFlip, ...(data?.fixFlip || {}) },
  };
}

const sectionOrder = ["hero", "whatIs", "info", "fixFlip"];
const sectionLabels = { hero: "Hero", whatIs: "What Is", info: "Info", fixFlip: "Fix & Flip" };

function renderForm(activeTab, content, updateSection, _updateArray, opts = {}) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const { inputStyle, labelStyle } = opts;
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
