import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mb-8">This is your SkillShare dashboard.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6 bg-gray-50 flex flex-col items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Account Status</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${user?.isEmailVerified ? 'bg-green-500' : 'bg-yellow-400'}`}></span>
                  <span className="text-sm">Email Verified: {user?.isEmailVerified ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center">
                  <span className={`w-3 h-3 rounded-full mr-2 ${user?.isNeighborhoodVerified ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  <span className="text-sm">Neighborhood Verified: {user?.isNeighborhoodVerified ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
            
            {!user?.isNeighborhoodVerified && (
              <Link to="/profile" className="text-indigo-600 text-sm font-medium hover:underline">
                Verify Neighborhood &rarr;
              </Link>
            )}
          </div>
          
          <div className="border rounded-lg p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Actions</h3>
            <ul className="space-y-3 mt-4">
              <li>
                <Link to="/profile" className="text-indigo-600 hover:underline flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Update Profile & Address
                </Link>
              </li>
              {/* Additional actions for other modules would go here */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
