import api from './axios';

export const createPaymentOrder = async (paymentData) => {
  const { data } = await api.post('/api/payment', paymentData);
  return data;
};

export const verifyPaymentStatus = async (verificationData) => {
  const { data } = await api.post('/api/verify', verificationData);
  return data;
};
