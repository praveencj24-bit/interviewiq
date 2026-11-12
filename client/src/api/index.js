import { request } from './client.js';

export const registerUser = (data) => request('/auth/register', { method: 'POST', body: data });
export const loginUser = (data) => request('/auth/login', { method: 'POST', body: data });
export const getMe = () => request('/auth/me');

export const getHistory = () => request('/history');

export const analyzeResume = (form) => request('/analyses', { method: 'POST', body: form });
export const getAnalysis = (id) => request(`/analyses/${id}`);

export const startInterview = (form) => request('/interviews', { method: 'POST', body: form });
export const getInterview = (id) => request(`/interviews/${id}`);
export const sendAnswer = (id, questionIndex, answer) =>
  request(`/interviews/${id}/answers`, { method: 'POST', body: { questionIndex, answer } });
