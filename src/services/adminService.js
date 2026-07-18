import api from '../api/axios';

export const getDashboard = async () => {
  return await api.get("/api/admin/dashboard");
};

export const getUsers = async () => {
  return await api.get("/api/admin/users");
};

export const getTools = async () => {
  return await api.get("/api/admin/tools");
};

export const getAllBookings = async () => {
  return await api.get("/api/admin/bookings");
};

export const blockUser = async (userId) => {
  return await api.put("/api/admin/block-user", { userId });
};

export const deleteUser = async (userId) => {
  return await api.delete("/api/admin/delete-user", {
    data: { userId },
  });
};

export const createTool = async (toolData) => {
  return await api.post("/api/tool", toolData);
};

export const updateTool = async (toolId, toolData) => {
  return await api.put(`/api/tool/${toolId}`, toolData);
};

export const getCategories = async () => {
  return await api.get("/api/categories");
};

export const getSkills = async () => {
  return await api.get("/api/skill");
};

export const createSkill = async (skillData) => {
  return await api.post("/api/skill", skillData);
};

export const updateSkill = async (skillId, skillData) => {
  return await api.put(`/api/skill/${skillId}`, skillData);
};

export const getPayments = async () => {
  return await api.get("/api/payment-history");
};

export const getReports = async () => {
  return await api.get("/api/reports");
};

export const resolveReport = async (reportId) => {
  return await api.put("/api/report/resolve", { reportId });
};