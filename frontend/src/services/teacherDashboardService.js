import api from '../api/axios';

export const teacherDashboardService = {
  getTeacherProfile: async () => {
    try {
      const response = await api.get('/api/teacher/dashboard/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      throw error;
    }
  },

  getDashboardSummary: async () => {
    try {
      const response = await api.get('/api/teacher/dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }
};
