import api from './axios';

export const createSkill = async (skillData) => {
  const { data } = await api.post('/api/skill', skillData);
  return data;
};

export const getSkills = async () => {
  const { data } = await api.get('/api/skill');
  return data;
};

export const getSkillById = async (id) => {
  const { data } = await api.get(`/api/skill/${id}`);
  return data;
};

export const updateSkill = async (id, skillData) => {
  const { data } = await api.put(`/api/skill/${id}`, skillData);
  return data;
};

export const deleteSkill = async (id) => {
  const { data } = await api.delete(`/api/skill/${id}`);
  return data;
};
