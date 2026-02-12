import React from "react";
import AdminPageContentEditor, { renderImageField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "refinance2";
const TITLE = "Refinance2 Content";

const defaultDescription =
  "To refinance a mortgage means to replace an existing mortgage loan with a new one. With a refinance, the principal balance of the existing loan is paid-in-full using the balance of the new loan.";

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "REFINANCE YOUR\nHOME",
      description: defaultDescription,
      ctaLabel: "Check Today's Rate",
      imageUrl: "",
    },
    whatIs: {
      heading: "WHAT IS\nREFINANCING?",
      description: defaultDescription,
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
    when: {
      heading: "When is the Right Time to Refinance?",
      subText:
        "If your current home or mortgage meets one or more of these conditions, it is a great time to consider refinancing:",
      imageUrl: "/RightTime.svg",
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
    when: { ...empty.when, ...(data?.when || {}) },
  };
}

const sectionOrder = ["hero", "whatIs", "reasons", "when"];
const sectionLabels = { hero: "Hero", whatIs: "What is Refinancing?", reasons: "Reasons to Refinance", when: "When is the Right Time" };

function renderForm(activeTab, content, updateSection, _updateArray, opts = {}) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const { inputStyle, labelStyle } = opts;
  if (activeTab === "hero") {
    return (
      <>
        <label style={labelStyle}>Badge</label>
        <input style={inputStyle} value={s.badge || ""} onChange={(e) => set("badge", e.target.value)} placeholder="HOMY LOANS" />
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        {renderImageField("hero", "imageUrl", s.imageUrl, set, opts)}
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
        {renderImageField("whatIs", "imageUrl", s.imageUrl, set, opts)}
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
        {renderImageField("reasons", "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "when") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Sub Text</label>
        <input style={inputStyle} value={s.subText || ""} onChange={(e) => set("subText", e.target.value)} />
        {renderImageField("when", "imageUrl", s.imageUrl, set, opts)}
        <label style={labelStyle}>Body Text</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.bodyText || ""} onChange={(e) => set("bodyText", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
      </>
    );
  }
  return <p>Select a section.</p>;
}

export default function AdminRefinance2Content() {
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
