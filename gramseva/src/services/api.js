import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gramseva-backend-8idx.onrender.com/api',
});

// Add user-id to headers if present
api.interceptors.request.use(config => {
  const userId = localStorage.getItem('userId');
  if (userId) config.headers['user-id'] = userId;
  return config;
});

export const businessAPI = {
  getAllBusinesses: async (params = {}) => (await api.get('/business', { params })).data,
  getBusinessById: async (id) => (await api.get(`/business/${id}`)).data,
  createBusiness: async (data) => (await api.post('/business', data)).data,
  updateBusiness: async (id, data) => (await api.put(`/business/${id}`, data)).data,
  deleteBusiness: async (id) => (await api.delete(`/business/${id}`)).data,
};

export const investmentAPI = {
  getUserInvestments: async () => (await api.get('/investments/my')).data,
  getBusinessInvestments: async (businessId) => (await api.get(`/investments/business/${businessId}`)).data,
  createInvestment: async (data) => (await api.post('/investments', data)).data,
  verifyInvestment: async (investmentId, paymentData) => (await api.post(`/investments/${investmentId}/verify`, paymentData)).data,
  getInvestmentById: async (id) => (await api.get(`/investments/${id}`)).data,
};

export const performanceAPI = {
  getBusinessPerformance: async (businessId) => (await api.get(`/performance/business/${businessId}`)).data,
  submitPerformance: async (data) => (await api.post('/performance', data)).data,
  updatePerformance: async (id, data) => (await api.put(`/performance/${id}`, data)).data,
  approvePerformance: async (id) => (await api.put(`/performance/${id}/approve`)).data,
};

export const distributionAPI = {
  getUserDistributions: async () => (await api.get('/distributions/my')).data,
  getBusinessDistributions: async (businessId) => (await api.get(`/distributions/business/${businessId}`)).data,
  approveDistribution: async (id) => (await api.put(`/distributions/${id}/approve`)).data,
  markAsPaid: async (id) => (await api.put(`/distributions/${id}/paid`)).data,
};

export default api;
