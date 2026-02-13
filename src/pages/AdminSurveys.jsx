import React, { useState, useEffect } from "react";
import * as surveyApi from "../services/surveyApi";

const formStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: 20,
  },
  box: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "100%",
    maxWidth: 800,
    maxHeight: "90vh",
    overflow: "auto",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 8,
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 12,
    border: "1px solid #ccc",
    borderRadius: 8,
    fontSize: 14,
    minHeight: 80,
    fontFamily: "inherit",
    resize: "vertical",
  },
  row: { display: "flex", gap: 12, marginTop: 16 },
  btn: (primary) => ({
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    fontSize: 14,
    cursor: "pointer",
    background: primary ? "#1a1a2e" : "#e0e0e0",
    color: primary ? "#fff" : "#333",
  }),
  section: {
    marginBottom: 24,
    padding: 16,
    background: "#f9f9f9",
    borderRadius: 8,
  },
  sectionTitle: {
    margin: "0 0 12px",
    fontSize: 16,
    fontWeight: 600,
    color: "#333",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
  },
};

export default function AdminSurveys() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingSurvey, setViewingSurvey] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchEmail, setSearchEmail] = useState("");
  const [form, setForm] = useState({});

  const loadSurveys = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError("");
      const data = await surveyApi.getAllSurveys(pageNum, 20);
      console.log("Surveys data received:", data); // Debug log
      setSurveys(data.surveys || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error loading surveys:", err); // Debug log
      const errorMessage = err.response?.data?.error || err.message || "Failed to load surveys";
      setError(errorMessage);
      setSurveys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys(page);
  }, [page]);

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      loadSurveys(page);
      return;
    }
    try {
      setLoading(true);
      const data = await surveyApi.getSurveysByEmail(searchEmail);
      setSurveys(data.surveys || []);
      setTotalPages(1);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const openView = async (id) => {
    try {
      const survey = await surveyApi.getSurveyById(id);
      setViewingSurvey(survey);
      setViewOpen(true);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to load survey");
    }
  };

  const openEdit = async (id) => {
    try {
      const survey = await surveyApi.getSurveyById(id);
      setEditingId(id);
      setForm(survey);
      setFormOpen(true);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to load survey");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await surveyApi.updateSurvey(editingId, form);
      setFormOpen(false);
      loadSurveys(page);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this survey? This is a soft delete and can be restored.")) return;
    try {
      await surveyApi.deleteSurvey(id);
      loadSurveys(page);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Delete failed");
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSurveyFieldLabel = (fieldName, value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === "string") return value;
    const journeyLabels = { 1: "Looking at homes & listings", 2: "I signed a purchase agreement", 3: "Offer pending / found a house" };
    const timeframeLabels = { 1: "Within 30 days", 2: "Within 2-3 months", 3: "Within 6 months" };
    const usageTypeLabels = { 1: "Primary Residence", 2: "Secondary Residence", 3: "Investment Property" };
    const yesNoLabels = { 1: "Yes", 2: "No" };
    const militaryAffiliationLabels = { 1: "No, I haven't served", 2: "Yes, I'm currently serving", 3: "Yes, I served in the past", 4: "Yes, I'm a surviving spouse" };
    const serviceTypeLabels = { 1: "Regular military", 2: "Reserves", 3: "National Guard" };
    const fundsSourceLabels = { 1: "My financial account", 2: "Gifts" };
    const addressTimelineLabels = { 1: "Own", 2: "Rent", 3: "i don't own or rent" };
    const homePriceLabels = { 1: "0k to 300k", 2: "300k to 500k", 3: "500k to 1m", 4: "1m+" };
    const maps = {
      journey: journeyLabels,
      timeframe: timeframeLabels,
      usageType: usageTypeLabels,
      workingWithAgent: yesNoLabels,
      mailingAddressConfirm: yesNoLabels,
      militaryAffiliation: militaryAffiliationLabels,
      affiliation: militaryAffiliationLabels,
      serviceType: serviceTypeLabels,
      marriedStatus: yesNoLabels,
      fundsSource: fundsSourceLabels,
      addressTimeline: addressTimelineLabels,
      homePrice: homePriceLabels,
    };
    const labels = maps[fieldName];
    return labels ? (labels[value] ?? value) : null;
  };

  const displayValue = (fieldName, value) => getSurveyFieldLabel(fieldName, value) ?? value;

  const renderField = (label, value) => {
    if (value === null || value === undefined || value === "") return null;
    return (
      <div style={{ marginBottom: 12 }}>
        <strong style={{ display: "block", marginBottom: 4, color: "#666", fontSize: 12 }}>{label}</strong>
        <div style={{ color: "#333" }}>{String(value)}</div>
      </div>
    );
  };

  const renderObject = (label, obj, valueMapper) => {
    if (!obj || typeof obj !== "object") return null;
    return (
      <div style={formStyles.section}>
        <div style={formStyles.sectionTitle}>{label}</div>
        {Object.entries(obj).map(([key, value]) => renderField(key, valueMapper ? (getSurveyFieldLabel(key, value) ?? value) : value))}
      </div>
    );
  };

  const renderSection = (title, children) => (
    <div style={formStyles.section}>
      <div style={formStyles.sectionTitle}>{title}</div>
      {children}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 24 }}>Survey Submissions</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            style={{ ...formStyles.input, width: 200, margin: 0 }}
          />
          <button type="button" onClick={handleSearch} style={formStyles.btn(true)}>
            Search
          </button>
          {searchEmail && (
            <button type="button" onClick={() => { setSearchEmail(""); loadSurveys(page); }} style={formStyles.btn(false)}>
              Clear
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{ padding: 12, background: "#fee", color: "#c00", borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : surveys.length === 0 ? (
        <p style={{ padding: 24, color: "#666" }}>No surveys found.</p>
      ) : (
        <>
          <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={{ textAlign: "left", padding: 12 }}>#</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Name</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Email</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Phone</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Submitted</th>
                  <th style={{ textAlign: "left", padding: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {surveys.map((survey, i) => (
                  <tr key={survey._id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={{ padding: 12, color: "#666" }}>{(page - 1) * 20 + i + 1}</td>
                    <td style={{ padding: 12 }}>
                      {survey.firstName || survey.lastName
                        ? `${survey.firstName || ""} ${survey.lastName || ""}`.trim()
                        : "—"}
                    </td>
                    <td style={{ padding: 12 }}>{survey.email || "—"}</td>
                    <td style={{ padding: 12 }}>{survey.phone || "—"}</td>
                    <td style={{ padding: 12, color: "#666", fontSize: 13 }}>{formatDate(survey.createdAt)}</td>
                    <td style={{ padding: 12 }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button type="button" onClick={() => openView(survey._id)} style={{ ...formStyles.btn(false), fontSize: 12, padding: "6px 12px" }}>
                          View
                        </button>
                        <button type="button" onClick={() => openEdit(survey._id)} style={{ ...formStyles.btn(false), fontSize: 12, padding: "6px 12px" }}>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(survey._id)}
                          style={{ ...formStyles.btn(false), fontSize: 12, padding: "6px 12px", color: "#c00" }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ ...formStyles.btn(false), opacity: page === 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <span style={{ padding: "10px 20px", display: "flex", alignItems: "center" }}>
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ ...formStyles.btn(false), opacity: page === totalPages ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* View Modal */}
      {viewOpen && viewingSurvey && (
        <div style={formStyles.overlay} onClick={() => setViewOpen(false)}>
          <div style={formStyles.box} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 16px" }}>Survey Details</h2>
            <div style={{ maxHeight: "70vh", overflow: "auto" }}>
              {renderSection("Contact", (
                <>
                  {renderField("ID", viewingSurvey._id)}
                  {renderField("First Name", viewingSurvey.firstName)}
                  {renderField("Middle Name", viewingSurvey.middleName)}
                  {renderField("Last Name", viewingSurvey.lastName)}
                  {renderField("Email", viewingSurvey.email)}
                  {renderField("Phone", viewingSurvey.phone)}
                </>
              ))}
              {renderSection("Property & Journey", (
                <>
                  {renderField("Journey", displayValue("journey", viewingSurvey.journey))}
                  {renderField("Timeframe", displayValue("timeframe", viewingSurvey.timeframe))}
                  {renderField("Home Price", displayValue("homePrice", viewingSurvey.homePrice))}
                  {renderField("Home Location", viewingSurvey.homeLocation)}
                  {renderField("Home Type", viewingSurvey.homeType)}
                  {renderField("Units", viewingSurvey.units)}
                  {renderField("Usage Type", displayValue("usageType", viewingSurvey.usageType))}
                  {renderField("Address Timeline", displayValue("addressTimeline", viewingSurvey.addressTimeline))}
                </>
              ))}
              {renderSection("Agent", (
                <>
                  {renderField("Working With Agent", displayValue("workingWithAgent", viewingSurvey.workingWithAgent))}
                  {renderObject("Agent Contact", viewingSurvey.agentContact)}
                </>
              ))}
              {renderSection("Address", (
                <>
                  {renderField("Street", viewingSurvey.street)}
                  {renderField("Apt", viewingSurvey.apt)}
                  {renderField("City", viewingSurvey.city)}
                  {renderField("State", viewingSurvey.state)}
                  {renderField("Zip", viewingSurvey.zip)}
                  {renderField("Mailing Address Confirm", displayValue("mailingAddressConfirm", viewingSurvey.mailingAddressConfirm))}
                  {renderObject("Mailing Address", viewingSurvey.mailingAddress)}
                </>
              ))}
              {renderSection("Military", (
                <>
                  {renderField("Military Affiliation", displayValue("militaryAffiliation", viewingSurvey.militaryAffiliation))}
                  {renderField("ETS Date", viewingSurvey.etsDate)}
                  {renderField("Branch of Service", viewingSurvey.branchOfService)}
                  {renderField("Service Type", displayValue("serviceType", viewingSurvey.serviceType))}
                  {viewingSurvey.military && Object.keys(viewingSurvey.military).length > 0 && renderObject("Military (details)", viewingSurvey.military, true)}
                </>
              ))}
              {renderSection("Marital & Financial", (
                <>
                  {renderField("Married Status", displayValue("marriedStatus", viewingSurvey.marriedStatus))}
                  {renderObject("Spouse Info", viewingSurvey.spouseInfo)}
                  {renderField("Yearly Income", viewingSurvey.yearlyIncome)}
                  {renderField("Funds Source", displayValue("fundsSource", viewingSurvey.fundsSource))}
                </>
              ))}
              {renderSection("Meta", (
                <>
                  {renderField("Submitted At", formatDate(viewingSurvey.createdAt))}
                  {renderField("Last Updated", formatDate(viewingSurvey.updatedAt))}
                </>
              ))}
            </div>
            <div style={formStyles.row}>
              <button type="button" onClick={() => { setViewOpen(false); openEdit(viewingSurvey._id); }} style={formStyles.btn(true)}>
                Edit
              </button>
              <button type="button" onClick={() => setViewOpen(false)} style={formStyles.btn(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {formOpen && (
        <div style={formStyles.overlay} onClick={() => setFormOpen(false)}>
          <div style={formStyles.box} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: "0 0 16px" }}>Edit Survey</h2>
            <form onSubmit={handleSubmit}>
              <div style={formStyles.section}>
                <div style={formStyles.sectionTitle}>Contact Information</div>
                <div style={formStyles.grid}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>First Name</label>
                    <input
                      style={formStyles.input}
                      value={form.firstName || ""}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Last Name</label>
                    <input
                      style={formStyles.input}
                      value={form.lastName || ""}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Email</label>
                    <input
                      type="email"
                      style={formStyles.input}
                      value={form.email || ""}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Phone</label>
                    <input
                      style={formStyles.input}
                      value={form.phone || ""}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div style={formStyles.section}>
                <div style={formStyles.sectionTitle}>Address</div>
                <div style={formStyles.grid}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Street</label>
                    <input
                      style={formStyles.input}
                      value={form.street || ""}
                      onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Apt</label>
                    <input
                      style={formStyles.input}
                      value={form.apt || ""}
                      onChange={(e) => setForm((f) => ({ ...f, apt: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>City</label>
                    <input
                      style={formStyles.input}
                      value={form.city || ""}
                      onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>State</label>
                    <input
                      style={formStyles.input}
                      value={form.state || ""}
                      onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Zip</label>
                    <input
                      style={formStyles.input}
                      value={form.zip || ""}
                      onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div style={formStyles.section}>
                <div style={formStyles.sectionTitle}>Home Details</div>
                <div style={formStyles.grid}>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Home Price</label>
                    <input
                      style={formStyles.input}
                      value={form.homePrice || ""}
                      onChange={(e) => setForm((f) => ({ ...f, homePrice: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Home Location</label>
                    <input
                      style={formStyles.input}
                      value={form.homeLocation || ""}
                      onChange={(e) => setForm((f) => ({ ...f, homeLocation: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Home Type</label>
                    <input
                      style={formStyles.input}
                      value={form.homeType || ""}
                      onChange={(e) => setForm((f) => ({ ...f, homeType: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: 4, fontWeight: 500 }}>Yearly Income</label>
                    <input
                      style={formStyles.input}
                      value={form.yearlyIncome || ""}
                      onChange={(e) => setForm((f) => ({ ...f, yearlyIncome: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div style={formStyles.row}>
                <button type="submit" style={formStyles.btn(true)}>
                  Update
                </button>
                <button type="button" onClick={() => setFormOpen(false)} style={formStyles.btn(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
