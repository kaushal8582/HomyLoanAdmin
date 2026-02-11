import React from "react";
import AdminPageContentEditor from "../components/AdminPageContentEditor";

const PAGE_KEY = "reverse";
const TITLE = "Reverse Mortgage Content";

function getEmptyContent() {
  return {
    hero: {
      heading: "Reverse\nMortgage (HECM)",
      description:
        "A Reverse Mortgage is also known as a HECM (Home Equity Conversion Mortgage).",
      ctaLabel: "Explore loan programs",
      imageUrl: "",
    },
    what: { heading: "", description: "", ctaLabel: "" },
    who: { heading: "", description: "", ctaLabel: "" },
    eligibility: { heading: "", description: "", ctaLabel: "" },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    what: { ...empty.what, ...(data?.what || {}) },
    who: { ...empty.who, ...(data?.who || {}) },
    eligibility: { ...empty.eligibility, ...(data?.eligibility || {}) },
  };
}

const sectionOrder = ["hero", "what", "who", "eligibility"];
const sectionLabels = { hero: "Hero", what: "What is Reverse Mortgage", who: "Who It's For", eligibility: "Eligibility" };

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
  if (activeTab === "hero") {
    return (
      <>
        {base}
        <label style={labelStyle}>Image URL</label>
        <input style={inputStyle} value={s.imageUrl || ""} onChange={(e) => set("imageUrl", e.target.value)} />
      </>
    );
  }
  if (activeTab === "what" || activeTab === "who" || activeTab === "eligibility") return base;
  return <p>Select a section.</p>;
}

export default function AdminReverseContent() {
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
