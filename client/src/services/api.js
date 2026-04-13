import API from '../api/axiosInstance';

const api = {
  ...API,
  // Maintain backward compatibility for existing imports
  interceptors: API.interceptors,
};

export default api;

