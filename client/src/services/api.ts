import axios from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskmaster_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('taskmaster_token');
      localStorage.removeItem('taskmaster_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  signup: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

// Tasks API
export const tasksAPI = {
  getMyTasks: async () => {
    const response = await api.get('/tasks/me');
    return response.data;
  },
  
  getAllTasks: async () => {
    const response = await api.get('/tasks/all');
    return response.data;
  },
  
  createTask: async (taskData: { title: string; description: string; dueDate?: string; priority?: string }) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  updateTask: async (taskId: string, taskData: Partial<{ title: string; description: string; completed: boolean; dueDate?: string; priority?: string }>) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },
  
  deleteTask: async (taskId: string) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },
  
  toggleComplete: async (taskId: string) => {
    const response = await api.put(`/tasks/${taskId}/toggle`);
    return response.data;
  }
};