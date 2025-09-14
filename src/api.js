import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Add a response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page on 401 error
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Project APIs
export const getProjects = () => api.get('/projects');
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Product Backlog APIs
export const getProductBacklogs = (projectId) => api.get(`/projects/${projectId}/productBacklog`);
export const createProductBacklog = (projectId, data) => api.post(`/projects/${projectId}/productBacklog`, data);
export const updateProductBacklog = (projectId, productBacklogId, data) => api.put(`/projects/${projectId}/productBacklog/${productBacklogId}`, data);
export const deleteProductBacklog = (projectId, productBacklogId) => api.delete(`/projects/${projectId}/productBacklog/${productBacklogId}`);

// Sprint APIs
export const getSprints = (projectId) => api.get(`/projects/${projectId}/sprints`);
export const createSprint = (projectId, data) => api.post(`/projects/${projectId}/sprints`, data);
export const updateSprint = (projectId, sprintId, data) => api.put(`/projects/${projectId}/sprints/${sprintId}`, data);
export const deleteSprint = (projectId, sprintId) => api.delete(`/projects/${projectId}/sprints/${sprintId}`);

// Task APIs
export const getTasks = (projectId) => api.get(`/tasks/${projectId}`);
export const createTask = (projectId, data) => api.post(`/tasks/${projectId}`, data);
export const getTaskById = (taskId) => api.get(`/tasks/task/${taskId}`);
export const updateTask = (taskId, data) => api.put(`/tasks/task/${taskId}`, data);
export const deleteTask = (taskId) => api.delete(`/tasks/task/${taskId}`);
export const updateTaskStatus = (taskId, status) => api.patch(`/tasks/task/${taskId}/status`, { status });
export const getTasksByUser = (userId) => api.get(`/tasks/user/${userId}`);

export default api;
