import React from "react";
import AdminPageContentEditor, { renderHeroVideoField, renderImageField } from "../components/AdminPageContentEditor";

const PAGE_KEY = "arrive-home";
const TITLE = "Arrive Home Content";

const defaultRepayable = ["No income limits", "3.5% or 5% assistance (5% assistance is only offered for repayable assistance)", "Amortized, 10-year term with a fixed interest rate 2% higher than first mortgage", "No subordination for 3 years", "Less out of pocket"];
const defaultForgivable = ["Qualifying income must be less than or equal to 160% of median income", "3.5% assistance", "30-year term with a fixed 0% interest rate. No monthly payments", "No subordination", "Forgiven after 36 on-time 1st payments", "Lower total payment, more in closing costs"];

function getEmptyContent() {
  return {
    hero: {
      badge: "HOMY LOANS",
      heading: "Arrive Home\nProgram",
      description: "Are you ready to buy a home but need help with the down payment? If so, check out the Arrive Home Program!",
      ctaLabel: "Check Today Rates",
      videoUrl: "",
      imageUrl: "",
    },
    overview: {
      heading: "Program Overview",
      description: "The Arrive Home Program is designed to support underserved communities by providing down payment assistance, helping more families achieve homeownership and build generational wealth. This program celebrates the diverse cultures of these communities while turning the American dream of homeownership into reality. While everyone is eligible, the program especially supports underserved populations, including Latino, African American, Native American, and Asian communities.",
      imageUrl: "/ArriveHome_Overview.svg",
    },
    factFiction: {
      heading: "FACT VS. FICTION",
      repayableHeading: "Repayable DPA",
      repayableItems: defaultRepayable,
      forgivableHeading: "Forgivable DPA",
      forgivableItems: defaultForgivable,
      ctaLabel: "Get a Quote",
      imageUrl: "",
    },
    faq: { faqs: [] },
  };
}

function mergeContent(empty, data) {
  const repay = Array.isArray(data?.factFiction?.repayableItems) && data.factFiction.repayableItems.length > 0 ? data.factFiction.repayableItems : empty.factFiction.repayableItems;
  const forg = Array.isArray(data?.factFiction?.forgivableItems) && data.factFiction.forgivableItems.length > 0 ? data.factFiction.forgivableItems : empty.factFiction.forgivableItems;
  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;
  return {
    hero: { ...empty.hero, ...(data?.hero || {}) },
    overview: { ...empty.overview, ...(data?.overview || {}) },
    factFiction: { ...empty.factFiction, ...(data?.factFiction || {}), repayableItems: repay, forgivableItems: forg },
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "overview", "factFiction", "faq"];
const sectionLabels = { hero: "Hero", overview: "Overview", factFiction: "Fact vs Fiction", faq: "FAQ" };

function renderForm(activeTab, content, updateSection, updateArray, opts = {}) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const { inputStyle, labelStyle, addArrayItem, removeArrayItem } = opts;
  if (activeTab === "hero") {
    return (
      <>
        <label style={labelStyle}>Badge</label>
        <input style={inputStyle} value={s.badge || ""} onChange={(e) => set("badge", e.target.value)} />
        <label style={labelStyle}>Heading (use \\n for line break)</label>
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
  if (activeTab === "overview") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        {renderImageField("overview", "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "factFiction") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Repayable DPA heading</label>
        <input style={inputStyle} value={s.repayableHeading || ""} onChange={(e) => set("repayableHeading", e.target.value)} />
        <label style={labelStyle}>Repayable items (one per line)</label>
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={(s.repayableItems || []).join("\n")} onChange={(e) => updateSection("factFiction", "repayableItems", e.target.value.split("\n").filter(Boolean))} />
        <label style={labelStyle}>Forgivable DPA heading</label>
        <input style={inputStyle} value={s.forgivableHeading || ""} onChange={(e) => set("forgivableHeading", e.target.value)} />
        <label style={labelStyle}>Forgivable items (one per line)</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={(s.forgivableItems || []).join("\n")} onChange={(e) => updateSection("factFiction", "forgivableItems", e.target.value.split("\n").filter(Boolean))} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        {renderImageField("factFiction", "imageUrl", s.imageUrl, set, opts)}
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

export default function AdminArriveHomeContent() {
  return (
    <AdminPageContentEditor pageKey={PAGE_KEY} title={TITLE} getEmptyContent={getEmptyContent} mergeContent={mergeContent} sectionOrder={sectionOrder} sectionLabels={sectionLabels} renderForm={renderForm} />
  );
}
