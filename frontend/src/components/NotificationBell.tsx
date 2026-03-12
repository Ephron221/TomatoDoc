import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Notification } from '../types';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Polling every minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const endpoint = user?.role === 'admin' ? '/admin/notifications' : '/notifications/my-notifications';
      const res = await api.get(endpoint);
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const endpoint = user?.role === 'admin' 
        ? `/admin/notifications/mark-read/${id}` 
        : `/notifications/mark-read/${id}`;
      await api.post(endpoint);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read');
    }
  };

  const clearAll = async () => {
    // Optional: Implementation to clear all notifications
  };

  if (!isAuthenticated) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full transition relative text-gray-500 hover:text-secondary"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary text-[10px] text-white items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[100] overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button className="text-xs text-secondary font-bold hover:underline">Mark all read</button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 border-b border-gray-50 transition hover:bg-gray-50 flex items-start group ${!notif.is_read ? 'bg-red-50/30' : ''}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${!notif.is_read ? 'bg-secondary' : 'bg-transparent'}`}></div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-bold ${!notif.is_read ? 'text-gray-900' : 'text-gray-500'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">
                      {notif.message}
                    </p>
                    {!notif.is_read && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="text-[10px] font-bold text-secondary flex items-center hover:underline"
                      >
                        <Check className="w-3 h-3 mr-1" /> Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-gray-400 text-sm">No notifications yet.</p>
              </div>
            )}
          </div>

          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-center">
             <button className="text-xs font-bold text-gray-500 hover:text-secondary">View All Notifications</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
