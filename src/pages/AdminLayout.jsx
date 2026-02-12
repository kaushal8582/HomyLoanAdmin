import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { adminLogout, getStoredAdmin } from "../services/adminApi";

export default function AdminLayout() {
  const navigate = useNavigate();
  const admin = getStoredAdmin();

  const handleLogout = () => {
    adminLogout();
    navigate("/login", { replace: true });
  };

  const navStyle = ({ isActive }) => ({
    padding: "8px 16px",
    textDecoration: "none",
    color: isActive ? "#fff" : "#b0b0b0",
    background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
    borderRadius: 8,
  });

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
          <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginTop: 12, marginBottom: 4, paddingLeft: 4 }}>Refinance</div>
          <NavLink to="/content/refinance2" style={navStyle}>Refinance</NavLink>
          <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginTop: 12, marginBottom: 4, paddingLeft: 4 }}>Purchase</div>
          <NavLink to="/content/purchase" style={navStyle}>Buy a Home</NavLink>
          <NavLink to="/content/refinance" style={navStyle}>Save money</NavLink>
          <NavLink to="/content/va-loan" style={navStyle}>VA Loan</NavLink>
          <NavLink to="/content/jumbo-loans" style={navStyle}>Jumbo Loans</NavLink>
          <NavLink to="/content/renovation-loans" style={navStyle}>Renovation</NavLink>
          <NavLink to="/content/downpayment" style={navStyle}>Down Payment Assistance</NavLink>
          <NavLink to="/content/usda" style={navStyle}>USDA</NavLink>
          <NavLink to="/content/credit-challenged" style={navStyle}>Credit Challenged</NavLink>
          <NavLink to="/content/reverse" style={navStyle}>Reverse</NavLink>
          <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginTop: 12, marginBottom: 4, paddingLeft: 4 }}>Loan Options</div>
          <NavLink to="/content/conventional-loan" style={navStyle}>Conventional Loan</NavLink>
          <NavLink to="/content/fha-loan" style={navStyle}>FHA Loan</NavLink>
          <NavLink to="/content/home-select" style={navStyle}>Home Select</NavLink>
          <NavLink to="/content/portfolio-lending" style={navStyle}>Portfolio Lending</NavLink>
          <NavLink to="/content/fha-approved-condos" style={navStyle}>FHA Approved Condos</NavLink>
          <NavLink to="/content/fha-no-credit" style={navStyle}>FHA No Credit</NavLink>
          <NavLink to="/content/usda-renovation" style={navStyle}>USDA Renovation</NavLink>
          <NavLink to="/content/physician-loan" style={navStyle}>Physician Loan</NavLink>
          <NavLink to="/content/heloc" style={navStyle}>HELOC</NavLink>
          <NavLink to="/content/usdaloan" style={navStyle}>USDA Loan</NavLink>
          <NavLink to="/content/arrive-home" style={navStyle}>Arrive Home</NavLink>
          <NavLink to="/content/fixed-adjustable" style={navStyle}>Fixed vs Adjustable</NavLink>
          <NavLink to="/content/self-employed" style={navStyle}>Self Employed</NavLink>
          <NavLink to="/content/firsttimehomebuyers" style={navStyle}>First Time Home Buyers</NavLink>
          <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginTop: 12, marginBottom: 4, paddingLeft: 4 }}>Apply Now</div>
          <NavLink to="/content/applynow" style={navStyle}>Apply Now</NavLink>
          <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginTop: 12, marginBottom: 4, paddingLeft: 4 }}>Resources</div>
          <NavLink to="/content/amp" style={navStyle}>HomyLoans AMP</NavLink>
          <NavLink to="/content/mortgagepayment" style={navStyle}>Mortgage Payment</NavLink>
          <NavLink to="/content/homebuyer" style={navStyle}>Homebuyers Guide</NavLink>
          <NavLink to="/content/mortgagetermdefined" style={navStyle}>Mortgage Terms Defined</NavLink>
          <NavLink to="/content/findofficer" style={navStyle}>Locations</NavLink>
          <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginTop: 12, marginBottom: 4, paddingLeft: 4 }}>Careers</div>
          <NavLink to="/content/careermeetpurpose" style={navStyle}>Branch & LO Opportunity</NavLink>
          <NavLink to="/content/trustedpartner" style={navStyle}>Operations</NavLink>
          <div style={{ color: "#888", fontSize: 11, fontWeight: 600, marginTop: 12, marginBottom: 4, paddingLeft: 4 }}>Our Story</div>
          <NavLink to="/content/aboutus" style={navStyle}>About Us</NavLink>
          <NavLink to="/content/leadership" style={navStyle}>Leadership</NavLink>
          <NavLink to="/content/goodhuman" style={navStyle}>Be A Good Human</NavLink>
          <NavLink to="/content/reviews" style={navStyle}>Reviews</NavLink>
        </nav>
        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          {admin && (
            <div style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>
              {admin.email}
            </div>
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
