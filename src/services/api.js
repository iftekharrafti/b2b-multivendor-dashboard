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

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  verify: () => api.get("/auth/verify"),
  refreshToken: () => api.post("/auth/refresh"),
  changePassword: (passwords) => api.put("/auth/change-password", passwords),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
}

// Stats API
export const statsAPI = {
  getDashboardStats: () => api.get("/stats/dashboard"),
  getAdminStats: () => api.get("/stats/admin"),
  getAnalytics: (period = "30d") => api.get(`/stats/analytics?period=${period}`),
}

// Products API
export const productsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/products${queryString ? `?${queryString}` : ""}`)
  },
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post("/products", productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  updateStatus: (id, status) => api.patch(`/products/${id}/status`, { status }),
  bulkUpload: (file) => {
    const formData = new FormData()
    formData.append("file", file)
    return api.post("/products/bulk-upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },
  getByCategory: (categoryId) => api.get(`/categories/products/category/${categoryId}`)
}

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/orders${queryString ? `?${queryString}` : ""}`)
  },
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  getOrderItems: (orderId) => api.get(`/orders/${orderId}/items`),
  getOrdersByVendor: () => api.get(`/orders/vendor-orders`),
}

// Categories API
export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post("/categories", categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
  getHierarchy: () => api.get("/categories/hierarchy"),
}

// Users API
export const usersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/users${queryString ? `?${queryString}` : ""}`)
  },
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  updateStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
  getProfile: () => api.get("/users/profile"),
  updateProfile: (profileData) => api.put("/users/profile", profileData),
}

// Vendors API
export const vendorsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/vendors${queryString ? `?${queryString}` : ""}`)
  },
  getById: (id) => api.get(`/vendors/${id}`),
  update: (id, vendorData) => api.put(`/vendors/${id}`, vendorData),
  updateStatus: (id, status) => api.patch(`/vendors/${id}/status`, { status }),
  getProfile: () => api.get("/vendors/profile"),
  updateProfile: (profileData) => api.put("/vendors/profile", profileData),
}

// Payments API
export const paymentsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/payments${queryString ? `?${queryString}` : ""}`)
  },
  getById: (id) => api.get(`/payments/${id}`),
  processPayment: (paymentData) => api.post("/payments/process", paymentData),
  getWallet: () => api.get("/payments/wallet"),
  withdraw: (amount) => api.post("/payments/withdraw", { amount }),
}

// Chat API
export const chatAPI = {
  getChats: () => api.get("/chat"),
  getChatById: (id) => api.get(`/chat/${id}`),
  getMessages: (chatId) => api.get(`/chat/${chatId}/messages`),
  sendMessage: (chatId, message) => api.post(`/chat/${chatId}/messages`, { message }),
  createChat: (participantId) => api.post("/chat", { participantId }),
}

// Reports API
export const reportsAPI = {
  getSalesReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/reports/sales${queryString ? `?${queryString}` : ""}`)
  },
  getInventoryReport: () => api.get("/reports/inventory"),
  getCustomerReport: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/reports/customers${queryString ? `?${queryString}` : ""}`)
  },
  exportReport: (type, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/reports/export/${type}${queryString ? `?${queryString}` : ""}`, {
      responseType: "blob",
    })
  },
}

// Admin API
export const adminAPI = {
  // Dashboard Stats
  getDashboardStats: () => api.get("/admin/dashboard-stats"),

  // User Management
  getUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/admin/users${queryString ? `?${queryString}` : ""}`)
  },
  createUser: (userData) => api.post("/admin/users", userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  verifyUser: (id, isVerified) => api.patch(`/admin/users/${id}/verify`, { isVerified }),
  updateUserStatus: (id, status) => api.patch(`/admin/users/${id}/status`, { status }),

  // Vendor Management
  getVendors: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return api.get(`/admin/vendors${queryString ? `?${queryString}` : ""}`)
  },
  getVendorById: (id) => api.get(`/admin/vendors/${id}`),
  updateVendor: (id, vendorData) => api.put(`/admin/vendors/${id}`, vendorData),
  deleteVendor: (id) => api.delete(`/admin/vendors/${id}`),
  approveVendor: (id, isApproved, rejectionReason = null) =>
    api.patch(`/admin/vendors/${id}/approval`, { isApproved, rejectionReason }),
  updateVendorStatus: (id, status) => api.patch(`/admin/vendors/${id}/status`, { status }),
  getVendorStats: (id, period = "30d") => api.get(`/admin/vendors/${id}/stats?period=${period}`),

  // System Settings
  getSystemSettings: () => api.get("/admin/settings"),
  updateSystemSettings: (settings) => api.put("/admin/settings", settings),
}

export default api
