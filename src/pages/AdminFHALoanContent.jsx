import React from "react";
import AdminPageContentEditor, { renderImageField, renderHeroVideoField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "fha-loan";
const TITLE = "FHA Loan Content";

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "FHA Loans Guide",
      description: "FHA Loan are often a popular choice for first-time homebuyers and those with lower credit scores.",
      ctaLabel: "Check Today's Rate",
      videoUrl: "",
      imageUrl: "",
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
    requirement: { heading: "Requirements" },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    whatIs: { ...empty.whatIs, ...(data?.whatIs || {}) },
    keyBenefit: { ...empty.keyBenefit, ...(data?.keyBenefit || {}) },
    requirement: { ...empty.requirement, ...(data?.requirement || {}) },
  };
}

const sectionOrder = ["hero", "whatIs", "keyBenefit", "requirement"];
const sectionLabels = { hero: "Hero", whatIs: "What Is", keyBenefit: "Key Benefits", requirement: "Requirements" };

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
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
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
