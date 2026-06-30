import { apiClient } from '../../../services/apiClient';

export const cvApi = {
  async saveCVData(payload) {
    return await apiClient.put('/cv/save', payload);
  },
  async getCVConfig() {
    return await apiClient.get('/cv/active');
  }
};