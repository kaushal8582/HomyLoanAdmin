import React from "react";
import AdminPageContentEditor from "../components/AdminPageContentEditor";

const PAGE_KEY = "renovation-loans";
const TITLE = "Renovation Loans Content";

function getEmptyContent() {
  return {
    hero: {
      heading: "Renovation\nLoans",
      description:
        "The HomeStyle Renovation Loan lets you finance both the purchase (or refinance) of a home and the cost of renovations with one convenient loan. Whether you're buying a fixer-upper or upgrading your current property, this program rolls the improvement costs right into your mortgage—simplifying the process and helping you create the home you've always envisioned.",
      ctaLabel: "Explore Loan Programs",
      imageUrl: "",
    },
    what: { heading: "", description: "", ctaLabel: "" },
    homestyle: { heading: "", description: "", ctaLabel: "", imageUrl: "" },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    what: { ...empty.what, ...(data?.what || {}) },
    homestyle: { ...empty.homestyle, ...(data?.homestyle || {}) },
  };
}

const sectionOrder = ["hero", "what", "homestyle"];
const sectionLabels = { hero: "Hero", what: "What are Renovation Loans", homestyle: "Homestyle" };

function renderForm(activeTab, content, updateSection, _updateArray, { inputStyle, labelStyle }) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const base = (
    <>
      <label style={labelStyle}>Heading</label>
      <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
      <label style={labelStyle}>Description</label>
      <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
      <label style={labelStyle}>CTA Label</label>
      <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
    </>
  );
  if (activeTab === "hero" || activeTab === "homestyle") {
    return (
      <>
        {base}
        <label style={labelStyle}>Image URL</label>
        <input style={inputStyle} value={s.imageUrl || ""} onChange={(e) => set("imageUrl", e.target.value)} />
      </>
    );
  }
  if (activeTab === "what") return base;
  return <p>Select a section.</p>;
}

export default function AdminRenovationContent() {
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
