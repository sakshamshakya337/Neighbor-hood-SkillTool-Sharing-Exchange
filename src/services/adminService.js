import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

export const getDashboard = async () => {
  return await API.get("/admin/dashboard");
};

export const getUsers = async () => {
  return await API.get("/admin/users");
};

export const getTools = async () => {
  return await API.get("/admin/tools");
};

export const blockUser = async (userId) => {
  return await API.put("/admin/block-user", { userId });
};

export const deleteUser = async (userId) => {
  return await API.delete("/admin/delete-user", {
    data: { userId },
  });
};