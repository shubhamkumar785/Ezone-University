import { dashboardApi } from './api/dashboardApi';
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

export const teacherService = {
  getAll: async () => {
    const response = await dashboardClient.get('/api/admin/teachers');
    return response.data;
  },

  getById: async (id) => {
    // Currently AdminTeacherController does not have getById, so we fetch all and find
    const response = await dashboardClient.get('/api/admin/teachers');
    return response.data.find(t => t.id === id) || null;
  },

  getNextId: async () => {
    const response = await dashboardClient.get('/api/admin/teachers/next-id');
    return response.data.nextId;
  },

  add: async (teacher) => {
    const response = await dashboardClient.post('/api/admin/teachers', teacher);
    return response.data;
  },

  update: async (id, updatedTeacher) => {
    const response = await dashboardClient.put(`/api/admin/teachers/${id}`, updatedTeacher);
    return response.data;
  },

  deactivate: async (id) => {
    const response = await dashboardClient.put(`/api/admin/teachers/${id}/deactivate`);
    return response.data;
  }
};
