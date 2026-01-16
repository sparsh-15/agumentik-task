const isDevelopment = true; 

const API_CONFIG = {
  PRODUCTION: 'https://agumentik-task.onrender.com',
  LOCAL: 'http://localhost:5000',
};

export const getApiUrl = () => {
  return isDevelopment ? API_CONFIG.LOCAL : API_CONFIG.PRODUCTION;
};

export const getSocketUrl = () => {
  return getApiUrl();
};

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  PRODUCTS: '/get/products',
  PRODUCT: (id) => `/get/product/${id}`,
  CREATE_ORDER: '/create/order',
};

export const buildUrl = (endpoint) => {
  return `${getApiUrl()}${endpoint}`;
};
