import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { adminLogout, getStoredAdmin } from "../services/adminApi";

const SIDEBAR_GROUPS = [
  {
    id: "refinance",
    label: "Refinance",
    links: [{ to: "/content/refinance2", label: "Refinance" }],
  },
  {
    id: "purchase",
    label: "Purchase",
    links: [
      { to: "/content/purchase", label: "Buy a Home" },
      { to: "/content/refinance", label: "Save money" },
      { to: "/content/va-loan", label: "VA Loan" },
      { to: "/content/jumbo-loans", label: "Jumbo Loans" },
      { to: "/content/renovation-loans", label: "Renovation" },
      { to: "/content/downpayment", label: "Down Payment Assistance" },
      { to: "/content/usda", label: "USDA" },
      { to: "/content/credit-challenged", label: "Credit Challenged" },
      { to: "/content/reverse", label: "Reverse" },
    ],
  },
  {
    id: "loanOptions",
    label: "Loan Options",
    links: [
      { to: "/content/conventional-loan", label: "Conventional Loan" },
      { to: "/content/fha-loan", label: "FHA Loan" },
      { to: "/content/home-select", label: "Home Select" },
      { to: "/content/portfolio-lending", label: "Portfolio Lending" },
      { to: "/content/fha-approved-condos", label: "FHA Approved Condos" },
      { to: "/content/fha-no-credit", label: "FHA No Credit" },
      { to: "/content/usda-renovation", label: "USDA Renovation" },
      { to: "/content/physician-loan", label: "Physician Loan" },
      { to: "/content/heloc", label: "HELOC" },
      { to: "/content/usdaloan", label: "USDA Loan" },
      { to: "/content/arrive-home", label: "Arrive Home" },
      { to: "/content/fixed-adjustable", label: "Fixed vs Adjustable" },
      { to: "/content/self-employed", label: "Self Employed" },
      { to: "/content/firsttimehomebuyers", label: "First Time Home Buyers" },
    ],
  },
  {
    id: "applyNow",
    label: "Apply Now",
    links: [{ to: "/content/applynow", label: "Apply Now" }],
  },
  {
    id: "resources",
    label: "Resources",
    links: [
      { to: "/content/amp", label: "HomyLoans AMP" },
      { to: "/content/mortgagepayment", label: "Mortgage Payment" },
      { to: "/content/homebuyer", label: "Homebuyers Guide" },
      { to: "/content/mortgagetermdefined", label: "Mortgage Terms Defined" },
      { to: "/content/findofficer", label: "Locations" },
    ],
  },
  {
    id: "careers",
    label: "Careers",
    links: [
      { to: "/content/careermeetpurpose", label: "Branch & LO Opportunity" },
      { to: "/content/trustedpartner", label: "Operations" },
    ],
  },
  {
    id: "ourStory",
    label: "Our Story",
    links: [
      { to: "/content/aboutus", label: "About Us" },
      { to: "/content/leadership", label: "Leadership" },
      { to: "/content/goodhuman", label: "Be A Good Human" },
      { to: "/content/reviews", label: "Reviews" },
    ],
  },
];

const initialExpanded = Object.fromEntries(
  SIDEBAR_GROUPS.map((g) => [g.id, false])
);

export default function AdminLayout() {
  const navigate = useNavigate();
  const admin = getStoredAdmin();
  const [expandedGroups, setExpandedGroups] = useState(initialExpanded);

  const handleLogout = () => {
    adminLogout();
    navigate("/login", { replace: true });
  };

  const toggleGroup = (id) => {
    setExpandedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navStyle = ({ isActive }) => ({
    padding: "8px 16px",
    textDecoration: "none",
    color: isActive ? "#fff" : "#b0b0b0",
    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
    borderRadius: 8,
  });

  const groupHeaderStyle = {
    color: "#888",
    fontSize: 11,
    fontWeight: 600,
    marginTop: 12,
    marginBottom: 4,
    paddingLeft: 4,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 6,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    borderRadius: 8,
  };

  const subLinkWrap = { paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          height: "100vh",
          overflowY: "auto",
          background: "#1a1a2e",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ color: "#fff", fontWeight: 600, marginBottom: 24 }}>
          HomyLoan Admin
        </div>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <NavLink to="/blogs" style={navStyle}>
            Blogs
          </NavLink>
          <NavLink to="/jobs" style={navStyle}>
            Jobs
          </NavLink>
          <NavLink to="/press" style={navStyle}>
            Press
          </NavLink>
          <NavLink to="/subscriptions" style={navStyle}>
            Subscriptions
          </NavLink>
          <NavLink to="/surveys" style={navStyle}>
            Surveys
          </NavLink>
          <NavLink to="/homepage" style={navStyle}>
            Homepage Content
          </NavLink>

          {SIDEBAR_GROUPS.map((group) => {
            const isOpen = expandedGroups[group.id];
            return (
              <div key={group.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleGroup(group.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleGroup(group.id);
                    }
                  }}
                  style={{
                    ...groupHeaderStyle,
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#aaa";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#888";
                  }}
                >
                  <span style={{ transition: "transform 0.2s" }}>
                    {isOpen ? "▼" : "▶"}
                  </span>
                  {group.label}
                </div>
                {isOpen && (
                  <div style={subLinkWrap}>
                    {group.links.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        style={navStyle}
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          {admin && (
            <div style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>
              {admin.email}
            </div>
          )}
          <NavLink
            to="/account-settings"
            style={({ isActive }) => ({
              display: "block",
              padding: "8px 16px",
              marginBottom: 8,
              textDecoration: "none",
              color: isActive ? "#fff" : "#b0b0b0",
              background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
              borderRadius: 8,
              fontSize: 14,
            })}
          >
            Account Settings
          </NavLink>
          <NavLink
            to="/change-password"
            style={({ isActive }) => ({
              display: "block",
              padding: "8px 16px",
              marginBottom: 8,
              textDecoration: "none",
              color: isActive ? "#fff" : "#b0b0b0",
              background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
              borderRadius: 8,
              fontSize: 14,
            })}
          >
            Change Password
          </NavLink>
          {admin?.role === "superadmin" && (
            <>
              <NavLink
                to="/admin-management"
                style={({ isActive }) => ({
                  display: "block",
                  padding: "8px 16px",
                  marginBottom: 8,
                  textDecoration: "none",
                  color: isActive ? "#fff" : "#b0b0b0",
                  background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                  borderRadius: 8,
                  fontSize: 14,
                })}
              >
                Manage Admins
              </NavLink>
              <NavLink
                to="/add-admin"
                style={({ isActive }) => ({
                  display: "block",
                  padding: "8px 16px",
                  marginBottom: 8,
                  textDecoration: "none",
                  color: isActive ? "#fff" : "#b0b0b0",
                  background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                  borderRadius: 8,
                  fontSize: 14,
                })}
              >
                Add Admin
              </NavLink>
            </>
          )}
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              background: "transparent",
              color: "#b0b0b0",
              border: "1px solid #444",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              width: "100%",
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: 24,
          overflow: "auto",
          background: "#f5f5f5",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
