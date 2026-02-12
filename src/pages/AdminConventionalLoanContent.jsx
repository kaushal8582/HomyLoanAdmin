import React from "react";
import AdminPageContentEditor, { renderImageField, renderHeroVideoField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "conventional-loan";
const TITLE = "Conventional Loan Content";

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
    },
    keyBenefit: {
      heading: "Key Requirements & Benefits",
      description: "Conventional loans typically require more from the borrower than government-backed loans, but they offer distinct advantages, especially once you build equity.",
      imageUrl: "/FHA.svg",
    },
    requirement: {
      heading: "Requirements",
    },
    pmi: {
      heading: "Mortgage Insurance (PMI)",
      description: "If your down payment is less than 20%, you are generally required to pay Private Mortgage Insurance (PMI). However, with a Conventional Loan, PMI is temporary:",
      bodyText: "You can request to have PMI canceled once your loan-to-value (LTV) ratio reaches 80% (meaning you have 20% equity). Your lender is required to automatically cancel PMI once your LTV ratio reaches 78%.\n\nThis differs significantly from FHA loans, where mortgage insurance often lasts for the life of the loan.",
      ctaLabel: "Get a Quote",
      imageUrl: "/mortgage_insurance.svg",
    },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    whatIs: { ...empty.whatIs, ...(data?.whatIs || {}) },
    keyBenefit: { ...empty.keyBenefit, ...(data?.keyBenefit || {}) },
    requirement: { ...empty.requirement, ...(data?.requirement || {}) },
    pmi: { ...empty.pmi, ...(data?.pmi || {}) },
  };
}

const sectionOrder = ["hero", "whatIs", "keyBenefit", "requirement", "pmi"];
const sectionLabels = { hero: "Hero", whatIs: "What Is", keyBenefit: "Key Benefits", requirement: "Requirements", pmi: "PMI" };

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
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
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
