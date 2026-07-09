import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      setSuccess('Registration successful! Please check your email to verify your account.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-surface-container-lowest p-10 rounded-3xl shadow-2xl border border-outline-variant/30">
        <div className="text-center">
          <h2 className="mt-2 text-4xl font-black font-headline text-primary tracking-tight">
            Create an Account
          </h2>
          <p className="mt-4 text-sm text-on-surface-variant">
            Join the neighborhood and start sharing
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 ml-1">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-on-surface mb-1.5 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-on-primary bg-primary hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
