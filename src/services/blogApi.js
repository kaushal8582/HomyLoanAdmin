import axios from "axios";
import { authHeaders } from "./adminApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const BLOG_API_URL = `${API_BASE_URL}/api/blogs`;

const transformBlog = (blog) => ({
  id: blog._id,
  title: blog.title,
  image: blog.image,
  description: blog.description,
  tag: Array.isArray(blog.tag) ? blog.tag : blog.tag || [],
  createdAt: blog.createdAt,
  updatedAt: blog.updatedAt,
});

export const getAllBlogs = async () => {
  const { data } = await axios.get(BLOG_API_URL);
  return data.map(transformBlog);
};

export const getBlogById = async (id) => {
  const { data } = await axios.get(`${BLOG_API_URL}/${id}`);
  return transformBlog(data);
};

export const createBlog = async (payload) => {
  const { data } = await axios.post(BLOG_API_URL, payload, {
    headers: authHeaders(),
  });
  return transformBlog(data.blog);
};

export const updateBlog = async (id, payload) => {
  const { data } = await axios.put(`${BLOG_API_URL}/${id}`, payload, {
    headers: authHeaders(),
  });
  return transformBlog(data.blog);
};

export const deleteBlog = async (id) => {
  await axios.delete(`${BLOG_API_URL}/${id}`, { headers: authHeaders() });
};
