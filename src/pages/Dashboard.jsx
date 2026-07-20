import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, User, Wrench, BookOpen, Clock, Activity, ArrowRight, Mail, List, Package } from 'lucide-react';
import { getRentalHistory } from '../api/bookingApi';
import { getUserListings } from '../api/userApi';
import { deleteTool } from '../api/toolApi';
import { deleteSkill } from '../api/skillApi';

const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState({ rentedByMe: [], rentedToOthers: [] });
  const [listings, setListings] = useState({ tools: [], skills: [] });
  const [loading, setLoading] = useState(true);

  const handleDeleteTool = async (id) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        await deleteTool(id);
        setListings(prev => ({ ...prev, tools: prev.tools.filter(t => t._id !== id) }));
      } catch (error) {
        console.error('Failed to delete tool:', error);
        alert('Failed to delete tool');
      }
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(id);
        setListings(prev => ({ ...prev, skills: prev.skills.filter(s => s._id !== id) }));
      } catch (error) {
        console.error('Failed to delete skill:', error);
        alert('Failed to delete skill');
      }
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyData, listingsData] = await Promise.all([
          getRentalHistory(),
          getUserListings()
        ]);
        setHistory(historyData);
        setListings(listingsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  const recentActivity = [...history.rentedByMe, ...history.rentedToOthers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

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
              <Link to="/tools/add" className="w-full flex items-center justify-between p-4 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors font-medium text-on-surface">
                <span className="flex items-center gap-3">
                  <Wrench className="w-5 h-5 text-primary" /> List a Tool
                </span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant" />
              </Link>
              <Link to="/skills/add" className="w-full flex items-center justify-between p-4 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors font-medium text-on-surface">
                <span className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary" /> Offer a Skill
                </span>
                <ArrowRight className="w-4 h-4 text-on-surface-variant" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center justify-between">
              <span className="flex items-center gap-3">
                <Package className="text-primary w-6 h-6" /> My Listings
              </span>
            </h3>
            
            {loading ? (
              <div className="text-center py-10">Loading listings...</div>
            ) : listings.tools.length === 0 && listings.skills.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center bg-surface-container-low rounded-2xl">
                <p className="text-on-surface-variant font-medium">You haven't listed any items yet.</p>
                <div className="flex gap-4 mt-4">
                  <Link to="/tools/add" className="text-sm font-bold text-primary hover:underline">List a Tool</Link>
                  <Link to="/skills/add" className="text-sm font-bold text-primary hover:underline">Offer a Skill</Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.tools.map(tool => (
                  <div key={tool._id} className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center">
                        <Wrench className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">{tool.name}</h4>
                        <p className="text-xs text-on-surface-variant">Tool • {tool.category?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/tools/edit/${tool._id}`} className="px-4 py-2 text-sm font-medium border border-outline-variant rounded-lg hover:bg-surface-container-low">Edit</Link>
                      <button onClick={() => handleDeleteTool(tool._id)} className="px-4 py-2 text-sm font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                ))}
                {listings.skills.map(skill => (
                  <div key={skill._id} className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface">{skill.title}</h4>
                        <p className="text-xs text-on-surface-variant">Skill • {skill.category?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/skills/edit/${skill._id}`} className="px-4 py-2 text-sm font-medium border border-outline-variant rounded-lg hover:bg-surface-container-low">Edit</Link>
                      <button onClick={() => handleDeleteSkill(skill._id)} className="px-4 py-2 text-sm font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-3">
              <Clock className="text-primary w-6 h-6" /> Recent Activity
            </h3>
            
            {loading ? (
              <div className="text-center py-10">Loading activity...</div>
            ) : recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-on-surface-variant opacity-50" />
                </div>
                <p className="text-on-surface-variant font-medium">No recent activity found.</p>
                <p className="text-sm text-on-surface-variant mt-2 max-w-sm">When you borrow tools or attend skill workshops, they will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map(activity => (
                  <div key={activity._id} className="p-4 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-on-surface">
                        {activity.tool ? 'Tool Rental' : 'Skill Booking'}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        activity.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">
                      {activity.tool ? activity.tool.name : activity.skill?.title}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-2">
                      {new Date(activity.createdAt).toLocaleDateString()} • ₹{activity.totalPrice}
                    </p>
                  </div>
                ))}
                <Link to="/rental-history" className="block text-center w-full py-3 mt-4 text-sm font-bold text-primary border border-outline-variant rounded-xl hover:bg-surface-container-low transition-colors">
                  View Full History
                </Link>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
