import axios from "axios";
import { authHeaders } from "./adminApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * Get all surveys (paginated)
 */
export const getAllSurveys = async (page = 1, limit = 50, includeDeleted = false) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/survey`, {
    params: { page, limit, includeDeleted },
    headers: authHeaders(),
  });
  return data;
};

/**
 * Get survey by ID
 */
export const getSurveyById = async (id, includeDeleted = false) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/survey/${id}`, {
    params: { includeDeleted },
    headers: authHeaders(),
  });
  return data;
};

/**
 * Search surveys by email
 */
export const getSurveysByEmail = async (email, includeDeleted = false) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/survey/email/search`, {
    params: { email, includeDeleted },
    headers: authHeaders(),
  });
  return data;
};

/**
 * Update survey
 */
export const updateSurvey = async (id, surveyData) => {
  const { data } = await axios.put(`${API_BASE_URL}/api/survey/${id}`, surveyData, {
    headers: authHeaders(),
  });
  return data;
};

/**
 * Delete survey (soft delete)
 */
export const deleteSurvey = async (id) => {
  const { data } = await axios.delete(`${API_BASE_URL}/api/survey/${id}`, {
    headers: authHeaders(),
  });
  return data;
};

/**
 * Restore soft-deleted survey
 */
export const restoreSurvey = async (id) => {
  const { data } = await axios.patch(`${API_BASE_URL}/api/survey/${id}/restore`, {}, {
    headers: authHeaders(),
  });
  return data;
};
