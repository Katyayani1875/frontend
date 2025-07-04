// import axios from "axios";

// const API_URL = "https://backend-sgy8.onrender.com/api/ai"; // Replace with your backend's base URL if needed

// /**
//  * Analyze resume content
//  * @param {Object} data - Resume data
//  * @returns {Promise} Axios response promise
//  */
// export const analyzeUploadedResumeApi = (formData) => {
//   // When sending FormData with a file, axios automatically sets the correct
//   // 'Content-Type': 'multipart/form-data' header. We only need to add our auth header.
//   return axios.post(`${API_URL}/analyze-resume`, formData, getAuthHeaders());
// };


// /**
//  * Recommends jobs based on a list of skills.
//  * @param {Object} data - An object like { skills: "React, Node.js, ..." }
//  * @returns {Promise} Axios response promise
//  */
// export const recommendJobs = (data) => axios.post(`${API_URL}/recommend-jobs`, data, getAuthHeaders());

// /**
//  * Generates a cover letter based on resume text and job details.
//  * @param {Object} data - An object containing resume text, job title, company name, etc.
//  * @returns {Promise} Axios response promise
//  */
// export const generateCoverLetter = (data) => axios.post(`${API_URL}/generate-cover-letter`, data, getAuthHeaders());

// /**
//  * Creates a smart job post using AI based on initial input.
//  * @param {Object} data - Job description input
//  * @returns {Promise} Axios response promise
//  */
// export const smartJobPost = (data) => axios.post(`${API_URL}/smart-job-post`, data, getAuthHeaders());

// /**
//  * Sends a query to the general-purpose AI chat assistant.
//  * @param {Object} data - An object like { question: "User's query" }
//  * @returns {Promise} Axios response promise
//  */
// export const chatAssistant = (data) => axios.post(`${API_URL}/chat`, data, getAuthHeaders());

// // Note: The old `analyzeResume` function has been intentionally removed and replaced
// // by `analyzeUploadedResumeApi` to match the component's import and fix the build error.

// /**
//  * Get authentication headers with Bearer token
//  * @returns {Object} Headers with Authorization token
//  */
// function getAuthHeaders() {
//   const token = localStorage.getItem("token");

//   // Log the token to debug potential issues
//   // console.log("Stored Token:", token);

//   if (!token) {
//     // Alert user and redirect to login if token is missing
//     alert("You are not authenticated. Redirecting to login.");
//     window.location.href = "/login";
//     return {};
//   }

//   const headers = { Authorization: `Bearer ${token}` };
//   console.log("Authorization Headers:", headers);

//   return { headers };
// }
import axios from "axios";

const API_URL = "https://backend-sgy8.onrender.com/api/ai"; // Your backend's base URL

/**
 * Helper function to get authentication headers for API calls.
 * @returns {Object} A configuration object with the Authorization header.
 */
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Authentication token not found. API call will be unauthorized.");
    return {};
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

// --- THIS IS THE PRIMARY FUNCTION FOR THE NEW WORKFLOW ---
/**
 * Analyzes a resume by uploading the file directly to the backend.
 * @param {FormData} formData - The FormData object containing the resume file.
 * @returns {Promise} Axios response promise.
 */
export const analyzeUploadedResumeApi = (formData) => {
  return axios.post(`${API_URL}/analyze-resume`, formData, getAuthHeaders());
};


// --- THIS IS THE PLACEHOLDER FUNCTION TO FIX THE BUILD ERROR ---
/**
 * [DEPRECATED] Placeholder function to prevent build errors from legacy components.
 * The resume analysis workflow has been moved to a file-upload system.
 * Any component calling this function needs to be updated.
 * @param {Object} data - Legacy text-based data object.
 * @returns {Promise} A resolved promise with a warning message.
 */
export const analyzeResume = (data) => {
  console.warn(
    "The 'analyzeResume' function is deprecated and was called. " +
    "This feature should be updated to use the file-based 'analyzeUploadedResumeApi'. " +
    "Returning a mock response to prevent application crash."
  );
  // Return a resolved promise with a mock structure to prevent .then() from breaking.
  return Promise.resolve({
    data: {
      analysis: "This analysis feature has been updated. Please use the main 'Analyze Resume' page to re-analyze your resume by uploading the file."
    }
  });
};


// --- Other existing API functions ---

/**
 * Recommends jobs based on a list of skills.
 * @param {Object} data - An object like { skills: "React, Node.js, ..." }
 * @returns {Promise} Axios response promise
 */
export const recommendJobs = (data) => axios.post(`${API_URL}/recommend-jobs`, data, getAuthHeaders());

/**
 * Generates a cover letter based on resume text and job details.
 * @param {Object} data - An object containing resume text, job title, etc.
 * @returns {Promise} Axios response promise
 */
export const generateCoverLetter = (data) => axios.post(`${API_URL}/generate-cover-letter`, data, getAuthHeaders());

/**
 * Creates a smart job post using AI.
 * @param {Object} data - Job description input
 * @returns {Promise} Axios response promise
 */
export const smartJobPost = (data) => axios.post(`${API_URL}/smart-job-post`, data, getAuthHeaders());

/**
 * Sends a query to the AI chat assistant.
 * @param {Object} data - An object like { question: "User's query" }
 * @returns {Promise} Axios response promise
 */
export const chatAssistant = (data) => axios.post(`${API_URL}/chat`, data, getAuthHeaders());