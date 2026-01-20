import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const vocabularyAPI = {
  getProgress: () => api.get('/vocabulary/progress'),
  getWeeklyWords: (week?: number) => api.get('/vocabulary/weekly', { params: { week } }),
  getDailyWord: (type: 'verb' | 'noun') => api.get(`/vocabulary/daily/${type}`),
  addWord: (data: any) => api.post('/vocabulary/add', data)
};

export const testAPI = {
  getWeeklyTest: () => api.get('/tests/weekly'),
  submitWeeklyTest: (data: any) => api.post('/tests/weekly/submit', data),
  submitRecapTest: (data: any) => api.post('/tests/recap/submit', data)
};

export const lessonAPI = {
  getCurrentLesson: () => api.get('/lessons/current'),
  getRecapTest: (lessonNumber: number) => api.get(`/lessons/recap/${lessonNumber}`),
  completeLesson: (lessonNumber: number) => api.post('/lessons/complete', { lessonNumber }),
  getAllLessons: () => api.get('/lessons/all')
};

export const storyAPI = {
  generateStory: (topic: string) => api.post('/stories/generate', { topic }),
  getStories: (limit?: number) => api.get('/stories', { params: { limit } }),
  getStory: (id: number) => api.get(`/stories/${id}`)
};

export default api;
