import React from "react";
import AdminPageContentEditor from "../components/AdminPageContentEditor";

const PAGE_KEY = "Downpaymentassistance";
const TITLE = "Down Payment Assistance Content";

function getEmptyContent() {
  return {
    hero: {
      heading: "DownPayment Assistance\nLoans",
      description:
        "Homeownership gives stability, community, and fulfillment, not just financial benefits. Homy Loans offers programs from just 3% down. Let's clear up common homebuying myths so you can proceed confidently.",
      ctaLabel: "Check Today's Rate",
      imageUrl: "/DownPayment.svg",
    },
    what: { heading: "", description: "", ctaLabel: "" },
    types: { heading: "", description: "", items: [] },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    what: { ...empty.what, ...(data?.what || {}) },
    types: { ...empty.types, ...(data?.types || {}), items: Array.isArray(data?.types?.items) ? data.types.items : (empty.types.items || []) },
  };
}

const sectionOrder = ["hero", "what", "types"];
const sectionLabels = { hero: "Hero", what: "What is DPA", types: "Types of Assistance" };

function renderForm(activeTab, content, updateSection, _updateArray, { inputStyle, labelStyle }) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  if (activeTab === "hero") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
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
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
      </>
    );
  }
  if (activeTab === "types") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
      </>
    );
  }
  return <p>Select a section.</p>;
}

export default function AdminDPAContent() {
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
