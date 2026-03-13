import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  getLiveData: () => apiClient.get('/live'),
  
  getHistory: (hours = 24, limit = 100) => 
    apiClient.get('/history', { params: { hours, limit } }),
  
  getStats: (hours = 24) => 
    apiClient.get('/stats', { params: { hours } }),
  
  getAlerts: (hours = 24, resolved = false) => 
    apiClient.get('/alerts', { params: { hours, resolved } }),
  
  resolveAlert: (alertId) => 
    apiClient.post(`/alerts/${alertId}/resolve`),
};