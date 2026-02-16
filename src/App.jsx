import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminBlogs from "./pages/AdminBlogs";
import AdminJobs from "./pages/AdminJobs";
import AdminHomepage from "./pages/AdminHomepage";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import AdminPress from "./pages/AdminPress";
import AdminSurveys from "./pages/AdminSurveys";
import AdminPurchaseContent from "./pages/AdminPurchaseContent";
import AdminRefinanceContent from "./pages/AdminRefinanceContent";
import AdminRefinance2Content from "./pages/AdminRefinance2Content";
import AdminVALoanContent from "./pages/AdminVALoanContent";
import AdminJumboContent from "./pages/AdminJumboContent";
import AdminRenovationContent from "./pages/AdminRenovationContent";
import AdminDPAContent from "./pages/AdminDPAContent";
import AdminUSDAContent from "./pages/AdminUSDAContent";
import AdminCreditChallengedContent from "./pages/AdminCreditChallengedContent";
import AdminReverseContent from "./pages/AdminReverseContent";
import AdminAboutUsContent from "./pages/AdminAboutUsContent";
import AdminLeadershipContent from "./pages/AdminLeadershipContent";
import AdminGoodHumanContent from "./pages/AdminGoodHumanContent";
import AdminReviewsContent from "./pages/AdminReviewsContent";
import AdminCareermeetpurposeContent from "./pages/AdminCareermeetpurposeContent";
import AdminTrustedPartnerContent from "./pages/AdminTrustedPartnerContent";
import AdminAMPContent from "./pages/AdminAMPContent";
import AdminMortgagePaymentContent from "./pages/AdminMortgagePaymentContent";
import AdminHomeBuyerContent from "./pages/AdminHomeBuyerContent";
import AdminMortgageTermDefinedContent from "./pages/AdminMortgageTermDefinedContent";
import AdminFindOfficerContent from "./pages/AdminFindOfficerContent";
import AdminApplyNowContent from "./pages/AdminApplyNowContent";
import AdminConventionalLoanContent from "./pages/AdminConventionalLoanContent";
import AdminFHALoanContent from "./pages/AdminFHALoanContent";
import AdminHomeSelectContent from "./pages/AdminHomeSelectContent";
import AdminPortfolioLendingContent from "./pages/AdminPortfolioLendingContent";
import AdminFHAApprovedCondosContent from "./pages/AdminFHAApprovedCondosContent";
import AdminFHANoCreditScoreContent from "./pages/AdminFHANoCreditScoreContent";
import AdminUSDARenovationContent from "./pages/AdminUSDARenovationContent";
import AdminPhysicianLoanContent from "./pages/AdminPhysicianLoanContent";
import AdminHELOCContent from "./pages/AdminHELOCContent";
import AdminUSDALoanContent from "./pages/AdminUSDALoanContent";
import AdminArriveHomeContent from "./pages/AdminArriveHomeContent";
import AdminFixedAdjustableContent from "./pages/AdminFixedAdjustableContent";
import AdminSelfEmployedContent from "./pages/AdminSelfEmployedContent";
import AdminFirstTimeHomeBuyersContent from "./pages/AdminFirstTimeHomeBuyersContent";
import { getStoredToken } from "./services/adminApi";

function ProtectedRoute({ children }) {
  const token = getStoredToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/blogs" replace />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="jobs" element={<AdminJobs />} />
        <Route path="press" element={<AdminPress />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="surveys" element={<AdminSurveys />} />
        <Route path="homepage" element={<AdminHomepage />} />
        <Route path="content/purchase" element={<AdminPurchaseContent />} />
        <Route path="content/refinance" element={<AdminRefinanceContent />} />
        <Route path="content/refinance2" element={<AdminRefinance2Content />} />
        <Route path="content/va-loan" element={<AdminVALoanContent />} />
        <Route path="content/jumbo-loans" element={<AdminJumboContent />} />
        <Route path="content/renovation-loans" element={<AdminRenovationContent />} />
        <Route path="content/downpayment" element={<AdminDPAContent />} />
        <Route path="content/usda" element={<AdminUSDAContent />} />
        <Route path="content/credit-challenged" element={<AdminCreditChallengedContent />} />
        <Route path="content/reverse" element={<AdminReverseContent />} />
        <Route path="content/aboutus" element={<AdminAboutUsContent />} />
        <Route path="content/leadership" element={<AdminLeadershipContent />} />
        <Route path="content/goodhuman" element={<AdminGoodHumanContent />} />
        <Route path="content/reviews" element={<AdminReviewsContent />} />
        <Route path="content/careermeetpurpose" element={<AdminCareermeetpurposeContent />} />
        <Route path="content/trustedpartner" element={<AdminTrustedPartnerContent />} />
        <Route path="content/amp" element={<AdminAMPContent />} />
        <Route path="content/mortgagepayment" element={<AdminMortgagePaymentContent />} />
        <Route path="content/homebuyer" element={<AdminHomeBuyerContent />} />
        <Route path="content/mortgagetermdefined" element={<AdminMortgageTermDefinedContent />} />
        <Route path="content/findofficer" element={<AdminFindOfficerContent />} />
        <Route path="content/applynow" element={<AdminApplyNowContent />} />
        <Route path="content/conventional-loan" element={<AdminConventionalLoanContent />} />
        <Route path="content/fha-loan" element={<AdminFHALoanContent />} />
        <Route path="content/home-select" element={<AdminHomeSelectContent />} />
        <Route path="content/portfolio-lending" element={<AdminPortfolioLendingContent />} />
        <Route path="content/fha-approved-condos" element={<AdminFHAApprovedCondosContent />} />
        <Route path="content/fha-no-credit" element={<AdminFHANoCreditScoreContent />} />
        <Route path="content/usda-renovation" element={<AdminUSDARenovationContent />} />
        <Route path="content/physician-loan" element={<AdminPhysicianLoanContent />} />
        <Route path="content/heloc" element={<AdminHELOCContent />} />
        <Route path="content/usdaloan" element={<AdminUSDALoanContent />} />
        <Route path="content/arrive-home" element={<AdminArriveHomeContent />} />
        <Route path="content/fixed-adjustable" element={<AdminFixedAdjustableContent />} />
        <Route path="content/self-employed" element={<AdminSelfEmployedContent />} />
        <Route path="content/firsttimehomebuyers" element={<AdminFirstTimeHomeBuyersContent />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}

export default App;
