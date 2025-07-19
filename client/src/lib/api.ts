import axios from "axios";

const API_BASE = "";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  // Market data endpoints
  getSensexData: () => apiClient.get('/api/market/sensex'),
  
  // Economic indicators
  getEconomicIndicators: () => apiClient.get('/api/economic-indicators'),
  
  // Monetary policy
  getMonetaryPolicy: () => apiClient.get('/api/monetary-policy'),
  
  // Global markets
  getGlobalMarkets: () => apiClient.get('/api/global-markets'),
  
  // Commodities
  getCommodities: () => apiClient.get('/api/commodities'),
  
  // Currency
  getCurrency: () => apiClient.get('/api/currency'),
  
  // Investment flows
  getFlows: () => apiClient.get('/api/flows'),
  
  // Technical analysis
  getTechnical: () => apiClient.get('/api/technical'),
  
  // News updates
  getNews: () => apiClient.get('/api/news'),
};

export default api;
