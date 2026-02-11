import React from "react";
import AdminPageContentEditor from "../components/AdminPageContentEditor";

const PAGE_KEY = "jumbo-loans";
const TITLE = "Jumbo Loans Content";

function getEmptyContent() {
  return {
    hero: {
      heading: "Jumbo Loans",
      description:
        "A jumbo loan is a loan for a home where the loan amount falls outside of the conforming loan limits. In most counties the conforming loan limit is $548,250 (higher in other counties).",
      ctaLabel: "Check Today's Rate",
      imageUrl: "",
    },
    what: { heading: "", description: "", ctaLabel: "" },
    who: { heading: "", description: "", ctaLabel: "" },
    solutions: { heading: "", description: "", ctaLabel: "", imageUrl: "" },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    what: { ...empty.what, ...(data?.what || {}) },
    who: { ...empty.who, ...(data?.who || {}) },
    solutions: { ...empty.solutions, ...(data?.solutions || {}) },
  };
}

const sectionOrder = ["hero", "what", "who", "solutions"];
const sectionLabels = { hero: "Hero", what: "What are Jumbo Loans", who: "Who Qualifies", solutions: "Solutions" };

function renderForm(activeTab, content, updateSection, _updateArray, { inputStyle, labelStyle }) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const common = (
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
        {common}
        <label style={labelStyle}>Image URL</label>
        <input style={inputStyle} value={s.imageUrl || ""} onChange={(e) => set("imageUrl", e.target.value)} />
      </>
    );
  }
  if (activeTab === "what" || activeTab === "who") return common;
  if (activeTab === "solutions") {
    return (
      <>
        {common}
        <label style={labelStyle}>Image URL</label>
        <input style={inputStyle} value={s.imageUrl || ""} onChange={(e) => set("imageUrl", e.target.value)} />
      </>
    );
  }
  return <p>Select a section.</p>;
}

export default function AdminJumboContent() {
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
