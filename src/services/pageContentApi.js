import axios from "axios";
import { authHeaders } from "./adminApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const getHomePageContent = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/page-content/home`);
  return data;
};

export const updateHomePageContent = async (content) => {
  const { data } = await axios.put(
    `${API_BASE_URL}/api/page-content/home`,
    content,
    { headers: authHeaders() }
  );
  return data.content;
};

export const getPageContent = async (page) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/page-content/${page}`);
  return data;
};

export const updatePageContent = async (page, content) => {
  const { data } = await axios.put(
    `${API_BASE_URL}/api/page-content/${page}`,
    content,
    { headers: authHeaders() }
  );
  return data.content;
};
