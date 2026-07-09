import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { User, Mail, MapPin, Building2, Map, Navigation, ShieldCheck, ShieldAlert, CheckCircle2, AlertCircle, Save } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto mt-6 px-4 py-8 space-y-8">
      
      <div>
        <h1 className="text-4xl font-black font-headline text-on-surface mb-2">Profile Settings</h1>
        <p className="text-on-surface-variant text-lg">Manage your personal information and neighborhood verification.</p>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${msg.type === 'success' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-error-container text-on-error-container'}`}>
          {msg.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="font-medium">{msg.text}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Personal Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
              <User className="text-primary w-5 h-5" /> Personal Info
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5 ml-1">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-on-surface-variant" />
                  </div>
                  <input 
                    type="text" 
                    className="block w-full pl-11 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5 ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-on-surface-variant" />
                  </div>
                  <input 
                    type="email" 
                    disabled
                    className="block w-full pl-11 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-on-surface-variant cursor-not-allowed text-sm opacity-70"
                    value={user?.email || ''}
                  />
                </div>
              </div>
              <button type="submit" className="w-full flex justify-center items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl hover:brightness-110 transition-all font-bold active:scale-95 text-sm">
                <Save className="w-4 h-4" /> Save Profile
              </button>
            </form>
          </div>
        </div>

        {/* Address and Verification */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 md:p-8 rounded-3xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                <MapPin className="text-primary w-5 h-5" /> Address Details
              </h2>
              <div className={`px-4 py-1.5 text-xs font-bold rounded-full flex items-center gap-2 ${user?.isNeighborhoodVerified ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-error-container text-on-error-container'}`}>
                {user?.isNeighborhoodVerified ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                {user?.isNeighborhoodVerified ? 'Neighborhood Verified' : 'Unverified'}
              </div>
            </div>
            
            <form onSubmit={handleAddressSubmit} className="space-y-5 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-on-surface mb-1.5 ml-1">Street Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-on-surface-variant" />
                    </div>
                    <input 
                      type="text" 
                      className="block w-full pl-11 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
                      value={addressData.street || ''}
                      onChange={(e) => setAddressData({...addressData, street: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5 ml-1">City</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-4 w-4 text-on-surface-variant" />
                    </div>
                    <input 
                      type="text" 
                      className="block w-full pl-11 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
                      value={addressData.city || ''}
                      onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5 ml-1">State</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Map className="h-4 w-4 text-on-surface-variant" />
                    </div>
                    <input 
                      type="text" 
                      className="block w-full pl-11 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
                      value={addressData.state || ''}
                      onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                    />
                  </div>
                </div>
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-on-surface mb-1.5 ml-1">Pincode</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Navigation className="h-4 w-4 text-on-surface-variant" />
                    </div>
                    <input 
                      type="text" 
                      className="block w-full pl-11 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-sm"
                      value={addressData.pincode || ''}
                      onChange={(e) => setAddressData({...addressData, pincode: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 bg-surface-variant text-on-surface-variant hover:bg-surface-dim hover:text-on-surface px-6 py-2.5 rounded-xl transition-all font-bold active:scale-95 text-sm">
                  <Save className="w-4 h-4" /> Save Address
                </button>
              </div>
            </form>

            <div className="pt-8 border-t border-outline-variant/30">
              <h3 className="text-lg font-bold text-on-surface mb-2">Neighborhood Verification</h3>
              <p className="text-sm text-on-surface-variant mb-6 max-w-lg">
                Verify your neighborhood using your pincode to unlock tool borrowing and skill sharing within your local area.
              </p>
              <button 
                onClick={verifyNeighborhood}
                disabled={loading || user?.isNeighborhoodVerified || !addressData.pincode}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold w-full sm:w-auto transition-all ${
                  user?.isNeighborhoodVerified 
                    ? 'bg-tertiary-container text-on-tertiary-container cursor-not-allowed opacity-70' 
                    : !addressData.pincode 
                      ? 'bg-surface-container-low text-on-surface-variant cursor-not-allowed' 
                      : 'bg-primary text-on-primary hover:brightness-110 active:scale-95'
                }`}
              >
                {loading ? 'Verifying...' : user?.isNeighborhoodVerified ? (
                  <><ShieldCheck className="w-5 h-5" /> Already Verified</>
                ) : (
                  <><ShieldAlert className="w-5 h-5" /> Verify Now</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
