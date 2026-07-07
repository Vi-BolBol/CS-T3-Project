const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.internshipengine.internal/v1';

export const apiClient = {
  async get(endpoint) {
    const config = { method: 'GET', headers: this.getHeaders() };
    return this.request(endpoint, config);
  },

  async post(endpoint, body) {
    const config = {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    };
    return this.request(endpoint, config);
  },

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
    };
  },

  async request(endpoint, config) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, config);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Transport Error Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[API Client Infrastructure Exception] URL: ${endpoint}:`, error);
      throw error;
    }
  }
};