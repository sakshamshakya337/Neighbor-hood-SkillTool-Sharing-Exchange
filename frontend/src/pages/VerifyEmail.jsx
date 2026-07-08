import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying');
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const attempt = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (attempt.current) return;
      attempt.current = true;
      
      if (!token) {
        setStatus('error');
        setError('No verification token found in URL.');
        return;
      }

      try {
        await api.post('/api/auth/verify-email', { token });
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(err.response?.data?.message || 'Verification failed. The link may have expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 border border-gray-200 rounded-lg shadow-sm text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Email Verification</h2>
      
      {status === 'verifying' && (
        <div className="text-indigo-600 animate-pulse">Verifying your email... please wait.</div>
      )}
      
      {status === 'success' && (
        <div>
          <div className="bg-green-50 text-green-600 p-4 rounded mb-6 font-medium">
            Your email has been verified successfully!
          </div>
          <Link to="/login" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition">
            Continue to Login
          </Link>
        </div>
      )}
      
      {status === 'error' && (
        <div>
          <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
            {error}
          </div>
          <Link to="/register" className="text-indigo-600 hover:underline">
            Back to Registration
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
