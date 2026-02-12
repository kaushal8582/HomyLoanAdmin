import React from "react";
import AdminPageContentEditor, { renderHeroVideoField, renderImageField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "self-employed";
const TITLE = "Self Employed Content";

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "Self-Employed Mortgages",
      description: "Homy Loans offers a proprietary Bank Statement Program designed to use alternative qualification methods, allowing self-employed individuals to qualify based on their cash flow.",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    bankStatement: {
      heading: "What Is The Bank Statement Program?",
      description: "This program is a specialized lending option for self-employed borrowers that allows them to use their personal or business bank statements, rather than traditional tax forms, to document income and qualify for a mortgage. This is a great fit for those who need to utilize their bank statements to accurately reflect their true earnings.",
      imageUrl: "/self.svg",
    },
    types: {
      heading: "Types Of Assistance Available",
      description: "Down Payment Assistance comes in various forms, each designed to meet different financial needs. Our loan officers will help you determine which type you qualify for.",
    },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    bankStatement: { ...empty.bankStatement, ...(data?.bankStatement || {}) },
    types: { ...empty.types, ...(data?.types || {}) },
  };
}

const sectionOrder = ["hero", "bankStatement", "types"];
const sectionLabels = { hero: "Hero", bankStatement: "Bank Statement", types: "Types" };

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
  if (activeTab === "bankStatement") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        {renderImageField("bankStatement", "imageUrl", s.imageUrl, set, opts)}
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
  return null;
}

export default function AdminSelfEmployedContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
