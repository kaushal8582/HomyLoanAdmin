import React from "react";
import AdminPageContentEditor from "../components/AdminPageContentEditor";

const PAGE_KEY = "va-loan";
const TITLE = "VA Loan Content";

function getEmptyContent() {
  return {
    hero: {
      heading: "VA LOANS",
      description:
        "VA Loans help veterans, service members, and eligible families achieve homeownership with no down payment, no PMI, flexible qualifications, and competitive rates. At Homy Loans, we're proud to support those who've served by making this benefit accessible.",
      ctaLabel: "Check Today's Rate",
      imageUrl: "",
    },
    whatIs: { heading: "", description: "", ctaLabel: "", imageUrl: "" },
    who: { heading: "", description: "", ctaLabel: "" },
    options: { heading: "", description: "", items: [] },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    whatIs: { ...empty.whatIs, ...(data?.whatIs || {}) },
    who: { ...empty.who, ...(data?.who || {}) },
    options: { ...empty.options, ...(data?.options || {}), items: Array.isArray(data?.options?.items) ? data.options.items : (empty.options.items || []) },
  };
}

const sectionOrder = ["hero", "whatIs", "who", "options"];
const sectionLabels = { hero: "Hero", whatIs: "What is VA Loan", who: "Who Qualifies", options: "Options" };

function renderForm(activeTab, content, updateSection, _updateArray, { inputStyle, labelStyle }) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  if (activeTab === "hero" || activeTab === "whatIs") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        {activeTab === "hero" && (
          <>
            <label style={labelStyle}>Image URL</label>
            <input style={inputStyle} value={s.imageUrl || ""} onChange={(e) => set("imageUrl", e.target.value)} />
          </>
        )}
        {activeTab === "whatIs" && (
          <>
            <label style={labelStyle}>Image URL</label>
            <input style={inputStyle} value={s.imageUrl || ""} onChange={(e) => set("imageUrl", e.target.value)} />
          </>
        )}
      </>
    );
  }
  if (activeTab === "who") {
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
  if (activeTab === "options") {
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

export default function AdminVALoanContent() {
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
