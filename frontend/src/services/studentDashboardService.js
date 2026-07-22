import { studentDashboardApi } from '../api/studentDashboardApi';
import { apiCache } from '../utils/cache';

export const studentDashboardService = {
  getStudentProfile: async () => {
    try {
      const cacheKey = 'student_profile';
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;

      const profile = await studentDashboardApi.getProfile();
      apiCache.set(cacheKey, profile, 600000); // Cache for 10 minutes
      return profile;
    } catch (error) {
      console.error('Error fetching student profile:', error);
      throw error;
    }
  },
  
  getStudentDashboard: async () => {
    try {
      const cacheKey = 'student_dashboard';
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;

      const dashboard = await studentDashboardApi.getDashboard();
      apiCache.set(cacheKey, dashboard, 300000); // Cache for 5 minutes
      return dashboard;
    } catch (error) {
      console.error('Error fetching student dashboard:', error);
      throw error;
    }
  },

  getActiveTerm: async () => {
    try {
      const cacheKey = 'active_term';
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;

      const activeTerm = await studentDashboardApi.getActiveTerm();
      apiCache.set(cacheKey, activeTerm, 3600000); // Cache for 1 hour
      return activeTerm;
    } catch (error) {
      console.error('Error fetching active term:', error);
      throw error;
    }
  },

  getAllTerms: async () => {
    try {
      const cacheKey = 'all_terms';
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;

      const terms = await studentDashboardApi.getAllTerms();
      apiCache.set(cacheKey, terms, 3600000); // Cache for 1 hour
      return terms;
    } catch (error) {
      console.error('Error fetching all terms:', error);
      throw error;
    }
  },

  getCAMarks: async (termCode) => {
    try {
      const cacheKey = `ca_marks_${termCode}`;
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;

      const caMarks = await studentDashboardApi.getCAMarks(termCode);
      apiCache.set(cacheKey, caMarks, 300000); // Cache for 5 minutes
      return caMarks;
    } catch (error) {
      console.error('Error fetching CA marks:', error);
      throw error;
    }
  },

  getAttendance: async (termCode) => {
    try {
      const cacheKey = `attendance_${termCode}`;
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;

      const attendance = await studentDashboardApi.getAttendance(termCode);
      apiCache.set(cacheKey, attendance, 300000); // Cache for 5 minutes
      return attendance;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },

  exportAttendance: async (termCode) => {
    try {
      // Don't cache export requests
      const attendance = await studentDashboardApi.exportAttendance(termCode);
      return attendance;
    } catch (error) {
      console.error('Error exporting attendance:', error);
      throw error;
    }
  },

  /**
   * Fetch day-wise attendance grid.
   * Short cache (30s) prevents duplicate rapid calls on mount / month switches.
   * Attendance data is always considered live — no long-term caching.
   */
  getDayWiseAttendance: async (termCode, month, year) => {
    try {
      const cacheKey = `day_wise_${termCode}_${month}_${year}`;
      const cached = apiCache.get(cacheKey);
      if (cached) return cached;

      const data = await studentDashboardApi.getDayWiseAttendance(termCode, month, year);
      apiCache.set(cacheKey, data, 30000); // Cache for 30 seconds only
      return data;
    } catch (error) {
      console.error('Error fetching day-wise attendance:', error);
      throw error;
    }
  },

  clearCache: () => {
    apiCache.clear();
  }
};

