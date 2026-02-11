import React from "react";
import AdminPageContentEditor from "../components/AdminPageContentEditor";

const PAGE_KEY = "credit-challenged";
const TITLE = "Credit Challenged Content";

function getEmptyContent() {
  return {
    hero: {
      heading: "Credit Challenged\nMortgages",
      description:
        "At Homy Loans, we're committed to offering a wide range of mortgage options! A lower credit score doesn't automatically prevent you from owning a home— there are programs designed to help you achieve your homeownership dreams.",
      ctaLabel: "Explore loan programs",
      imageUrl: "",
    },
    mortgages: { heading: "", description: "", ctaLabel: "" },
    program: { heading: "", description: "", ctaLabel: "" },
    steps: { heading: "", description: "", items: [] },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    mortgages: { ...empty.mortgages, ...(data?.mortgages || {}) },
    program: { ...empty.program, ...(data?.program || {}) },
    steps: { ...empty.steps, ...(data?.steps || {}), items: Array.isArray(data?.steps?.items) ? data.steps.items : (empty.steps.items || []) },
  };
}

const sectionOrder = ["hero", "mortgages", "program", "steps"];
const sectionLabels = { hero: "Hero", mortgages: "Mortgages for Credit", program: "Loan Program", steps: "Steps" };

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
  if (activeTab === "mortgages" || activeTab === "program" || activeTab === "steps") return base;
  return <p>Select a section.</p>;
}

export default function AdminCreditChallengedContent() {
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
