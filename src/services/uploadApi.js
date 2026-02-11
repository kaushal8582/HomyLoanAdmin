import axios from "axios";
import { authHeaders } from "./adminApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post(
    `${API_BASE_URL}/api/upload/image`,
    formData,
    {
      headers: {
        ...authHeaders(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data.url;
};

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post(
    `${API_BASE_URL}/api/upload/video`,
    formData,
    {
      headers: {
        ...authHeaders(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data.url;
};
