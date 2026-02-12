import React, { useState, useEffect } from "react";
import * as pageContentApi from "../services/pageContentApi";

const mortgageTermDefinedEmptyContent = {
  hero: {
    pillText: "HOMY LOANS",
    heading: "Mortgage Terms Defined",
    image: "/MorgageTerm.svg",
  },
  terms: {
    heading: "Mortgage Terms Defined",
    description: "APPRAISAL: An estimate of value of property resulting from analysis of facts about the property; an opinion of value. ANNUAL PERCENTAGE RATE (APR): The borrower's costs of the loan term expressed as a rate. This is not their interest rate.\nBENEFICIARY: The recipient of benefits, often from a deed of trust; usually the lender.\nCLOSING DISCLOSURE (CD): Closing Disclosure form designed to provide disclosures that will be helpful to borrowers in understanding all of the costs of the transaction. This form will be given to the consumer three (3) business days before closing.\nCLOSE OF ESCROW: Generally the date the buyer becomes the legal owner and title insurance becomes effective. COMPARABLE SALES: Sales that have similar characteristics as the subject real property, used for analysis in the appraisal. Commonly called \"comps.\"\nCONSUMMATION: Occurs when the borrower becomes contractually obligated to the creditor on the loan, not, for example, when the borrower becomes contractually obligated to a seller on a real estate transaction. The point in time when a borrower becomes contractually obligated to the creditor on the loan depends on applicable State law.\nConsummation is not the same as close of escrow or settlement.\nDEED OF TRUST: An instrument used in many states in place of a mortgage.\nDEED RESTRICTIONS: Limitations in the deed to a parcel of real property that dictate certain uses that may or may not be made of the real property.\nDISBURSEMENT DATE: The date the amounts are to be disbursed to a buyer and seller in a purchase transaction or the date funds are to be paid to the borrower or a third party in a transaction that is not a purchase transaction.\nEARNEST MONEY DEPOSIT: Down payment made by a purchaser of real property as evidence of good faith; a deposit or partial payment.\nEASEMENT: A right, privilege or interest limited to a specific purpose that one party has in the land of another.\nENDORSEMENT: As to a title insurance policy, a rider or attachment forming a part of the insurance policy expanding or limiting coverage.\nHAZARD INSURANCE: Real estate insurance protecting against fire, some natural causes, vandalism, etc., depending upon the policy. Buyer often adds liability insurance and extended coverage for personal property.\nIMPOUNDS: A trust type of account established by lenders for the accumulation of borrower's funds to meet periodic payments of taxes, mortgage insurance premiums and/or future insurance policy premiums, required to protect their security.\nLEGAL DESCRIPTION: A description of land recognized by law, based on government surveys, spelling out the exact boundaries of the entire parcel of land. It should so thoroughly identify a parcel of land that it cannot be confused with any other.\nLIEN: A form of encumbrance that usually makes a specific parcel of real property the security for the payment of a debt or discharge of an obligation. For example, judgments, taxes, mortgages, deeds of trust.\nLOAN ESTIMATE (LE ): Form designed to provide disclosures that will be helpful to borrowers in understanding the key features, costs and risks of the mortgage loan for which they are applying. Initial disclosure to be given to the borrower three (3) business days after application.\nMORTGAGE: The instrument by which real property is pledged as security for repayment of a loan.\nPITI: A payment that includes Principal, Interest, Taxes, and Insurance.\nPOWER OF ATTORNEY: A written instrument whereby a principal gives authority to an agent. The agent acting under such a grant is sometimes called an \"Attorney-in-Fact.\"\nRECORDING: Filing documents affecting real property with the appropriate government agency as a matter of public record. SETTLEMENT\nSTATEMENT: Provides a complete breakdown of costs involved in a real estate transaction..\nTRID: TILA-RESPA Integrated Disclosures",
    image: "/MorgageTermDefined.svg",
  },
};

