import React from "react";
import AdminPageContentEditor, { renderHeroVideoField, renderImageField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "fha-approved-condos";
const TITLE = "FHA Approved Condos Content";

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "FHA Approved Condos",
      description: "FHA Loan are often a popular choice for a first-time homebuyer.",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    whatIs: {
      heading: "What Is An FHA Approved Condo Loan?",
      description: "A lot of FHA-insured mortgages can't be purchased using a FHA-insured loan. The loans you must meet the standard FHA requirements (low down payment, low credit score, etc.) and that the condo association must meet specific terms to be eligible for FHA financing.\n\nIn today's market, with rising home prices, FHA-approved condos offer a smart option. They often require a lower deposit than renting and with FHA's low down payment requirement.",
      imageUrl: "/FHAApprove.svg",
    },
    requirement: {
      heading: "Requirements (Project Eligibility)",
      body: "The most important step is ensuring the entire condo project or the specific unit meets FHA's strict guidelines.",
    },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    whatIs: { ...empty.whatIs, ...(data?.whatIs || {}) },
    requirement: { ...empty.requirement, ...(data?.requirement || {}) },
  };
}

const sectionOrder = ["hero", "whatIs", "requirement"];
const sectionLabels = { hero: "Hero", whatIs: "What Is", requirement: "Requirements" };

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
        {renderImageField("whatIs", "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "requirement") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Body</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.body || ""} onChange={(e) => set("body", e.target.value)} />
      </>
    );
  }
  return null;
}

export default function AdminFHAApprovedCondosContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
