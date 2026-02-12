import React from "react";
import AdminPageContentEditor, { renderImageField, renderHeroVideoField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "home-select";
const TITLE = "Home Select Content";

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "Home Select Loan: The Checking Account Mortgage",
      description: "FHA Loan are often a popular choice for a first-time homebuyer.",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    whatIs: {
      heading: "What Is A Home Select Loan?",
      description: "This innovative mortgage works by allowing funds deposited into the checking account portion to \"offset\" the principal balance of your home loan. By doing this, you instantly and drastically reduce the amount of interest that accrues daily, potentially saving you tens of thousands of dollars and cutting years off your mortgage term—all without requiring you to change your budget or lifestyle.",
      imageUrl: "/HomeSelect.svg",
    },
    benefit: {
      heading: "Key Requirements & Benefits",
      description: "FHA loans have more flexible requirements than conventional loans, making them ideal for first-time buyers or those with lower credit, while still offering reliable homeownership benefits.",
      imageUrl: "/FHA.svg",
    },
    requirement: {
      heading: "Requirements",
      guidelinesHeading: "Guidelines for Home Select",
    },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    whatIs: { ...empty.whatIs, ...(data?.whatIs || {}) },
    benefit: { ...empty.benefit, ...(data?.benefit || {}) },
    requirement: { ...empty.requirement, ...(data?.requirement || {}) },
  };
}

const sectionOrder = ["hero", "whatIs", "benefit", "requirement"];
const sectionLabels = { hero: "Hero", whatIs: "What Is", benefit: "Key Benefits", requirement: "Requirements" };

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
  if (activeTab === "whatIs" || activeTab === "benefit") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        {renderImageField(activeTab, "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "requirement") {
    return (
      <>
        <label style={labelStyle}>Requirements Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Guidelines Heading</label>
        <input style={inputStyle} value={s.guidelinesHeading || ""} onChange={(e) => set("guidelinesHeading", e.target.value)} />
      </>
    );
  }
  return <p>Select a section.</p>;
}

export default function AdminHomeSelectContent() {
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
