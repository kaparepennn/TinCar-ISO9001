import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL
});

// Añade token automáticamente
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

export const login = async (username, password) => {
  const res = await api.post('/auth/login', { username, password });
  return res.data;
};

export const register = async (username, password, role) => {
  const res = await api.post('/auth/register', { username, password, role });
  return res.data;
};

export const fetchDocuments = () => api.get('/documents').then(res => res.data);
export const uploadDocument = (formData) => api.post('/documents/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
export const addLinkDocument = (data) => api.post('/documents/link', data);

export const fetchAuditChecklist = () => api.get('/audit').then(res => res.data);
export const submitAuditChecklist = (data) => api.post('/audit/submit', data);

export const fetchTrainingEvents = () => api.get('/training').then(res => res.data);
export const saveTrainingEvent = (data) => api.post('/training', data);
export const deleteTrainingEvent = (id) => api.delete(`/training/${id}`);

export const fetchUsers = () => api.get('/users').then(res => res.data);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const fetchCompanies = () => api.get('/companies').then(res => res.data);
export const createCompany = (data) => api.post('/companies', data);
export const updateCompany = (id, data) => api.put(`/companies/${id}`, data);
export const deleteCompany = (id) => api.delete(`/companies/${id}`);

export default {
  login, register, fetchDocuments, uploadDocument, addLinkDocument,
  fetchAuditChecklist, submitAuditChecklist,
  fetchTrainingEvents, saveTrainingEvent, deleteTrainingEvent,
  fetchUsers, createUser, updateUser, deleteUser,
  fetchCompanies, createCompany, updateCompany, deleteCompany
};