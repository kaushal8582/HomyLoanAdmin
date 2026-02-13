import React from "react";
import AdminPageContentEditor, { renderHeroVideoField, renderImageField } from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "fha-approved-condos";
const TITLE = "FHA Approved Condos Content";

const defaultKeyBenefitsItems = [
  { title: "Investor/Rental Ratio:", description: "No more than 50% of the units can be investor-owned or used as rentals. The buyer must intend to occupy the unit as their primary residence." },
  { title: "Commercial Space:", description: "No more than 35% of the property can be used as commercial space." },
  { title: "Delinquencies:", description: "No more than 15% of units can be delinquent in their Homeowners Association (HOA) assessments for more than 60 days." },
  { title: "FHA Concentration:", description: "No more than 50% concentration of FHA Loans is allowed within the community." },
  { title: "Completion:", description: "The condo property or project must be fully completed (no projects still under construction will qualify)." },
  { title: "Reserves and Insurance:", description: "The property must be insured, and the condo association must keep at least 10% of the HOA budget in a cash reserve." },
];

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "FHA Approved Condos",
      description: "FHA Loan are often a popular choice for a first-time homebuyer.",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    whatIs: {
      heading: "What Is An FHA Approved Condo Loan?",
      description: "A lot of FHA-insured mortgages can't be purchased using a FHA-insured loan. The loans you must meet the standard FHA requirements (low down payment, low credit score, etc.) and that the condo association must meet specific terms to be eligible for FHA financing.\n\nIn today's market, with rising home prices, FHA-approved condos offer a smart option. They often require a lower deposit than renting and with FHA's low down payment requirement.",
      imageUrl: "/FHAApprove.svg",
    },
    requirement: {
      heading: "Requirements (Project Eligibility)",
      body: "The most important step is ensuring the entire condo project or the specific unit meets FHA's strict guidelines.",
      keyBenefitsItems: defaultKeyBenefitsItems.map((x) => ({ ...x })),
      spotApprovalHeading: "Single-Unit (Spot) Approval",
      spotApprovalBody: "Under current rules, individual condo units can sometimes be eligible for FHA loans even if the full development isn't officially FHA-approved. This is known as spot approval.",
      gettingApprovedHeading: "Getting Your Condo FHA-Approved",
      gettingApprovedBody: "Condos seeking to accept FHA buyers must go through an approval process (HUD Review and Approval Process - HRAP, or Direct Endorsement Lender Review and Approval Process - DELRAP) and must be recertified every three years to remain eligible.",
    },
    faq: { faqs: [] },
  };
}

function mergeContent(empty, data) {
  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;
  const keyBenefitsItems = Array.isArray(data?.requirement?.keyBenefitsItems) && data.requirement.keyBenefitsItems.length > 0
    ? data.requirement.keyBenefitsItems.map((it) => ({ title: it?.title ?? "", description: it?.description ?? "" }))
    : empty.requirement.keyBenefitsItems;
  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    whatIs: mergeWithDefaults(empty.whatIs, data?.whatIs),
    requirement: { ...mergeWithDefaults(empty.requirement, data?.requirement), keyBenefitsItems },
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "whatIs", "requirement", "faq"];
const sectionLabels = { hero: "Hero", whatIs: "What Is", requirement: "Requirements", faq: "FAQ" };

function renderForm(activeTab, content, updateSection, updateArray, opts = {}) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const { inputStyle, labelStyle, addArrayItem, removeArrayItem } = opts;
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
  if (activeTab === "whatIs") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 120 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        {renderImageField("whatIs", "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "requirement") {
    const keyBenefitsItems = s.keyBenefitsItems || [];
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Body</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.body || ""} onChange={(e) => set("body", e.target.value)} />
        <label style={labelStyle}>Key Benefits – items</label>
        {keyBenefitsItems.map((item, i) => (
          <div key={i} style={{ marginBottom: 12, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <input style={inputStyle} placeholder="Title" value={item.title || ""} onChange={(e) => updateArray("requirement", "keyBenefitsItems", i, { ...item, title: e.target.value })} />
            <textarea style={{ ...inputStyle, minHeight: 60 }} placeholder="Description" value={item.description || ""} onChange={(e) => updateArray("requirement", "keyBenefitsItems", i, { ...item, description: e.target.value })} />
            {removeArrayItem && <button type="button" onClick={() => removeArrayItem("requirement", "keyBenefitsItems", i)} style={{ marginTop: 8, padding: "6px 12px", background: "#999", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Remove</button>}
          </div>
        ))}
        {addArrayItem && <button type="button" onClick={() => addArrayItem("requirement", "keyBenefitsItems", { title: "", description: "" })} style={{ padding: "8px 16px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", marginBottom: 16 }}>+ Add key benefit</button>}
        <label style={labelStyle}>Spot Approval – Heading</label>
        <input style={inputStyle} value={s.spotApprovalHeading || ""} onChange={(e) => set("spotApprovalHeading", e.target.value)} />
        <label style={labelStyle}>Spot Approval – Body</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.spotApprovalBody || ""} onChange={(e) => set("spotApprovalBody", e.target.value)} />
        <label style={labelStyle}>Getting Approved – Heading</label>
        <input style={inputStyle} value={s.gettingApprovedHeading || ""} onChange={(e) => set("gettingApprovedHeading", e.target.value)} />
        <label style={labelStyle}>Getting Approved – Body</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.gettingApprovedBody || ""} onChange={(e) => set("gettingApprovedBody", e.target.value)} />
      </>
    );
  }
  if (activeTab === "faq") {
    const faqs = content.faq?.faqs || [];
    return (
      <>
        <label style={labelStyle}>FAQs</label>
        {faqs.map((faq, i) => (
          <div key={i} style={{ marginBottom: 12, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <input style={inputStyle} placeholder="Question" value={faq.q || ""} onChange={(e) => updateArray("faq", "faqs", i, { ...faq, q: e.target.value })} />
            <textarea style={{ ...inputStyle, minHeight: 60 }} placeholder="Answer" value={faq.a || ""} onChange={(e) => updateArray("faq", "faqs", i, { ...faq, a: e.target.value })} />
            {removeArrayItem && <button type="button" onClick={() => removeArrayItem("faq", "faqs", i)} style={{ marginTop: 8, padding: "6px 12px", background: "#999", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Remove</button>}
          </div>
        ))}
        {addArrayItem && <button type="button" onClick={() => addArrayItem("faq", "faqs", { q: "", a: "" })} style={{ padding: "8px 16px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add FAQ</button>}
      </>
    );
  }
  return null;
}

export default function AdminFHAApprovedCondosContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
