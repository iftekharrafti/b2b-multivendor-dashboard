import axios from "axios"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("dashboard_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("dashboard_token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const rfqAPI = {
  // Get all RFQs with optional filters
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();

    // Add optional query parameters
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = `/rfq${queryString ? `?${queryString}` : ''}`;

    return api.get(url);
  },

  // Get single RFQ by ID
  getById: async (id) => {
    return api.get(`/rfq/${id}`);
  },

  // Create new RFQ
  create: async (data) => {
    return api.post('/rfq', data);
  },

  // Update RFQ
  update: async (id, data) => {
    return api.put(`/rfq/${id}`, data);
  },

  // Delete RFQ
  delete: async (id) => {
    return api.delete(`/rfq/${id}`);
  },

  // Update RFQ status
  updateStatus: async (id, data) => {
    return api.put(`/rfq/${id}/status`, data);
  },

  // Submit RFQ response (for vendors)
  submitResponse: async (id, data) => {
    return api.post(`/rfq/${id}/response`, data);
  },

  // Get RFQ statistics
  getStats: async () => {
    return api.get('/rfq/stats');
  }
};

export default rfqAPI;
