import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import api from '../api/axios';
import { formatDistanceToNow } from 'date-fns';

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/api/notifications');
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleToggle = async () => {
    setIsOpen(!isOpen);
    // Mark as read when opening
    if (!isOpen) {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n._id);
      if (unreadIds.length > 0) {
        try {
          await api.put('/api/notifications/read', { notificationIds: unreadIds });
          // Update local state
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
          console.error("Failed to mark notifications as read", err);
        }
      }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-200 relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[16px] h-[16px] shadow-sm border-2 border-surface-container-low">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-outline-variant/30 z-50 overflow-hidden transform origin-top-right transition-all duration-200">
          <div className="p-5 border-b border-outline-variant/20 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
            <h3 className="font-black font-headline text-lg text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{unreadCount} New</span>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto overscroll-contain">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-on-surface-variant flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-outline-variant" />
                </div>
                <p className="text-sm font-medium">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notif, index) => (
                <div 
                  key={notif._id} 
                  className={`p-4 hover:bg-slate-50 transition-colors relative flex gap-4 ${!notif.isRead ? 'bg-primary/5' : ''} ${index !== notifications.length - 1 ? 'border-b border-outline-variant/10' : ''}`}
                >
                  {!notif.isRead && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  )}
                  
                  <div className="mt-1">
                    <div className={`w-2 h-2 rounded-full ${!notif.isRead ? 'bg-primary' : 'bg-transparent'}`}></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {notif.type}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-medium">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className={`text-sm ${!notif.isRead ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>
                      {notif.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
