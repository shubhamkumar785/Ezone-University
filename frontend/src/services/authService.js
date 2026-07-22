import api from '../api/axios';

export const authService = {
  sendOtp: async (loginId) => {
    const response = await api.post('/api/auth/send-otp', { loginId });
    return response.data;
  },
  
  verifyOtp: async (loginId, otp, role) => {
    const response = await api.post('/api/auth/verify-otp', { loginId, otp, role });
    return response.data;
  }
};
