import axios from 'axios';

const studentDashboardClient = axios.create({
  baseURL: 'http://localhost:8082',
  headers: {
    'Content-Type': 'application/json',
  },
});

studentDashboardClient.interceptors.request.use(
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

export const studentDashboardApi = {
  getProfile: async () => {
    const response = await studentDashboardClient.get('/api/student/profile');
    return response.data;
  },
  getDashboard: async () => {
    const response = await studentDashboardClient.get('/api/student/dashboard');
    return response.data;
  },
  getActiveTerm: async () => {
    const response = await studentDashboardClient.get('/api/student/ca-marks/active-term');
    return response.data;
  },
  getAllTerms: async () => {
    const response = await studentDashboardClient.get('/api/student/ca-marks/terms');
    return response.data;
  },
  getCAMarks: async (termCode) => {
    const response = await studentDashboardClient.get(`/api/student/ca-marks/${termCode}`);
    return response.data;
  },
  getAttendance: async (termCode) => {
    const response = await studentDashboardClient.get(`/api/student/attendance/${termCode}`);
    return response.data;
  },
  exportAttendance: async (termCode) => {
    const response = await studentDashboardClient.get(`/api/student/attendance/${termCode}/export`);
    return response.data;
  },

  /**
   * Fetch day-wise attendance grid for the selected term and month.
   * Month-scoped: never loads semester-wide data.
   * @param {string} termCode - e.g. "2601"
   * @param {number} month    - 1–12
   * @param {number} year     - e.g. 2026
   */
  getDayWiseAttendance: async (termCode, month, year) => {
    const params = {};
    if (month) params.month = month;
    if (year)  params.year = year;
    const response = await studentDashboardClient.get(
      `/api/student/attendance/${termCode}/day-wise`,
      { params }
    );
    return response.data;
  }
};
