// frontend/job-ui/src/api/jobApi.js

import axiosInstance from '../utils/axiosInstance';

/**
 * Job Search API Service
 * Handles all job-related API calls with proper error handling
 */

// Get autocomplete job title suggestions
export const fetchSuggestions = async (query) => {
  if (!query?.trim()) return [];

  try {
    const { data } = await axiosInstance.get('/jobs/search/suggestions', {
      params: { query: query.trim() },
    });
    return data || [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

// Fetch jobs with optional filters
export const fetchJobs = async (filters = {}) => {
  try {
    const params = {
      search: filters.title,
      location: filters.location,
      category: filters.category,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };

    const { data } = await axiosInstance.get('/jobs', { params });
    return {
      jobs: data.jobs || [],
      total: data.total || 0,
      page: data.page || 1,
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { jobs: [], total: 0, page: 1 };
  }
};

// Fetch featured jobs (new addition)
export const fetchFeaturedJobs = async () => {
  try {
    const { data } = await axiosInstance.get('/jobs/featured');
    return data || [];
  } catch (error) {
    console.error('Error fetching featured jobs:', error);
    return [];
  }
};

// Bookmark operations
export const bookmarkService = {
  // Get all bookmarked jobs
  fetchAll: async () => {
    try {
      const { data } = await axiosInstance.get('/bookmarks');
      return data || [];
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      return [];
    }
  },

  // Add job to bookmarks
  add: async (jobId) => {
    try {
      const { data } = await axiosInstance.post('/bookmarks', { jobId });
      return data;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  },

  // Remove job from bookmarks
  remove: async (jobId) => {
    try {
      await axiosInstance.delete(`/bookmarks/${jobId}`);
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  },
  
  // Check if job is bookmarked (new addition)
  check: async (jobId) => {
    try {
      const { data } = await axiosInstance.get(`/bookmarks/check/${jobId}`);
      return data?.isBookmarked || false;
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      return false;
    }
  }
};

// Additional job-related API calls can be added below
// // src/api/jobApi.js
// import axios from "axios";
// const API = "https://backend-sgy8.onrender.com/api"; 

// // Get autocomplete title suggestions
// export const fetchSuggestions = async (query) => {
//   if (!query) return []; 

//   try {
//     const response = await axios.get(`${API}/jobs/suggestions`, {
//       params: { query },
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching suggestions:", error);
//     return [];
//   }
// };

// // Fetch jobs based on filters (title, location, category)
// export const fetchJobs = async ({ title, location, category }) => {
//   try {
//     const response = await axios.get(`${API}/jobs`, {
//       params: { search: title, category },
//       withCredentials: true,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     return [];
//   }
// };


// // Fetch user's bookmarked jobs
// export const fetchBookmarks = async () => {
//   try {
//     const token = localStorage.getItem("token"); // or retrieve from your auth context
//     const res = await axios.get(`${API}/bookmarks`, {
//       withCredentials: true,
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return res.data;
//   } catch (err) {
//     console.error("Error fetching bookmarks:", err);
//     return [];
//   }
// };

// // Add bookmark
// export const addBookmark = async (jobId) => {
//   try {
//     const token = localStorage.getItem("token"); //new changes
//     const res = await axios.post(
//       `${API}/bookmarks`,
//       { jobId },
//       {
//         withCredentials: true,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return res.data;
//   } catch (err) {
//     console.error("Error adding bookmark:", err);
//     throw err;
//   }
// };

// // Remove bookmark
// export const removeBookmark = async (jobId) => {
//   try {
//     await axios.delete(`${API}/bookmarks/${jobId}`, { withCredentials: true });
//   } catch (err) {
//     console.error("Error removing bookmark:", err);
//     throw err;
//   }
// };