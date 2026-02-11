import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const adminLogin = async (email, password) => {
  const { data } = await axios.post(`${API_BASE_URL}/api/admin/login`, {
    email,
    password,
  });
  return data;
};

export const adminLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
};

export const getStoredToken = () => localStorage.getItem("adminToken");
export const getStoredAdmin = () => {
  const s = localStorage.getItem("adminUser");
  return s ? JSON.parse(s) : null;
};

export const setStoredAuth = (token, admin) => {
  if (token) localStorage.setItem("adminToken", token);
  if (admin) localStorage.setItem("adminUser", JSON.stringify(admin));
};

export const authHeaders = () => {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
