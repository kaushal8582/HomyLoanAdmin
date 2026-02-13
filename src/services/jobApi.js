import axios from "axios";
import { authHeaders } from "./adminApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const JOB_API_URL = `${API_BASE_URL}/api/jobs`;

const transformJob = (job) => ({
  id: job._id,
  title: job.title,
  description: job.description,
  location: job.location,
  type: job.type,
  department: job.department,
  image: job.image,
  tag: Array.isArray(job.tag) ? job.tag : job.tag || [],
  applicationLink: job.applicationLink,
  createdAt: job.createdAt,
  updatedAt: job.updatedAt,
});

export const getAllJobs = async () => {
  const { data } = await axios.get(JOB_API_URL);
  return data.map(transformJob);
};

export const getJobById = async (id) => {
  const { data } = await axios.get(`${JOB_API_URL}/${id}`);
  return transformJob(data);
};

export const createJob = async (payload) => {
  const { data } = await axios.post(JOB_API_URL, payload, {
    headers: authHeaders(),
  });
  return transformJob(data.job);
};

export const updateJob = async (id, payload) => {
  const { data } = await axios.put(`${JOB_API_URL}/${id}`, payload, {
    headers: authHeaders(),
  });
  return transformJob(data.job);
};

export const deleteJob = async (id) => {
  await axios.delete(`${JOB_API_URL}/${id}`, { headers: authHeaders() });
};
