import React from "react";
import AdminPageContentEditor, { renderImageField, renderHeroVideoField } from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "jumbo-loans";
const TITLE = "Jumbo Loans Content";

const defaultJumboWhoBullets = [
  "A lower debt to income ratio",
  "A higher credit score",
  "A larger down payment",
];

const defaultMortgageCards = [
  { title: "Buy a Home", iconSrc: "/Mortage5.svg", description: "Find the right mortgage options to purchase your new home.", route: "/purchase" },
  { title: "Save Money", iconSrc: "/Mortage5.svg", description: "Explore refinancing solutions designed to lower rates and payments.", route: "/refinance" },
  { title: "Use My VA Benefits", iconSrc: "/Mortage4.svg", description: "Specialized mortgage benefits for veterans and service members.", route: "/va-loan" },
  { title: "Remodel", iconSrc: "/Mortage3.svg", description: "Finance home improvements and renovations with ease.", route: "/renovation-loans" },
  { title: "Buy Big", iconSrc: "/Mortage2.svg", description: "Jumbo loan solutions for higher value properties.", route: "/jumbo-loans" },
  { title: "Rural Housing", iconSrc: "/Mortage1.svg", description: "Affordable options for rural and suburban housing.", route: "/usda" },
];

const defaultJumboFaqs = [
  { q: "What is a jumbo loan?", a: "A jumbo loan is a mortgage that exceeds the conforming loan limits set by FHFA. In most areas the limit is $548,250 or higher." },
  { q: "Who should consider a jumbo loan?", a: "Buyers of higher-priced homes who have strong credit, stable income, and often a larger down payment." },
  { q: "Do you offer VA Jumbo?", a: "Yes. Eligible veterans can use VA benefits for jumbo loan amounts, potentially with no down payment." },
];

const defaultSolutionsBody =
  "We offer a specialized suite of Jumbo products designed to fit your unique financial needs. Our features include large loan amounts, flexible terms like 30 year fixed options, and Cash Out Refinance to access home equity. We also permit financing for non warrantable condominiums and offer streamlined qualification to simplify the process. Plus, our VA Jumbo option allows eligible veterans to use their benefits for higher loan amounts, potentially with no down payment.";

function getEmptyContent() {
  return {
    hero: {
      heading: "Jumbo Loans",
      description:
        "A jumbo loan is a loan for a home where the loan amount falls outside of the conforming loan limits. In most counties the conforming loan limit is $548,250 (higher in other counties).",
      ctaLabel: "Check Today's Rate",
      imageUrl: "",
      videoUrl: "",
    },
    what: {
      heading: "What are Jumbo Loans?",
      description:
        "Jumbo loans finance homes that exceed conforming loan limits. They typically require stronger credit and may have different underwriting guidelines.",
      ctaLabel: "Get a Quote",
    },
    who: {
      heading: "Who Should Apply?",
      description:
        "Our Jumbo Loan programs are ideal for buyers of premium properties who demonstrate strong financial health. If you are looking to buy a high valued home, this loan may be right for you.",
      ctaLabel: "Get a Quote",
      bullets: defaultJumboWhoBullets.map((b) => b),
    },
    solutions: {
      heading: "THE HOMY LOANS JUMBO LOAN SOLUTIONS",
      body: defaultSolutionsBody,
      ctaLabel: "Check Today's Rate",
      imageUrl: "",
      videoUrl: "",
    },
    mortgage: {
      heading: "Mortgage Made Simple",
      subtitle: "Find the perfect loan program for your unique financial situation. We make the process transparent and fast.",
      cards: defaultMortgageCards.map((c) => ({ ...c })),
    },
    faq: { faqs: defaultJumboFaqs.map((f) => ({ ...f })) },
  };
}

