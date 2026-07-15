import api from './axios';

export const createTool = async (toolData) => {
  const { data } = await api.post('/api/tool', toolData);
  return data;
};

export const getTools = async () => {
  const { data } = await api.get('/api/tool');
  return data;
};

export const getToolById = async (id) => {
  const { data } = await api.get(`/api/tool/${id}`);
  return data;
};

export const updateTool = async (id, toolData) => {
  const { data } = await api.put(`/api/tool/${id}`, toolData);
  return data;
};

export const deleteTool = async (id) => {
  const { data } = await api.delete(`/api/tool/${id}`);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get('/api/categories');
  return data;
};

export const searchTools = async (query, category) => {
  let url = '/api/search?';
  if (query) url += `q=${query}&`;
  if (category) url += `category=${category}`;
  const { data } = await api.get(url);
  return data;
};
