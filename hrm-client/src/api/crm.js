/**
 * CRM API Helper
 * All CRM-related API calls go through here — centralised, clean, reusable.
 */
import api from './client.js';

// ──────────────────────────────────────────────────────────────────
// CUSTOMERS
// ──────────────────────────────────────────────────────────────────
export const crmApi = {
  // List all customers
  getCustomers: () => api.get('/crm/customers').then(r => r.data),

  // Get single customer with full details
  getCustomer: (id) => api.get(`/crm/customers/${id}`).then(r => r.data),

  // Create new customer
  createCustomer: (data) => api.post('/crm/customers', data).then(r => r.data),

  // Update customer
  updateCustomer: (id, data) => api.put(`/crm/customers/${id}`, data).then(r => r.data),

  // Delete customer
  deleteCustomer: (id) => api.delete(`/crm/customers/${id}`).then(r => r.data),

  // Update health/metrics
  updateHealth: (id, data) => api.put(`/crm/customers/${id}/health`, data).then(r => r.data),

  // Assign a package to a customer
  assignPackage: (customerId, data) =>
    api.post(`/crm/customers/${customerId}/packages`, data).then(r => r.data),

  // Update assigned package
  updateAssignedPackage: (id, data) => api.put(`/crm/customer-packages/${id}`, data).then(r => r.data),

  // Delete assigned package
  deleteAssignedPackage: (id) => api.delete(`/crm/customer-packages/${id}`).then(r => r.data),

  // Pause package
  pausePackage: (id) => api.put(`/crm/customer-packages/${id}/pause`).then(r => r.data),

  // Resume package
  resumePackage: (id, days_paused) => api.put(`/crm/customer-packages/${id}/resume`, { days_paused }).then(r => r.data),

  // Get Kitchen Dashboard data
  getKitchenDashboard: () => api.get('/crm/kitchen-dashboard').then(r => r.data),

  // Deduct daily meals
  deductDailyMeals: () => api.post('/crm/kitchen-dashboard/deduct-meals').then(r => r.data),

  // ──────────────────────────────────────────────────────────────
  // GALLERY PHOTOS
  // ──────────────────────────────────────────────────────────────

  // Upload photo from local file
  uploadPhoto: (customerId, file, type) => {
    const form = new FormData();
    form.append('photo', file);
    form.append('type', type);
    return api.post(`/crm/customers/${customerId}/gallery`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },

  // Add photo by URL
  addPhotoByUrl: (customerId, url, type) =>
    api.post(`/crm/customers/${customerId}/gallery`, { url, type }).then(r => r.data),

  // Delete a photo
  deletePhoto: (photoId) => api.delete(`/crm/gallery/${photoId}`).then(r => r.data),

  // ──────────────────────────────────────────────────────────────
  // INQUIRIES / LEADS
  // ──────────────────────────────────────────────────────────────

  getInquiries: (unlinkedOnly = false) => api.get(`/crm/inquiries${unlinkedOnly ? '?unlinked=true' : ''}`).then(r => r.data),

  getCustomerInquiries: (customerId) => api.get(`/crm/customers/${customerId}/inquiries`).then(r => r.data),

  linkInquiryToCustomer: (inquiryId, customerId) => api.put(`/crm/inquiries/${inquiryId}/link-customer`, { customer_id: customerId }).then(r => r.data),

  getInquiryMessages: (id) => api.get(`/crm/inquiries/${id}/messages`).then(r => r.data),

  postInquiryMessage: (id, data) => api.post(`/crm/inquiries/${id}/messages`, data).then(r => r.data),

  createInquiry: (data) => api.post('/crm/inquiries', data).then(r => r.data),

  updateInquiry: (id, data) => api.put(`/crm/inquiries/${id}`, data).then(r => r.data),

  deleteInquiry: (id) => api.delete(`/crm/inquiries/${id}`).then(r => r.data),

  generateOnboardingLink: (id) => api.post(`/crm/inquiries/${id}/generate-link`).then(r => r.data),

  // ──────────────────────────────────────────────────────────────
  // PACKAGES (available plans)
  // ──────────────────────────────────────────────────────────────

  getPackages: () => api.get('/crm/packages').then(r => r.data),

  createPackage: (data) => api.post('/crm/packages', data).then(r => r.data),

  updatePackage: (id, data) => api.put(`/crm/packages/${id}`, data).then(r => r.data),

  deletePackage: (id) => api.delete(`/crm/packages/${id}`).then(r => r.data),

  // ──────────────────────────────────────────────────────────────
  // DASHBOARD STATS
  // ──────────────────────────────────────────────────────────────

  getDashboard: () => api.get('/crm/dashboard').then(r => r.data),

  // ──────────────────────────────────────────────────────────────
  // LEVEL SETTINGS
  // ──────────────────────────────────────────────────────────────

  getLevelSettings: () => api.get('/crm/level-settings').then(r => r.data),

  saveLevelSetting: (data) => api.post('/crm/level-settings', data).then(r => r.data),

  deleteLevelSetting: (id) => api.delete(`/crm/level-settings/${id}`).then(r => r.data),
};
