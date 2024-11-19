import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL } );

// Attach JWT token to requests if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth Endpoints
export const register = (formData) => API.post('/auth/register', formData);
export const login = (formData) => API.post('/auth/login', formData);

// Job Endpoints
export const fetchJobs = () => API.get('/jobs');
export const createJob = (jobData) => API.post('/jobs', jobData);
export const applyForJob = (jobId, coverLetter) => API.post(`/jobs/${jobId}/apply`, { coverLetter });
