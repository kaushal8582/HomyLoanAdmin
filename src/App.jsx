import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminBlogs from "./pages/AdminBlogs";
import AdminHomepage from "./pages/AdminHomepage";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import AdminPress from "./pages/AdminPress";
import AdminSurveys from "./pages/AdminSurveys";
import AdminPurchaseContent from "./pages/AdminPurchaseContent";
import AdminRefinanceContent from "./pages/AdminRefinanceContent";
import AdminVALoanContent from "./pages/AdminVALoanContent";
import AdminJumboContent from "./pages/AdminJumboContent";
import AdminRenovationContent from "./pages/AdminRenovationContent";
import AdminDPAContent from "./pages/AdminDPAContent";
import AdminUSDAContent from "./pages/AdminUSDAContent";
import AdminCreditChallengedContent from "./pages/AdminCreditChallengedContent";
import AdminReverseContent from "./pages/AdminReverseContent";
import { getStoredToken } from "./services/adminApi";

function ProtectedRoute({ children }) {
  const token = getStoredToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
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
        <Route path="press" element={<AdminPress />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="surveys" element={<AdminSurveys />} />
        <Route path="homepage" element={<AdminHomepage />} />
        <Route path="content/purchase" element={<AdminPurchaseContent />} />
        <Route path="content/refinance" element={<AdminRefinanceContent />} />
        <Route path="content/va-loan" element={<AdminVALoanContent />} />
        <Route path="content/jumbo-loans" element={<AdminJumboContent />} />
        <Route path="content/renovation-loans" element={<AdminRenovationContent />} />
        <Route path="content/downpayment" element={<AdminDPAContent />} />
        <Route path="content/usda" element={<AdminUSDAContent />} />
        <Route path="content/credit-challenged" element={<AdminCreditChallengedContent />} />
        <Route path="content/reverse" element={<AdminReverseContent />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
