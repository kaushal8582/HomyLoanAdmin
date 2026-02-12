import React from "react";
import AdminPageContentEditor, { renderHeroVideoField, renderImageField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "heloc";
const TITLE = "HELOC Content";

const defaultProgramsItems = [
  "Maximum Credit Line: Up to $500,000 for well-qualified borrowers",
  "Draw Period: 10 years",
  "Repayment Period: Interest-only payments during the 10-year draw period; principal and interest payments during the 20-year repayment period",
  "Floor Rate: 3.95%",
  "Rate Cap: 18%, with up to 2% annual increase or decrease",
  "Property Types: 1-4 Unit, Fee Simple, PUD, Condo, Townhouse",
];

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "HELOC",
      description: "A HELOC from Homy Loans lets you borrow up to 95% of your home's equity with low rates and flexible use.",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    whatIs: {
      heading: "What Is A HELOC?",
      description: "A HELOC, or Home Equity Line of Credit, lets you borrow against your home's equity, often referred to as a second mortgage. With a HELOC from Homy Loans, you can borrow up to 95% of your home's equity and access a credit line of up to $500,000. It offers low rates and interest-only payments for the first 10 years, providing flexible funding for starting a business, paying off debt, or even purchasing a vacation home.",
    },
    programs: {
      heading: "HELOC Programs to Fit Your Needs",
      subheading: "HELOC Benefits",
      items: defaultProgramsItems,
      body: "At Homy Loans, we offer a variety of HELOC programs to fit your needs.",
      ctaLabel: "Get a Quote",
    },
  };
}

function mergeContent(empty, data) {
  const progItems = Array.isArray(data?.programs?.items) && data.programs.items.length > 0 ? data.programs.items : empty.programs.items;
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    whatIs: { ...empty.whatIs, ...(data?.whatIs || {}) },
    programs: { ...empty.programs, ...(data?.programs || {}), items: progItems },
  };
}

const sectionOrder = ["hero", "whatIs", "programs"];
const sectionLabels = { hero: "Hero", whatIs: "What Is", programs: "Programs" };

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
      </>
    );
  }
  if (activeTab === "programs") {
    const items = s.items || [];
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Subheading</label>
        <input style={inputStyle} value={s.subheading || ""} onChange={(e) => set("subheading", e.target.value)} />
        <label style={labelStyle}>Body</label>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={s.body || ""} onChange={(e) => set("body", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        <label style={labelStyle}>List items (one per line)</label>
        <textarea style={{ ...inputStyle, minHeight: 120 }} value={(items || []).join("\n")} onChange={(e) => updateSection("programs", "items", e.target.value.split("\n").filter(Boolean))} placeholder="One item per line" />
      </>
    );
  }
  return null;
}

export default function AdminHELOCContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
