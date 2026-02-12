import React from "react";
import AdminPageContentEditor, { renderHeroVideoField, renderImageField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "fha-no-credit";
const TITLE = "FHA No Credit Score Content";

const defaultReferencesItems = [
  "Rent or rent-to-own history",
  "Utility and phone bills",
  "Insurance and medical payments",
  "School tuition and childcare payments",
  "Car leases and personal loans",
  "Authorized user account history",
  "12 months of regular savings deposits",
  "Retail store credit card usage",
];

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "FHA No Credit Score Program",
      description: "Want to own a home but worried about your credit? Our FHA No Credit Score Required Program helps make home ownership possible—no credit score needed.",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    overview: {
      heading: "Program Overview and Highlights",
      description: "This FHA program helps borrowers qualify based on overall financial responsibility, even without a traditional FICO score. It accepts non-traditional credit like utility, phone, and rental payment history. You can get up to 96.5% financing (just 3.5% down) on single-family homes, condos, and 2-4 unit properties. The program also allows a flexible DTI up to 43%, making it easier to qualify despite other financial obligations.",
      imageUrl: "/HomeSelect.svg",
    },
    references: {
      heading: "Sufficient Non-Traditional Credit References",
      body: "We understand that every financial situation is unique. That's why we accept a wide range of non-traditional credit references to help you qualify for a mortgage, including:",
      items: defaultReferencesItems,
      ctaLabel: "Get a Quote",
    },
  };
}

function mergeContent(empty, data) {
  const refItems = Array.isArray(data?.references?.items) && data.references.items.length > 0 ? data.references.items : empty.references.items;
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    overview: { ...empty.overview, ...(data?.overview || {}) },
    references: { ...empty.references, ...(data?.references || {}), items: refItems },
  };
}

const sectionOrder = ["hero", "overview", "references"];
const sectionLabels = { hero: "Hero", overview: "Overview", references: "References" };

function renderForm(activeTab, content, updateSection, updateArray, opts = {}) {
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
  if (activeTab === "references") {
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
        <textarea style={{ ...inputStyle, minHeight: 120 }} value={(items || []).join("\n")} onChange={(e) => updateSection("references", "items", e.target.value.split("\n").filter(Boolean))} placeholder="One item per line" />
      </>
    );
  }
  return null;
}

export default function AdminFHANoCreditScoreContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