function mergeContent(empty, data) {
  const whoData = data?.who || {};
  const whoBullets = Array.isArray(whoData.bullets) && whoData.bullets.length > 0 ? whoData.bullets : empty.who.bullets;

  const mort = data?.mortgage;
  const mortgageCards = Array.isArray(mort?.cards) && mort.cards.length > 0
    ? mort.cards.map((card, i) => ({
        title: card?.title ?? empty.mortgage.cards[i]?.title ?? "",
        iconSrc: card?.iconSrc ?? empty.mortgage.cards[i]?.iconSrc ?? "",
        description: card?.description ?? empty.mortgage.cards[i]?.description ?? "",
        route: card?.route ?? empty.mortgage.cards[i]?.route ?? "",
      }))
    : empty.mortgage.cards;
  while (mortgageCards.length < 6) mortgageCards.push({ title: "", iconSrc: "", description: "", route: "" });

  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;

  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    what: mergeWithDefaults(empty.what, data?.what),
    who: { ...mergeWithDefaults(empty.who, data?.who), bullets: whoBullets },
    solutions: mergeWithDefaults(empty.solutions, data?.solutions),
    mortgage: { ...mergeWithDefaults(empty.mortgage, data?.mortgage), cards: mortgageCards.slice(0, 6) },
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "what", "who", "solutions", "mortgage", "faq"];
const sectionLabels = {
  hero: "Hero",
  what: "What are Jumbo Loans",
  who: "Who Should Apply",
  solutions: "Jumbo Loan Solutions",
  mortgage: "Mortgage Made Simple",
  faq: "FAQ",
};

function renderForm(activeTab, content, updateSection, updateArray, opts = {}) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const { inputStyle, labelStyle, addArrayItem, removeArrayItem } = opts;
  const common = (
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
        {common}
        {renderHeroVideoField("hero", "videoUrl", s.videoUrl, set, opts)}
        {renderImageField("hero", "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "what") return common;
  if (activeTab === "who") {
    const bullets = s.bullets || [];
    return (
      <>
        {common}
        <label style={labelStyle}>Bullet points (one per line)</label>
        <textarea
          style={{ ...inputStyle, minHeight: 80 }}
          value={bullets.join("\n")}
          onChange={(e) => set("bullets", e.target.value.split("\n").map((t) => t.trim()).filter(Boolean))}
          placeholder="One per line"
        />
      </>
    );
  }
  if (activeTab === "solutions") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} placeholder="THE HOMY LOANS JUMBO LOAN SOLUTIONS" />
        <label style={labelStyle}>Body text</label>
        <textarea style={{ ...inputStyle, minHeight: 120 }} value={s.body || ""} onChange={(e) => set("body", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
        {renderHeroVideoField("solutions", "videoUrl", s.videoUrl, set, opts)}
        {renderImageField("solutions", "imageUrl", s.imageUrl, set, opts)}
      </>
    );
  }
  if (activeTab === "mortgage") {
    const cards = s.cards || [];
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} placeholder="Mortgage Made Simple" />
        <label style={labelStyle}>Subtitle</label>
        <textarea style={{ ...inputStyle, minHeight: 60 }} value={s.subtitle || ""} onChange={(e) => set("subtitle", e.target.value)} />
        {cards.slice(0, 6).map((card, i) => (
          <div key={i} style={{ marginBottom: 16, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <label style={labelStyle}>Card {i + 1} – Title</label>
            <input style={inputStyle} value={card.title || ""} onChange={(e) => updateArray("mortgage", "cards", i, { ...card, title: e.target.value })} />
            <label style={labelStyle}>Icon/Image URL</label>
            <input style={inputStyle} value={card.iconSrc || ""} onChange={(e) => updateArray("mortgage", "cards", i, { ...card, iconSrc: e.target.value })} />
            <label style={labelStyle}>Description</label>
            <input style={inputStyle} value={card.description || ""} onChange={(e) => updateArray("mortgage", "cards", i, { ...card, description: e.target.value })} />
            <label style={labelStyle}>Route</label>
            <input style={inputStyle} value={card.route || ""} onChange={(e) => updateArray("mortgage", "cards", i, { ...card, route: e.target.value })} />
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

export default function AdminJumboContent() {
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
