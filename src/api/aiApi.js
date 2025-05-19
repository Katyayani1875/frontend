import axios from "axios";

const API_URL = "http://localhost:8000/api/ai"; // Replace with your backend's base URL if needed

/**
 * Analyze resume content
 * @param {Object} data - Resume data
 * @returns {Promise} Axios response promise
 */
export const analyzeResume = (data) => axios.post(`${API_URL}/analyze-resume`, data, getAuthHeaders());

/**
 * Recommend jobs based on skills
 * @param {Object} data - Skills or other relevant input
 * @returns {Promise} Axios response promise
 */
export const recommendJobs = (data) => axios.post(`${API_URL}/recommend-jobs`, data, getAuthHeaders());

/**
 * Generate a cover letter
 * @param {Object} data - Resume content and job details
 * @returns {Promise} Axios response promise
 */
export const generateCoverLetter = (data) => axios.post(`${API_URL}/generate-cover-letter`, data, getAuthHeaders());

/**
 * Create a smart job post
 * @param {Object} data - Job description input
 * @returns {Promise} Axios response promise
 */
export const smartJobPost = (data) => axios.post(`${API_URL}/smart-job-post`, data, getAuthHeaders());

/**
 * Chat assistant for user queries
 * @param {Object} data - User query
 * @returns {Promise} Axios response promise
 */
export const chatAssistant = (data) => axios.post(`${API_URL}/chat`, data, getAuthHeaders());

/**
 * Get authentication headers with Bearer token
 * @returns {Object} Headers with Authorization token
 */
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  // Log the token to debug potential issues
  // console.log("Stored Token:", token);

  if (!token) {
    // Alert user and redirect to login if token is missing
    alert("You are not authenticated. Redirecting to login.");
    window.location.href = "/login";
    return {};
  }

  const headers = { Authorization: `Bearer ${token}` };
  console.log("Authorization Headers:", headers);

  return { headers };
}
