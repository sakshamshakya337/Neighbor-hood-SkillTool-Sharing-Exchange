import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSuccess('If an account with that email exists, we have sent a password reset link.');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
      <p className="text-sm text-gray-600 mb-4 text-center">Enter your email and we'll send you a link to reset your password.</p>
      
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{success}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition font-medium">
          Send Reset Link
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/login" className="text-sm text-indigo-600 hover:underline">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