function mergeMortgageTermDefinedContent(empty, data) {
  const getValue = (dataVal, defaultVal) => (dataVal !== null && dataVal !== undefined ? dataVal : defaultVal);

  const heroData = data?.hero || {};
  const termsData = data?.terms || {};

  return {
    hero: {
      pillText: getValue(heroData.pillText, empty.hero.pillText),
      heading: getValue(heroData.heading, empty.hero.heading),
      image: getValue(heroData.image, empty.hero.image),
    },
    terms: {
      heading: getValue(termsData.heading, empty.terms.heading),
      description: getValue(termsData.description, empty.terms.description),
      image: getValue(termsData.image, empty.terms.image),
    },
  };
}

const inputStyle = { width: "100%", padding: "8px 12px", marginBottom: 8, border: "1px solid #ccc", borderRadius: 6 };
const labelStyle = { display: "block", marginBottom: 4, fontWeight: 500, fontSize: 14 };

const sectionOrder = ["hero", "terms"];
const sectionLabels = { hero: "Hero", terms: "Terms" };

export default function AdminMortgageTermDefinedContent() {
  const [content, setContent] = useState(mortgageTermDefinedEmptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    setLoading(true);
    setError("");
    pageContentApi.getPageContent("mortgagetermdefined")
      .then((data) => {
        setContent(mergeMortgageTermDefinedContent(mortgageTermDefinedEmptyContent, data && typeof data === "object" ? data : {}));
        setActiveTab("hero");
      })
      .catch((err) => {
        setContent(mergeMortgageTermDefinedContent(mortgageTermDefinedEmptyContent, {}));
        setError(err.message || "Failed to load Mortgage Term Defined content.");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSection = (section, field, value) => {
    setContent((c) => ({ ...c, [section]: { ...(c[section] || {}), [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await pageContentApi.updatePageContent("mortgagetermdefined", content);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ margin: "0 0 16px", fontSize: 24 }}>Mortgage Term Defined Content</h1>
        <p>Loading content…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Mortgage Term Defined Content</h1>
        <button type="button" onClick={handleSave} disabled={saving} style={{ padding: "10px 20px", background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? "Saving…" : "Save all"}
        </button>
      </div>
      {error && <div style={{ padding: 12, background: "#fee", color: "#c00", borderRadius: 8, marginBottom: 16 }}>{error}</div>}

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ minWidth: 160, borderRight: "1px solid #eee", paddingRight: 16 }}>
          {sectionOrder.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 12px",
                marginBottom: 4,
                textAlign: "left",
                background: activeTab === key ? "#eee" : "transparent",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {sectionLabels[key]}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 300, background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          {activeTab === "hero" && (
            <>
              <label style={labelStyle}>Pill Text</label>
              <input style={inputStyle} value={content.hero?.pillText || ""} onChange={(e) => updateSection("hero", "pillText", e.target.value)} />
              <label style={labelStyle}>Hero Heading</label>
              <input style={inputStyle} value={content.hero?.heading || ""} onChange={(e) => updateSection("hero", "heading", e.target.value)} />
              <label style={labelStyle}>Hero Image URL</label>
              <input style={inputStyle} value={content.hero?.image || ""} onChange={(e) => updateSection("hero", "image", e.target.value)} placeholder="/MorgageTerm.svg" />
            </>
          )}

          {activeTab === "terms" && (
            <>
              <label style={labelStyle}>Terms Section Heading</label>
              <input style={inputStyle} value={content.terms?.heading || ""} onChange={(e) => updateSection("terms", "heading", e.target.value)} />
              <label style={labelStyle}>Description (use \n for line breaks)</label>
              <textarea style={inputStyle} rows={15} value={content.terms?.description || ""} onChange={(e) => updateSection("terms", "description", e.target.value)} />
              <label style={labelStyle}>Terms Image URL</label>
              <input style={inputStyle} value={content.terms?.image || ""} onChange={(e) => updateSection("terms", "image", e.target.value)} placeholder="/MorgageTermDefined.svg" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
