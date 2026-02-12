import React from "react";
import AdminPageContentEditor, { renderHeroVideoField, renderImageField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "usda-renovation";
const TITLE = "USDA Renovation Content";

const defaultEligibilityItems = [
  "The property must be located in a USDA-approved rural area.",
  "The borrower must meet low-to-moderate income limits for the area.",
  "The borrower typically needs a minimum credit score of 600 to qualify.",
];

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "USDA Renovation Program",
      description: "Looking at a home that needs a little TLC to become your dream home? Homy Loans offers USDA Renovation Loans, designed to help eligible borrowers finance homes that require renovation.",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    overview: {
      heading: "Program Overview and Highlights",
      description: "The USDA Renovation Loan combines USDA's no-down-payment financing with funds to repair or improve the property. Eligible borrowers can purchase a home in a USDA-approved rural area and finance both the purchase and renovation costs in one loan.",
      imageUrl: "/HomeSelect.svg",
    },
    eligibility: {
      heading: "Eligibility",
      body: "The USDA Renovation Loan is subject to the standard eligibility requirements of the USDA Rural Development loan program, including:",
      items: defaultEligibilityItems,
      ctaLabel: "Get a Quote",
    },
  };
}

function mergeContent(empty, data) {
  const eligItems = Array.isArray(data?.eligibility?.items) && data.eligibility.items.length > 0 ? data.eligibility.items : empty.eligibility.items;
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    overview: { ...empty.overview, ...(data?.overview || {}) },
    eligibility: { ...empty.eligibility, ...(data?.eligibility || {}), items: eligItems },
  };
}

const sectionOrder = ["hero", "overview", "eligibility"];
const sectionLabels = { hero: "Hero", overview: "Overview", eligibility: "Eligibility" };

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
        <label style={labelStyle}>Body</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.body || ""} onChange={(e) => set("body", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        <label style={labelStyle}>List items (one per line)</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={(items || []).join("\n")} onChange={(e) => updateSection("eligibility", "items", e.target.value.split("\n").filter(Boolean))} placeholder="One item per line" />
      </>
    );
  }
  return null;
}

export default function AdminUSDARenovationContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
