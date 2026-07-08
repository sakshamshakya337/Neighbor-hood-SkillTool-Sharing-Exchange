import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold tracking-wider">
          SkillShare
        </Link>
        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-indigo-200 transition">Dashboard</Link>
              <Link to="/profile" className="hover:text-indigo-200 transition">Profile</Link>
              <button 
                onClick={handleLogout} 
                className="bg-indigo-700 hover:bg-indigo-800 px-4 py-2 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-200 transition">Login</Link>
              <Link to="/register" className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded transition font-medium">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
