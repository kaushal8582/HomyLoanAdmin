import React from "react";
import AdminPageContentEditor, { renderImageField, renderHeroVideoField } from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "va-loan";
const TITLE = "VA Loan Content";

const defaultOptionsCards = [
  { title: "Loan Type", items: ["VA Purchase Loan", "VA IRRRL (Streamline Refinance)", "VA Cash Out Loan"] },
  { title: "Purpose", items: ["Buying a primary residence.", "Refinancing a current VA loan for a lower rate.", "Refinancing to take cash out of your home's equity."] },
  { title: "Key Feature", items: ["Up to 100% financing (zero down payment).", "Fast, simple, with minimal or no out of pocket costs.", "Access home equity for debt or expenses."] },
];

const defaultVAFaqs = [
  { q: "Who is eligible for a VA loan?", a: "Veterans, active duty service members, and eligible surviving spouses may qualify. Specific service requirements apply." },
  { q: "Do I need a down payment?", a: "VA loans often allow zero down payment for eligible borrowers, with no private mortgage insurance required." },
  { q: "Can I use a VA loan to refinance?", a: "Yes. VA IRRRL (streamline) and VA Cash Out refinance are available for qualifying borrowers." },
];

function getEmptyContent() {
  return {
    hero: {
      heading: "VA LOANS",
      description:
        "VA Loans help veterans, service members, and eligible families achieve homeownership with no down payment, no PMI, flexible qualifications, and competitive rates. At Homy Loans, we're proud to support those who've served by making this benefit accessible.",
      ctaLabel: "Check Today's Rate",
      imageUrl: "/VA_BG.svg",
      videoUrl: "",
    },
    whatIs: {
      heading: "What is a VA Loan?",
      description:
        "A VA loan is a mortgage designed specifically for veterans and service members. It is provided by approved private lenders like Homy Loans and is guaranteed by the federal government (the Department of Veterans Affairs). The primary benefit is the ability to purchase a home with no money down for eligible borrowers who meet qualifying income and credit requirements.",
      ctaLabel: "Get a Quote",
      imageUrl: "/VA_Who.svg",
    },
    who: {
      heading: "Who is Eligible for a VA Loan?",
      description:
        "To qualify for a VA Loan, a veteran must meet certain service requirements. Eligibility is typically open to: Veterans who have served a minimum number of days during wartime or peacetime; Service members who have served six years or more in the Reserves or National Guard; Active duty service members after serving for a minimum period; Spouses of a service member who was killed in the line of duty or died from a service-related disability.",
      ctaLabel: "Get a Quote",
    },
    options: {
      heading: "VA LOAN OPTIONS",
      description:
        "Whether you are looking to purchase a new home or refinance an existing mortgage, Homy Loans offers the full range of VA products to meet your financial needs.",
      cards: defaultOptionsCards.map((c) => ({ title: c.title, items: [...(c.items || [])] })),
    },
    faq: { faqs: defaultVAFaqs.map((f) => ({ ...f })) },
  };
}

function mergeContent(empty, data) {
  const opt = data?.options;
  const optionsCards = Array.isArray(opt?.cards) && opt.cards.length >= 3
    ? opt.cards.slice(0, 3).map((card, i) => ({
        title: (card?.title && card.title.trim()) ? card.title : (empty.options.cards[i]?.title ?? ""),
        items: Array.isArray(card?.items) && card.items.length > 0 ? card.items : (empty.options.cards[i]?.items || []),
      }))
    : empty.options.cards;
  while (optionsCards.length < 3) optionsCards.push({ title: "", items: [] });

  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;

  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    whatIs: mergeWithDefaults(empty.whatIs, data?.whatIs),
    who: mergeWithDefaults(empty.who, data?.who),
    options: {
      ...mergeWithDefaults(empty.options, data?.options),
      cards: optionsCards,
    },
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "whatIs", "who", "options", "faq"];
const sectionLabels = { hero: "Hero", whatIs: "What is VA Loan", who: "Who Qualifies", options: "VA Loan Options", faq: "FAQ" };

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
        <textarea style={{ ...inputStyle, minHeight: 80 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        {renderImageField("whatIs", "imageUrl", s.imageUrl, set, opts)}
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
    const cards = s.cards || [];
    return (
      <>
        <label style={labelStyle}>Section Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} placeholder="VA LOAN OPTIONS" />
        <label style={labelStyle}>Section Description</label>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={s.description || ""} onChange={(e) => set("description", e.target.value)} />
        {cards.slice(0, 3).map((card, i) => (
          <div key={i} style={{ marginBottom: 16, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <label style={labelStyle}>Card {i + 1} – Title</label>
            <input style={inputStyle} value={card.title || ""} onChange={(e) => updateArray("options", "cards", i, { ...card, title: e.target.value })} />
            <label style={labelStyle}>List items (one per line)</label>
            <textarea
              style={{ ...inputStyle, minHeight: 80 }}
              value={(card.items || []).join("\n")}
              onChange={(e) => updateArray("options", "cards", i, { ...card, items: e.target.value.split("\n").map((t) => t.trim()).filter(Boolean) })}
              placeholder="One item per line"
            />
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
