import React from "react";
import AdminPageContentEditor, { renderImageField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "usdaloan";
const TITLE = "USDA Loan (usdaloan) Content";

const defaultTopItems = [
  "Zero down payment with 100% financing",
  "Option to finance eligible closing costs",
  "Flexible qualifying criteria",
  "Seller can cover up to 6% of costs",
  "Gift funds allowed",
  "Available for purchase or refinance",
];

function getEmptyContent() {
  return {
    hero: {
      heading: "USDA Loans",
      description: "Homy Loans now offers in-house USDA loans, providing faster approvals and personalized service to help you achieve your homeownership goals with ease.",
      ctaLabel: "Explore loan programs",
    },
    what: {
      heading: "What is USDA Loan?",
      description: "USDA loans are guaranteed by the U.S. Department of Agriculture as part of its Rural Development Guaranteed Housing Loan program. These mortgages are designed for properties located in designated rural areas and offer excellent benefits to qualified low to moderate income homebuyers.",
      imageUrl: "/USDAWhat.svg",
      ctaLabel: "Get a Quote",
    },
    top: {
      heading: "Top USDA Loan Benefits",
      description: "USDA loans stand out in the mortgage market by providing significant advantages, especially related to the down payment.",
      items: defaultTopItems,
    },
    who: {
      heading: "Who is Eligible for a USDA Loan?",
      body: "USDA Rural Housing loans are available to qualified low to moderate income homebuyers purchasing a home in a designated rural area. Unlike other government loans, USDA loans have two main areas of qualification: borrower eligibility and property eligibility.",
    },
  };
}

function mergeContent(empty, data) {
  const topItems = Array.isArray(data?.top?.items) && data.top.items.length > 0 ? data.top.items : empty.top.items;
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    what: { ...empty.what, ...(data?.what || {}) },
    top: { ...empty.top, ...(data?.top || {}), items: topItems },
    who: { ...empty.who, ...(data?.who || {}) },
  };
}

const sectionOrder = ["hero", "what", "top", "who"];
const sectionLabels = { hero: "Hero", what: "What", top: "Top Benefits", who: "Who is Eligible" };

function renderForm(activeTab, content, updateSection, _updateArray, opts = {}) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const { inputStyle, labelStyle } = opts;
  if (activeTab === "hero") {
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
  if (activeTab === "what") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        {renderImageField("what", "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "top") {
    const items = s.items || [];
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>List items (one per line)</label>
        <textarea style={{ ...inputStyle, minHeight: 120 }} value={(items || []).join("\n")} onChange={(e) => updateSection("top", "items", e.target.value.split("\n").filter(Boolean))} placeholder="One item per line" />
      </>
    );
  }
  if (activeTab === "who") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Body</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.body || ""} onChange={(e) => set("body", e.target.value)} />
      </>
    );
  }
  return null;
}

export default function AdminUSDALoanContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
