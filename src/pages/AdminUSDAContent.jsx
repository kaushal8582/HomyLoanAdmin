import React from "react";
import AdminPageContentEditor from "../components/AdminPageContentEditor";

const PAGE_KEY = "usda";
const TITLE = "USDA Content";

function getEmptyContent() {
  return {
    hero: { heading: "", description: "", ctaLabel: "", imageUrl: "" },
    what: {
      heading: "What Is A USDA Loan?",
      description:
        "USDA loans are guaranteed by the U.S. Department of Agriculture as part of its Rural Development Guaranteed Housing Loan program. These mortgages are designed for properties located in designated rural areas and offer excellent benefits to qualified low to moderate income homebuyers.",
      ctaLabel: "Get a Quote",
    },
    top: { heading: "", description: "", imageUrl: "" },
    requirement: { heading: "", description: "", ctaLabel: "" },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    what: { ...empty.what, ...(data?.what || {}) },
    top: { ...empty.top, ...(data?.top || {}) },
    requirement: { ...empty.requirement, ...(data?.requirement || {}) },
  };
}

const sectionOrder = ["hero", "what", "top", "requirement"];
const sectionLabels = { hero: "Hero", what: "What is USDA", top: "Top Benefits", requirement: "Requirements" };

function renderForm(activeTab, content, updateSection, _updateArray, { inputStyle, labelStyle }) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const base = (
    <>
      <label style={labelStyle}>Heading</label>
      <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
      <label style={labelStyle}>Description</label>
      <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
    </>
  );
  if (activeTab === "hero") {
    return (
      <>
        {base}
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        <label style={labelStyle}>Image URL</label>
        <input style={inputStyle} value={s.imageUrl || ""} onChange={(e) => set("imageUrl", e.target.value)} />
      </>
    );
  }
  if (activeTab === "what") {
    return (
      <>
        {base}
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
      </>
    );
  }
  if (activeTab === "top") {
    return (
      <>
        {base}
        <label style={labelStyle}>Image URL</label>
        <input style={inputStyle} value={s.imageUrl || ""} onChange={(e) => set("imageUrl", e.target.value)} />
      </>
    );
  }
  if (activeTab === "requirement") {
    return (
      <>
        {base}
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
      </>
    );
  }
  return <p>Select a section.</p>;
}

export default function AdminUSDAContent() {
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
