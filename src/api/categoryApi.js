// frontend/job-ui/src/api/categoryApi.js
import axiosInstance from '../utils/axiosInstance';

const CategoryService = {
  /**
   * Create a new category
   * @param {Object} categoryData - { name: String, slug: String }
   * @returns {Promise<Object>} - Created category data
   */
  create: async (categoryData) => {
    try {
      const { data } = await axiosInstance.post('/categories', categoryData);
      return data;
    } catch (error) {
      console.error('[CategoryService] Error creating category:', error);
      throw error;
    }
  },

  /**
   * Fetch all categories
   * @returns {Promise<Array>} - Array of categories
   */
  fetchAll: async () => {
    try {
      const { data } = await axiosInstance.get('/categories');
      return data; // Backend returns array directly for getAllCategories
    } catch (error) {
      console.error('[CategoryService] Error fetching all categories:', error);
      return []; // Return empty array on error
    }
  },
};

export default CategoryService;