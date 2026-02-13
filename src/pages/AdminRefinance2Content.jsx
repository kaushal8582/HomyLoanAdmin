import React from "react";
import AdminPageContentEditor, { renderImageField } from "../components/AdminPageContentEditor";
import { mergeWithDefaults } from "../utils/contentMerge";

const PAGE_KEY = "refinance2";
const TITLE = "Refinance2 Content";

const defaultDescription =
  "To refinance a mortgage means to replace an existing mortgage loan with a new one. With a refinance, the principal balance of the existing loan is paid-in-full using the balance of the new loan.";

const defaultProgramOptionsCards = [
  { title: "FHA Loans", description: "Find the right mortgage options to purchase your new home.", image: "/RefinanceLogo1.svg", route: "/fha-loan" },
  { title: "USDA Loans", description: "Explore refinancing solutions designed to lower rates and payments.", image: "/RefinanceLogo1.svg", route: "/usdaloan" },
  { title: "DPA Loans", description: "Programs are available to help cover down payment.", image: "/Mortage3.svg", route: "/Downpaymentassistance" },
  { title: "VA Loans", description: "Finance home improvements and renovations with ease.", image: "/Mortage2.svg", route: "/va-loan" },
  { title: "Conventional Loans", description: "Jumbo loan solutions for higher value properties.", image: "/RefinanceLogo2.svg", route: "/conventional-loan" },
];

const defaultFaqs = [
  { q: "What type of refinancing does Homy Loans offer?", a: "We offer rate-and-term refinancing, cash-out refinancing, and VA IRRRL (streamline) refinancing, among other options." },
  { q: "How do I know if refinancing is right for me?", a: "If you can secure a lower rate, shorten your term, or need to access home equity, refinancing may be a good fit. Our loan officers can help you evaluate your situation." },
  { q: "What are the costs involved in refinancing?", a: "Costs vary by loan type and lender. We work to keep closing costs transparent and competitive." },
];

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
    programOptions: {
      subtext: "Our Loan options",
      heading: "Program Options",
      cards: defaultProgramOptionsCards.map((c) => ({ ...c })),
    },
    faq: { faqs: defaultFaqs.map((f) => ({ ...f })) },
  };
}

function mergeContent(empty, data) {
  const po = data?.programOptions;
  const programOptionsCards = Array.isArray(po?.cards) && po.cards.length > 0
    ? po.cards.map((card, i) => ({
        title: card?.title ?? empty.programOptions.cards[i]?.title ?? "",
        description: card?.description ?? empty.programOptions.cards[i]?.description ?? "",
        image: card?.image ?? empty.programOptions.cards[i]?.image ?? "",
        route: card?.route ?? empty.programOptions.cards[i]?.route ?? "",
      }))
    : empty.programOptions.cards;
  while (programOptionsCards.length < 5) programOptionsCards.push({ title: "", description: "", image: "", route: "" });

  const faqData = data?.faq;
  const faqs = Array.isArray(faqData?.faqs) && faqData.faqs.length > 0 ? faqData.faqs : empty.faq.faqs;

  return {
    hero: mergeWithDefaults(empty.hero, data?.hero),
    whatIs: mergeWithDefaults(empty.whatIs, data?.whatIs),
    reasons: mergeWithDefaults(empty.reasons, data?.reasons),
    when: mergeWithDefaults(empty.when, data?.when),
    programOptions: {
      ...mergeWithDefaults(empty.programOptions, data?.programOptions),
      cards: programOptionsCards.slice(0, 5),
    },
    faq: { faqs },
  };
}

const sectionOrder = ["hero", "whatIs", "reasons", "when", "programOptions", "faq"];
const sectionLabels = {
  hero: "Hero",
  whatIs: "What is Refinancing?",
  reasons: "Reasons to Refinance",
  when: "When is the Right Time",
  programOptions: "Program Options",
  faq: "FAQ",
};

function renderForm(activeTab, content, updateSection, updateArray, opts = {}) {
  const s = content[activeTab] || {};
  const set = (field, value) => updateSection(activeTab, field, value);
  const { inputStyle, labelStyle, addArrayItem, removeArrayItem } = opts;
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
  if (activeTab === "programOptions") {
    const cards = s.cards || [];
    return (
      <>
        <label style={labelStyle}>Subtext</label>
        <input style={inputStyle} value={s.subtext || ""} onChange={(e) => set("subtext", e.target.value)} placeholder="Our Loan options" />
        <label style={labelStyle}>Heading</label>
        <input style={inputStyle} value={s.heading || ""} onChange={(e) => set("heading", e.target.value)} placeholder="Program Options" />
        {cards.slice(0, 5).map((card, i) => (
          <div key={i} style={{ marginBottom: 16, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <label style={labelStyle}>Card {i + 1} – Title</label>
            <input style={inputStyle} value={card.title || ""} onChange={(e) => updateArray("programOptions", "cards", i, { ...card, title: e.target.value })} />
            <label style={labelStyle}>Description</label>
            <input style={inputStyle} value={card.description || ""} onChange={(e) => updateArray("programOptions", "cards", i, { ...card, description: e.target.value })} />
            <label style={labelStyle}>Image (URL or upload)</label>
            {renderImageField("programOptions", "imageUrl", card.image, (_field, value) => updateArray("programOptions", "cards", i, { ...(content.programOptions?.cards?.[i] || {}), image: value }), opts)}
            <label style={labelStyle}>Route</label>
            <input style={inputStyle} value={card.route || ""} onChange={(e) => updateArray("programOptions", "cards", i, { ...card, route: e.target.value })} placeholder="/fha-loan" />
          </div>
        ))}
      </>
    );
  }
  if (activeTab === "faq") {
    const faqs = s.faqs || [];
    return (
      <>
        <label style={labelStyle}>FAQs</label>
        {(content.faq?.faqs || []).map((faq, i) => (
          <div key={i} style={{ marginBottom: 12, padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <input style={inputStyle} placeholder="Question" value={faq.q || ""} onChange={(e) => updateArray("faq", "faqs", i, { ...faq, q: e.target.value })} />
            <textarea style={{ ...inputStyle, minHeight: 60 }} placeholder="Answer" value={faq.a || ""} onChange={(e) => updateArray("faq", "faqs", i, { ...faq, a: e.target.value })} />
            {removeArrayItem && (
              <button type="button" onClick={() => removeArrayItem("faq", "faqs", i)} style={{ marginTop: 8, padding: "6px 12px", background: "#999", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Remove</button>
            )}
          </div>
        ))}
        {addArrayItem && (
          <button type="button" onClick={() => addArrayItem("faq", "faqs", { q: "", a: "" })} style={{ padding: "8px 16px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Add FAQ</button>
        )}
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
