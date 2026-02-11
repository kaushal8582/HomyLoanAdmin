import axios from "axios";
import { authHeaders } from "./adminApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const PRESS_URL = `${API_BASE_URL}/api/press`;

export const getAllPress = async () => {
  const { data } = await axios.get(PRESS_URL, { headers: authHeaders() });
  return Array.isArray(data) ? data : [];
};

export const getPressById = async (id) => {
  const { data } = await axios.get(`${PRESS_URL}/${id}`, { headers: authHeaders() });
  return data;
};

export const createPress = async (payload) => {
  const { data } = await axios.post(PRESS_URL, payload, { headers: authHeaders() });
  return data;
};

export const updatePress = async (id, payload) => {
  const { data } = await axios.put(`${PRESS_URL}/${id}`, payload, { headers: authHeaders() });
  return data;
};

export const deletePress = async (id) => {
  const { data } = await axios.delete(`${PRESS_URL}/${id}`, { headers: authHeaders() });
  return data;
};
