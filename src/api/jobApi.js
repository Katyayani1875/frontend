// frontend/job-ui/src/api/jobApi.js
import axiosInstance from '../utils/axiosInstance';

/**
 * Job API Service
 * Centralized service for all job-related API calls
 * Includes proper error handling and consistent response formats
 */

const JobService = {
  // =====================
  // Job Search & Listing
  // =====================
  
  /**
   * Fetch jobs with filters
   * @param {Object} filters - Search filters {title, category, location, page, limit}
   * @returns {Promise<{jobs: Array, total: Number, page: Number}>}
   */
    fetchJobs: async (filters = {}) => {
    try {
      const params = {
        // FIX IS HERE: Change filters.title to filters.search
        search: filters.search, // <-- CORRECTED THIS LINE!
        category: filters.category,
        location: filters.location,
        page: filters.page || 1,
        limit: filters.limit || 10,
        sort: filters.sort,
      };
      const { data } = await axiosInstance.get('/jobs', { params });
      
      return {
        jobs: data.jobs || [],
        total: data.total || 0,
        page: data.page || 1,
        totalPages: data.totalPages || 1,
      };
    } catch (error) {
      console.error('[JobService] Error fetching jobs:', error);
      throw error; // Let the calling component handle the error
    }
  },

  /**
   * Get job title suggestions for autocomplete
   * @param {String} query - Search query
   * @returns {Promise<Array>} - Array of suggestions
   */
  fetchSuggestions: async (query) => {
    if (!query?.trim()) return [];
    
    try {
      const { data } = await axiosInstance.get('/jobs/search/suggestions', {
        params: { query: query.trim() },
      });
      return data?.suggestions || [];
    } catch (error) {
      console.error('[JobService] Error fetching suggestions:', error);
      return [];
    }
  },

  /**
   * Fetch featured jobs
   * @returns {Promise<Array>} - Array of featured jobs
   */
  fetchFeatured: async () => {
    try {
      const { data } = await axiosInstance.get('/jobs/featured');
      return data?.jobs || [];
    } catch (error) {
      console.error('[JobService] Error fetching featured jobs:', error);
      return [];
    }
  },

  /**
   * Get job details by ID
   * @param {String} jobId - Job ID
   * @returns {Promise<Object>} - Job details
   */
  fetchJobDetails: async (jobId) => {
    try {
      const { data } = await axiosInstance.get(`/jobs/${jobId}`);
      return data;
    } catch (error) {
      console.error('[JobService] Error fetching job details:', error);
      throw error;
    }
  },
  
  fetchByCategory: async (slug, options = {}) => {
    try {
      const params = {
        page: options.page || 1,
        limit: options.limit || 10
      };
      
      const { data } = await axiosInstance.get(`/jobs/category/${slug}`, { params });
      
      return {
        category: data.category, // This will be the category name (e.g., "IT Development")
        jobs: data.jobs || [],
        total: data.total || 0,
        page: data.page || 1,
        totalPages: data.totalPages || 1,
      };
    } catch (error) {
      console.error('[JobService] Error fetching jobs by category:', error);
      throw error;
    }
  },

  // =====================
  // Bookmark Operations
  // =====================
  
 bookmarks: {
    fetchAll: async () => {
      try {
        const { data } = await axiosInstance.get('/bookmarks');
        
        // --- THIS IS THE FIX ---
        // The backend sends the array directly, so just return it.
        return data || []; 
        // --- END OF THE FIX ---

      } catch (error) {
        console.error('[JobService] Error fetching bookmarks:', error);
        return [];
      }
    },
    /**
     * Add job to bookmarks
     * @param {String} jobId - Job ID to bookmark
     * @returns {Promise<Object>} - Updated bookmark data
     */
    add: async (jobId) => {
      try {
        const { data } = await axiosInstance.post('/bookmarks', { jobId });
        return data;
      } catch (error) {
        console.error('[JobService] Error adding bookmark:', error);
        throw error;
      }
    },

    /**
     * Remove job from bookmarks
     * @param {String} jobId - Job ID to remove
     * @returns {Promise<void>}
     */
    remove: async (jobId) => {
      try {
        await axiosInstance.delete(`/bookmarks/${jobId}`);
      } catch (error) {
        console.error('[JobService] Error removing bookmark:', error);
        throw error;
      }
    },

    /**
     * Check if job is bookmarked
     * @param {String} jobId - Job ID to check
     * @returns {Promise<Boolean>} - Whether job is bookmarked
     */
    check: async (jobId) => {
      try {
        const { data } = await axiosInstance.get(`/bookmarks/check/${jobId}`);
        return data?.isBookmarked || false;
      } catch (error) {
        console.error('[JobService] Error checking bookmark status:', error);
        return false;
      }
    }
  },

  // =====================
  // Application Operations
  // =====================
  
applications: {
    /**
     * Apply to a job
     * @param {String} jobId - Job ID to apply to
     * @param {Object} applicationData - Application details
     */
    apply: async (jobId, applicationData) => {
      try {
        // --- START OF THE DEFINITIVE FIX ---
        // The URL must match the backend route: POST /api/applications/:jobId
        const { data } = await axiosInstance.post(`/applications/${jobId}`, applicationData);
        // --- END OF THE DEFINITIVE FIX ---
        return data;
      } catch (error) {
        console.error('[JobService] Error applying to job:', error);
        throw error;
      }
    },

    /**
     * Get user's applications
     */
    getMyApplications: async () => {
      try {
        const { data } = await axiosInstance.get('/applications');
        return data?.applications || [];
      } catch (error) {
        console.error('[JobService] Error fetching applications:', error);
        return [];
      }
    }
  }
};
export default JobService;
