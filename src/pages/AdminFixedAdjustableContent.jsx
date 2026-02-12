import React from "react";
import AdminPageContentEditor, { renderHeroVideoField, renderImageField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "fixed-adjustable";
const TITLE = "Fixed vs Adjustable Content";

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "Fixed vs. Adjustable Rate Mortgage",
      description: "Fixed-rate mortgages have stable payments, while ARMs start lower but can adjust over time.",
      ctaLabel: "Check Today's Rate",
      videoUrl: "",
      imageUrl: "",
    },
    requirements: {
      heading: "ELIGIBILITY REQUIREMENTS:",
      fixedTitle: "Fixed-Rate Mortgage",
      fixedBody: "A fixed-rate mortgage has a constant interest rate for the life of the loan, typically offered as 15- or 30-year terms. A 15-year loan often comes with a lower rate but higher monthly payments, while a 30-year loan spreads payments over a longer period, resulting in lower monthly costs. Your interest rate remains the same unless you refinance or modify the loan.",
      armTitle: "Adjustable-Rate Mortgage (ARM)",
      armBody: "An ARM has a fixed interest rate for an initial period, then adjusts based on market conditions. For example, a 5/1 ARM keeps the rate fixed for 5 years, then adjusts annually. This can offer lower initial rates and payments, but your monthly payment may fluctuate once the adjustable phase begins.",
    },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    requirements: { ...empty.requirements, ...(data?.requirements || {}) },
  };
}

const sectionOrder = ["hero", "requirements"];
const sectionLabels = { hero: "Hero", requirements: "Requirements" };

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
  if (activeTab === "requirements") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Fixed-Rate title</label>
        <input style={inputStyle} value={s.fixedTitle || ""} onChange={(e) => set("fixedTitle", e.target.value)} />
        <label style={labelStyle}>Fixed-Rate body</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.fixedBody || ""} onChange={(e) => set("fixedBody", e.target.value)} />
        <label style={labelStyle}>ARM title</label>
        <input style={inputStyle} value={s.armTitle || ""} onChange={(e) => set("armTitle", e.target.value)} />
        <label style={labelStyle}>ARM body</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.armBody || ""} onChange={(e) => set("armBody", e.target.value)} />
      </>
    );
  }
  return null;
}

export default function AdminFixedAdjustableContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
