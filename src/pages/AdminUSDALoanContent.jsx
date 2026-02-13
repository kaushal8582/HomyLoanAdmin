import React from "react";
import AdminPageContentEditor, { renderImageField } from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

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

const defaultBorrowerItems = [
  "Income ≤115% of area median income",
  "Credit score typically 640+",
  "Stable, dependable income",
  "U.S. citizen or permanent resident",
];

const defaultPropertyItems = [
  { label: "Location:", body: "The property must be located in a qualified rural area as defined by the USDA mapping tool." },
  { label: "Primary Residence:", body: "The property must serve as the buyer's primary residence." },
];

function getEmptyContent() {
  return {
    hero: {
      heading: "USDA Loans",
      description: "Homy Loans now offers in-house USDA loans, providing faster approvals and personalized service to help you achieve your homeownership goals with ease.",
      ctaLabel: "Explore loan programs",
      imageUrl: "",
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
      imageUrl: "",
    },
    who: {
      heading: "Who is Eligible for a USDA Loan?",
      body: "USDA Rural Housing loans are available to qualified low to moderate income homebuyers purchasing a home in a designated rural area. Unlike other government loans, USDA loans have two main areas of qualification: borrower eligibility and property eligibility.",
      borrowerItems: defaultBorrowerItems.map((x) => x),
      propertyItems: defaultPropertyItems.map((x) => ({ ...x })),
    },
    faq: { faqs: [] },
  };
}

function mergeContent(empty, data) {
  const topItems = Array.isArray(data?.top?.items) && data.top.items.length > 0 ? data.top.items : empty.top.items;
  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;
  const borrowerItems = Array.isArray(data?.who?.borrowerItems) && data.who.borrowerItems.length > 0 ? data.who.borrowerItems : empty.who.borrowerItems;
  const propertyItems = Array.isArray(data?.who?.propertyItems) && data.who.propertyItems.length > 0 ? data.who.propertyItems.map((it) => ({ label: it?.label ?? "", body: it?.body ?? "" })) : empty.who.propertyItems;
  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    what: mergeWithDefaults(empty.what, data?.what),
    top: { ...mergeWithDefaults(empty.top, data?.top), items: topItems },
    who: { ...mergeWithDefaults(empty.who, data?.who), borrowerItems, propertyItems },
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "what", "top", "who", "faq"];
const sectionLabels = { hero: "Hero", what: "What", top: "Top Benefits", who: "Who is Eligible", faq: "FAQ" };

function renderForm(activeTab, content, updateSection, updateArray, opts = {}) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const { inputStyle, labelStyle, addArrayItem, removeArrayItem } = opts;
  if (activeTab === "hero") {
    return (
      <>
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
        {renderImageField("top", "imageUrl", s.imageUrl, set, opts)}
        <label style={labelStyle}>List items (one per line)</label>
        <textarea style={{ ...inputStyle, minHeight: 120 }} value={(items || []).join("\n")} onChange={(e) => updateSection("top", "items", e.target.value.split("\n").filter(Boolean))} placeholder="One item per line" />
      </>
    );
  }
  if (activeTab === "who") {
    const borrowerItems = s.borrowerItems || [];
    const propertyItems = s.propertyItems || [];
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Body</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.body || ""} onChange={(e) => set("body", e.target.value)} />
        <label style={labelStyle}>Borrower items (one per line)</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={borrowerItems.join("\n")} onChange={(e) => updateSection("who", "borrowerItems", e.target.value.split("\n").filter(Boolean))} placeholder="One per line" />
        <label style={labelStyle}>Property items (label + body per row)</label>
        {propertyItems.map((item, i) => (
          <div key={i} style={{ marginBottom: 12, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <input style={inputStyle} placeholder="Label" value={item.label || ""} onChange={(e) => updateArray("who", "propertyItems", i, { ...item, label: e.target.value })} />
            <textarea style={{ ...inputStyle, minHeight: 50 }} placeholder="Body" value={item.body || ""} onChange={(e) => updateArray("who", "propertyItems", i, { ...item, body: e.target.value })} />
          </div>
        ))}
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

export default function AdminUSDALoanContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
