import React from "react";
import AdminPageContentEditor, { renderImageField } from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "refinance";
const TITLE = "Refinance Content";

const defaultMortgageCards = [
  { title: "FHA Loans", iconSrc: "/RefinanceLogo1.svg", description: "Find the right mortgage options to purchase your new home.", route: "/fha-loan" },
  { title: "USDA Loans", iconSrc: "/RefinanceLogo1.svg", description: "Explore refinancing solutions designed to lower rates and payments.", route: "/usdaloan" },
  { title: "DPA Loans", iconSrc: "/Mortage3.svg", description: "Programs are available to help cover down payment.", route: "/Downpaymentassistance" },
  { title: "VA Loans", iconSrc: "/Mortage2.svg", description: "Finance home improvements and renovations with ease.", route: "/va-loan" },
  { title: "Conventional Loans", iconSrc: "/RefinanceLogo2.svg", description: "Jumbo loan solutions for higher value properties.", route: "/conventional-loan" },
];

const defaultRefinanceFaqs = [
  { q: "What types of refinancing do you offer?", a: "We offer rate-and-term refinancing, cash-out refinancing, and streamline options including VA IRRRL." },
  { q: "When is a good time to refinance?", a: "When you can secure a lower rate, shorten your term, or need to access home equity. Our team can help you evaluate." },
  { q: "What are refinancing costs?", a: "Costs vary by loan type. We keep closing costs transparent and competitive." },
];

function getEmptyContent() {
  return {
    hero: {
      heading: "REFINANCE YOUR\nHOME",
      description:
        "To refinance a mortgage means to replace an existing mortgage loan with a new one. With a refinance, the principal balance of the existing loan is paid-in-full using the balance of the new loan.",
      ctaLabel: "Check Today's Rate",
      imageUrl: "/home6.svg",
    },
    whatIs: {
      heading: "WHAT IS\nREFINANCING?",
      description:
        "To refinance a mortgage means to replace an existing mortgage loan with a new one. With a refinance, the principal balance of the existing loan is paid-in-full using the balance of the new loan.",
      ctaLabel: "Get a Quote",
      imageUrl: "/computer.svg",
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
    mortgage: {
      heading: "Mortgage Made Simple",
      subtitle: "Find the perfect loan program for your unique financial situation. We make the process transparent and fast.",
      cards: defaultMortgageCards.map((c) => ({ ...c })),
    },
    faq: { faqs: defaultRefinanceFaqs.map((f) => ({ ...f })) },
  };
}

function mergeContent(empty, data) {
  const mort = data?.mortgage;
  const mortgageCards = Array.isArray(mort?.cards) && mort.cards.length > 0
    ? mort.cards.map((card, i) => ({
        title: card?.title ?? empty.mortgage.cards[i]?.title ?? "",
        iconSrc: card?.iconSrc ?? empty.mortgage.cards[i]?.iconSrc ?? "",
        description: card?.description ?? empty.mortgage.cards[i]?.description ?? "",
        route: card?.route ?? empty.mortgage.cards[i]?.route ?? "",
      }))
    : empty.mortgage.cards;
  while (mortgageCards.length < 5) mortgageCards.push({ title: "", iconSrc: "", description: "", route: "" });

  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;

  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    whatIs: mergeWithDefaults(empty.whatIs, data?.whatIs),
    reasons: mergeWithDefaults(empty.reasons, data?.reasons),
    rightTime: mergeWithDefaults(empty.rightTime, data?.rightTime),
    mortgage: {
      ...mergeWithDefaults(empty.mortgage, data?.mortgage),
      cards: mortgageCards.slice(0, 5),
    },
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "whatIs", "reasons", "rightTime", "mortgage", "faq"];
const sectionLabels = {
  hero: "Hero",
  whatIs: "What is Refinancing?",
  reasons: "Reasons to Refinance",
  rightTime: "Right Time",
  mortgage: "Mortgage Made Simple",
  faq: "FAQ",
};

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
  if (activeTab === "rightTime") {
    return (
      <>
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} />
        <label style={labelStyle}>Sub Text</label>
        <input style={inputStyle} value={s.subText || ""} onChange={(e) => set("subText", e.target.value)} />
        {renderImageField("rightTime", "imageUrl", s.imageUrl, set, opts)}
        <label style={labelStyle}>Body Text</label>
        <textarea style={{ ...inputStyle, minHeight: 100 }} value={s.bodyText || ""} onChange={(e) => set("bodyText", e.target.value)} />
        <label style={labelStyle}>CTA Label</label>
        <input style={inputStyle} value={s.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} />
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
        {cards.slice(0, 5).map((card, i) => (
          <div key={i} style={{ marginBottom: 16, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <label style={labelStyle}>Card {i + 1} – Title</label>
            <input style={inputStyle} value={card.title || ""} onChange={(e) => updateArray("mortgage", "cards", i, { ...card, title: e.target.value })} />
            <label style={labelStyle}>Icon/Image URL</label>
            <input style={inputStyle} value={card.iconSrc || ""} onChange={(e) => updateArray("mortgage", "cards", i, { ...card, iconSrc: e.target.value })} placeholder="/RefinanceLogo1.svg" />
            <label style={labelStyle}>Description</label>
            <input style={inputStyle} value={card.description || ""} onChange={(e) => updateArray("mortgage", "cards", i, { ...card, description: e.target.value })} />
            <label style={labelStyle}>Route</label>
            <input style={inputStyle} value={card.route || ""} onChange={(e) => updateArray("mortgage", "cards", i, { ...card, route: e.target.value })} placeholder="/fha-loan" />
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
