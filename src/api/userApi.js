import api from './axios';

export const getUserListings = async () => {
  const { data } = await api.get('/api/users/listings');
  return data;
};
