import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Bell, 
  Check, 
  Trash2, 
  Loader2, 
  Search, 
  Filter,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: number;
  target: 'admin' | 'user';
  user_id?: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/admin/notifications');
      setNotifications(res.data);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.post(`/admin/notifications/mark-read/${id}`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      toast.error('Failed to update notification');
    }
  };

  const deleteNotification = async (id: number) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      // Assuming a delete endpoint exists
      // await api.delete(`/admin/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success('Notification removed');
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'read') return n.is_read;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">System Notifications</h1>
          <p className="text-gray-500 mt-1">Monitor system alerts, payments, and user activity.</p>
        </div>
        
        <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                filter === f ? 'bg-secondary text-white' : 'text-gray-500 hover:text-secondary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => (
            <div 
              key={notif.id}
              className={`bg-white p-6 rounded-2xl border transition-all ${
                !notif.is_read ? 'border-secondary/20 bg-red-50/10' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${
                    notif.title.includes('Payment') ? 'bg-amber-100 text-amber-600' :
                    notif.title.includes('Registration') ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {notif.title.includes('Payment') ? <AlertCircle className="w-5 h-5" /> : 
                     notif.title.includes('Registration') ? <Info className="w-5 h-5" /> : 
                     <Bell className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${!notif.is_read ? 'text-gray-900' : 'text-gray-500'}`}>
                      {notif.title}
                    </h3>
                    <p className="text-gray-600 mt-1 text-sm leading-relaxed">{notif.message}</p>
                    <div className="flex items-center mt-3 space-x-4">
                      <span className="flex items-center text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                      </span>
                      {!notif.is_read && (
                        <span className="flex items-center text-[10px] font-bold text-secondary uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-1.5"></span>
                          New Alert
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!notif.is_read && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition"
                      title="Mark as read"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
             <Bell className="w-8 h-8" />
          </div>
          <p className="text-gray-500 font-medium">No notifications found.</p>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
