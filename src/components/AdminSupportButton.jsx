import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AdminSupportButton() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // If user is admin or not logged in, don't show the button
  if (!user || user.role === 'admin') {
    return null;
  }

  const handleSupportClick = async () => {
    setLoading(true);
    try {
      // 1. Fetch Admin User
      const adminRes = await api.get('/api/users/admin');
      const adminId = adminRes.data._id;

      // 2. Start Chat
      const chatRes = await api.post('/api/chat', { userId: adminId });
      
      // 3. Navigate to chat with selected chat
      navigate('/chat', { state: { chatId: chatRes.data._id } });
    } catch (error) {
      console.error('Failed to start support chat:', error);
      alert('Failed to connect to support. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleSupportClick}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:transform-none"
        title="Contact Admin Support"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="font-bold hidden sm:inline pr-2">Support</span>
          </>
        )}
      </button>
    </div>
  );
}
