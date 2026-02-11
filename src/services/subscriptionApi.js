import axios from "axios";
import { authHeaders } from "./adminApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const getAllSubscriptions = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/subscription`, {
    headers: authHeaders(),
  });
  return data;
};
