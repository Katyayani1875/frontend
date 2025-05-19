// src/api/jobApi.js
import axios from "axios";
const API = "https://backend-sgy8.onrender.com/api"; // Adjust this to your backend API URL

// 🔍 Get autocomplete title suggestions
export const fetchSuggestions = async (query) => {
  if (!query) return []; // avoid unnecessary calls

  try {
    const response = await axios.get(`${API}/jobs/suggestions`, {
      params: { query },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

// 📄 Fetch jobs based on filters (title, location, category)
export const fetchJobs = async ({ title, location, category }) => {
  try {
    const response = await axios.get(`${API}/jobs`, {
      params: { search: title, category },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};


// new changes
// ✅ Fetch user's bookmarked jobs
export const fetchBookmarks = async () => {
  try {
    const token = localStorage.getItem("token"); // or retrieve from your auth context
    const res = await axios.get(`${API}/bookmarks`, {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    return [];
  }
};

// ✅ Add bookmark
export const addBookmark = async (jobId) => {
  try {
    const token = localStorage.getItem("token"); //new changes
    const res = await axios.post(
      `${API}/bookmarks`,
      { jobId },
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error adding bookmark:", err);
    throw err;
  }
};

// ✅ Remove bookmark
export const removeBookmark = async (jobId) => {
  try {
    await axios.delete(`${API}/bookmarks/${jobId}`, { withCredentials: true });
  } catch (err) {
    console.error("Error removing bookmark:", err);
    throw err;
  }
};