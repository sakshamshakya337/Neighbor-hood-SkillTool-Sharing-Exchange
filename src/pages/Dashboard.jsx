import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, User, Wrench, BookOpen, Clock, Activity, ArrowRight, Mail } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto mt-6 px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black font-headline text-on-surface mb-2">Welcome, {user?.name || 'Neighbor'}!</h1>
          <p className="text-on-surface-variant text-lg">Here is your NeighborShare dashboard.</p>
        </div>
        <Link to="/profile" className="mt-4 md:mt-0 flex items-center gap-2 text-primary font-bold hover:underline">
          <User className="w-5 h-5" />
          Manage Profile
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
              <ShieldCheck className="text-primary w-6 h-6" /> Account Status
            </h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                <span className="text-sm font-medium text-on-surface flex items-center gap-2">
                  <Mail className="w-4 h-4 text-on-surface-variant" /> Email Verified
                </span>
                {user?.isEmailVerified ? (
                  <span className="bg-tertiary-container text-on-tertiary-container text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Yes
                  </span>
                ) : (
                  <span className="bg-error-container text-on-error-container text-xs font-bold px-3 py-1 rounded-full">
                    No
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                <span className="text-sm font-medium text-on-surface flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-on-surface-variant" /> Address Verified
                </span>
                {user?.isNeighborhoodVerified ? (
                  <span className="bg-tertiary-container text-on-tertiary-container text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Yes
                  </span>
                ) : (
                  <span className="bg-error-container text-on-error-container text-xs font-bold px-3 py-1 rounded-full">
                    No
                  </span>
                )}
              </div>
            </div>
            
            {!user?.isNeighborhoodVerified && (
              <Link to="/profile" className="flex items-center justify-center gap-2 w-full bg-primary text-on-primary font-bold py-3 rounded-xl hover:brightness-110 transition-all active:scale-95">
                Verify Neighborhood <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface mb-4 flex items-center gap-3">
              <Activity className="text-primary w-6 h-6" /> Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors font-medium text-on-surface">
                <Wrench className="w-5 h-5 text-primary" /> List a Tool
              </button>
              <button className="w-full flex items-center gap-3 p-4 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors font-medium text-on-surface">
                <BookOpen className="w-5 h-5 text-primary" /> Offer a Skill
              </button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-sm h-full">
            <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
              <Clock className="text-primary w-6 h-6" /> Recent Activity
            </h3>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                <Activity className="w-10 h-10 text-on-surface-variant opacity-50" />
              </div>
              <p className="text-on-surface-variant font-medium">No recent activity found.</p>
              <p className="text-sm text-on-surface-variant mt-2 max-w-sm">When you borrow tools or attend skill workshops, they will appear here.</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
