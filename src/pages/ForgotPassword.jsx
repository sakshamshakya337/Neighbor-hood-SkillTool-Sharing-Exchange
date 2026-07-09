import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSuccess('If an account with that email exists, we have sent a password reset link.');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface-container-lowest p-10 rounded-3xl shadow-2xl border border-outline-variant/30">
        <div className="text-center">
          <h2 className="mt-2 text-4xl font-black font-headline text-primary tracking-tight">
            Reset Password
          </h2>
          <p className="mt-4 text-sm text-on-surface-variant max-w-sm mx-auto">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-tertiary-container text-on-tertiary-container p-4 rounded-xl text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{success}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1.5 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-on-surface-variant" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-on-primary bg-primary hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
