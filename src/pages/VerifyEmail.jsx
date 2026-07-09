import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface-container-lowest p-10 rounded-3xl shadow-2xl border border-outline-variant/30 text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        
        <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight">
          Email Verification
        </h2>
        
        {status === 'verifying' && (
          <div className="mt-8 space-y-6">
            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
            <p className="text-on-surface-variant font-medium animate-pulse">
              Verifying your email address, please wait...
            </p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="mt-8 space-y-8">
            <div className="bg-tertiary-container text-on-tertiary-container p-6 rounded-2xl flex flex-col items-center gap-3">
              <CheckCircle2 className="w-10 h-10" />
              <p className="font-bold text-lg">Your email has been verified successfully!</p>
            </div>
            <Link 
              to="/login" 
              className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-on-primary bg-primary hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98]"
            >
              Continue to Login
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
        
        {status === 'error' && (
          <div className="mt-8 space-y-8">
            <div className="bg-error-container text-on-error-container p-6 rounded-2xl flex flex-col items-center gap-3">
              <AlertCircle className="w-10 h-10" />
              <p className="font-bold text-lg">{error}</p>
            </div>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
            >
              Back to Registration
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
