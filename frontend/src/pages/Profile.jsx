import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
  const { user, updateProfileData } = useAuth();
  const [profileData, setProfileData] = useState({ name: '' });
  const [addressData, setAddressData] = useState({ street: '', city: '', state: '', pincode: '' });
  
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name });
      setAddressData(user.address || { street: '', city: '', state: '', pincode: '' });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const { data } = await api.put('/api/users/profile', profileData);
      updateProfileData(data);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMsg({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    try {
      const { data } = await api.put('/api/users/address', addressData);
      // Address update resets neighborhood verification in backend
      updateProfileData({ address: data, isNeighborhoodVerified: false });
      setMsg({ type: 'success', text: 'Address updated successfully! Neighborhood verification reset.' });
    } catch (error) {
      setMsg({ type: 'error', text: 'Failed to update address.' });
    }
  };

  const verifyNeighborhood = async () => {
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const { data } = await api.post('/api/auth/verify-neighborhood', { pincode: addressData.pincode });
      updateProfileData({ isNeighborhoodVerified: data.isNeighborhoodVerified });
      setMsg({ type: 'success', text: 'Neighborhood successfully verified!' });
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.message || 'Verification failed.' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">
      
      {msg.text && (
        <div className={`p-4 rounded-md ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg.text}
        </div>
      )}
      
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              type="text" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email (Cannot be changed directly)</label>
            <input 
              type="email" 
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2 border text-gray-500 cursor-not-allowed"
              value={user?.email || ''}
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm font-medium">
            Save Profile
          </button>
        </form>
      </div>

      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Address Details</h2>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user?.isNeighborhoodVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {user?.isNeighborhoodVerified ? 'Verified' : 'Unverified'}
          </span>
        </div>
        
        <form onSubmit={handleAddressSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Street</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                value={addressData.street || ''}
                onChange={(e) => setAddressData({...addressData, street: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                value={addressData.city || ''}
                onChange={(e) => setAddressData({...addressData, city: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                value={addressData.state || ''}
                onChange={(e) => setAddressData({...addressData, state: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pincode</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                value={addressData.pincode || ''}
                onChange={(e) => setAddressData({...addressData, pincode: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm font-medium">
            Save Address
          </button>
        </form>

        <div className="border-t pt-4">
          <h3 className="text-md font-semibold text-gray-800 mb-2">Neighborhood Verification</h3>
          <p className="text-sm text-gray-600 mb-4">
            Verify your neighborhood using your pincode. Your pincode must be valid and saved.
          </p>
          <button 
            onClick={verifyNeighborhood}
            disabled={loading || user?.isNeighborhoodVerified || !addressData.pincode}
            className={`px-4 py-2 rounded text-sm font-medium ${
              user?.isNeighborhoodVerified 
                ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                : !addressData.pincode 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition'
            }`}
          >
            {loading ? 'Verifying...' : user?.isNeighborhoodVerified ? 'Already Verified' : 'Verify Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
