import React from "react";
import AdminPageContentEditor from "../components/AdminPageContentEditor";

const PAGE_KEY = "refinance";
const TITLE = "Refinance Content";

function getEmptyContent() {
  return {
    hero: {
      heading: "REFINANCE YOUR\nHOME",
      description:
        "To refinance a mortgage means to replace an existing mortgage loan with a new one. With a refinance, the principal balance of the existing loan is paid-in-full using the balance of the new loan.",
      ctaLabel: "Check Today's Rate",
      imageUrl: "",
    },
    whatIs: {
      heading: "WHAT IS\nREFINANCING?",
      description:
        "To refinance a mortgage means to replace an existing mortgage loan with a new one. With a refinance, the principal balance of the existing loan is paid-in-full using the balance of the new loan.",
      ctaLabel: "Get a Quote",
      imageUrl: "",
    },
    reasons: {
      heading: "Reasons to Refinance",
      description:
        "Homeowners refinance for many reasons. We help you define your goal and choose the best option, which often includes: Securing a Lower Rate to reduce monthly payments and save money. Getting a Shorter Term to pay off the loan sooner and save on total interest. Switching to a Fixed Rate from an ARM for predictable payments. Converting Home Equity to Cash for major expenses or debt payoff.",
      ctaLabel: "Get a Quote",
      imageUrl: "/door.jpg",
    },
    rightTime: {
      heading: "WHEN IS THE RIGHT\nTIME TO REFINANCE?",
      subText:
        "To refinance a mortgage means to replace an existing mortgage loan with a new one. With a refinance, the principal balance of the existing loan is pay-in-full using the balance of the new loan.",
      imageUrl: "",
      bodyText:
        "There are several key indicators that it may be the right time to refinance. If your local housing market has driven up your home's value, the resulting high equity can open the door to a new loan with better terms or a cash out option. Also, if you can secure an interest rate that is significantly lower than your current one, refinancing is definitely worth exploring. Finally, if your mortgage is relatively new, getting a new loan early on can help ensure more of your monthly payment goes toward the principal balance, helping you build equity faster.",
      ctaLabel: "Get a Quote",
    },
  };
}

function mergeContent(empty, data) {
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    whatIs: { ...empty.whatIs, ...(data?.whatIs || {}) },
    reasons: { ...empty.reasons, ...(data?.reasons || {}) },
    rightTime: { ...empty.rightTime, ...(data?.rightTime || {}) },
  };
}

const sectionOrder = ["hero", "whatIs", "reasons", "rightTime"];
const sectionLabels = { hero: "Hero", whatIs: "What is Refinancing?", reasons: "Reasons to Refinance", rightTime: "Right Time" };

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
  if (activeTab === "whatIs") {
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
  if (activeTab === "reasons") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        <label style={labelStyle}>Image URL</label>
        <input style={inputStyle} value={s.imageUrl || ""} onChange={(e) => set("imageUrl", e.target.value)} />
      </>
    );
  }
  if (activeTab === "rightTime") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Sub Text</label>
        <input style={inputStyle} value={s.subText || ""} onChange={(e) => set("subText", e.target.value)} />
        <label style={labelStyle}>Image URL</label>
        <input style={inputStyle} value={s.imageUrl || ""} onChange={(e) => set("imageUrl", e.target.value)} />
        <label style={labelStyle}>Body Text</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.bodyText || ""} onChange={(e) => set("bodyText", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
      </>
    );
  }
  return <p>Select a section.</p>;
}

export default function AdminRefinanceContent() {
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
