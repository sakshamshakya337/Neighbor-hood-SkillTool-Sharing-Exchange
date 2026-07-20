import api from './axios';

export const createBooking = async (bookingData) => {
  const { data } = await api.post('/api/booking', bookingData);
  return data;
};

export const getBookings = async () => {
  const { data } = await api.get('/api/booking');
  return data;
};

export const getBookingById = async (id) => {
  const { data } = await api.get(`/api/booking/${id}`);
  return data;
};

export const updateBooking = async (id, bookingData) => {
  const { data } = await api.put(`/api/booking/${id}`, bookingData);
  return data;
};

export const deleteBooking = async (id) => {
  const { data } = await api.delete(`/api/booking/${id}`);
  return data;
};

export const cancelBooking = async (bookingId) => {
  const { data } = await api.post('/api/cancel-booking', { bookingId });
  return data;
};

export const getAvailability = async (toolId) => {
  const { data } = await api.get(`/api/availability?toolId=${toolId}`);
  return data;
};

export const processDeposit = async (paymentData) => {
  const { data } = await api.post('/api/deposit', paymentData);
  return data;
};

export const getRentalHistory = async () => {
  const { data } = await api.get('/api/rental-history');
  return data;
};

export const sendReminderEmail = async (id) => {
  const { data } = await api.post(`/api/${id}/remind`);
  return data;
};

export const markNotReturned = async (id) => {
  const { data } = await api.post(`/api/${id}/not-returned`);
  return data;
};

export const reportRenter = async (id) => {
  const { data } = await api.post(`/api/${id}/report`);
  return data;
};

export const payLateFees = async (id) => {
  const { data } = await api.post(`/api/${id}/pay-late-fee`);
  return data;
};
