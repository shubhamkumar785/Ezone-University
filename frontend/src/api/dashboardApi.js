import axios from 'axios';

const dashboardClient = axios.create({
  baseURL: 'http://localhost:8082',
  headers: {
    'Content-Type': 'application/json',
  },
});

dashboardClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const dashboardApi = {
  getOverview: async () => {
    const response = await dashboardClient.get('/api/dashboard/overview');
    return response.data;
  },
  getEnrollmentTrend: async () => {
    const response = await dashboardClient.get('/api/dashboard/enrollment-trend');
    return response.data;
  },
  getAttendanceTrend: async () => {
    const response = await dashboardClient.get('/api/dashboard/attendance-trend');
    return response.data;
  },
  getDepartmentDistribution: async () => {
    const response = await dashboardClient.get('/api/dashboard/department-distribution');
    return response.data;
  },
  getFeeReport: async () => {
    const response = await dashboardClient.get('/api/dashboard/fee-report');
    return response.data;
  },
  getRecentActivities: async (page = 0, size = 10) => {
    const response = await dashboardClient.get(`/api/dashboard/recent-activities?page=${page}&size=${size}`);
    return response.data;
  },
  getPendingLeaves: async (page = 0, size = 10) => {
    const response = await dashboardClient.get(`/api/dashboard/pending-leaves?page=${page}&size=${size}`);
    return response.data;
  },
  getSystemAlerts: async (page = 0, size = 10) => {
    const response = await dashboardClient.get(`/api/dashboard/system-alerts?page=${page}&size=${size}`);
    return response.data;
  }
};
