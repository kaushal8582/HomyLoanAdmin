import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminBlogs from "./pages/AdminBlogs";
import AdminHomepage from "./pages/AdminHomepage";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import AdminPress from "./pages/AdminPress";
import AdminSurveys from "./pages/AdminSurveys";
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
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
