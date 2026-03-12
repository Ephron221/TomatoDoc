import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  MessageSquarePlus, 
  Camera, 
  Users, 
  CreditCard, 
  History, 
  ChevronRight, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    subscription: 'Free Trial',
    daysRemaining: 12,
    imagesUsedToday: 4,
    recentChats: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sessionsRes] = await Promise.all([
          api.get('/chat/sessions')
        ]);
        setStats(prev => ({
          ...prev,
          recentChats: sessionsRes.data.slice(0, 3)
        }));
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: t('dashboard.new_chat'),
      icon: <MessageSquarePlus className="w-8 h-8" />,
      link: '/dashboard/chat/new',
      color: 'bg-blue-500',
      description: 'Start a new conversation with AI'
    },
    {
      title: t('dashboard.detect'),
      icon: <Camera className="w-8 h-8" />,
      link: '/dashboard/chat/new', // Usually opens the chat with detection mode
      color: 'bg-secondary',
      description: 'Scan or upload tomato leaf'
    },
    {
      title: t('dashboard.experts'),
      icon: <Users className="w-8 h-8" />,
      link: '/dashboard/experts',
      color: 'bg-green-500',
      description: 'Connect with agriculture experts'
    },
    {
      title: t('dashboard.upgrade'),
      icon: <CreditCard className="w-8 h-8" />,
      link: '/pricing',
      color: 'bg-purple-500',
      description: 'View premium subscription plans'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {t('dashboard.welcome', { name: user?.full_name.split(' ')[0] })}
          </h1>
          <p className="text-gray-500 mt-1">Here is what's happening with your farm today.</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-secondary">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('dashboard.status')}</p>
            <div className="flex items-center">
              <span className="font-bold text-gray-900">{stats.subscription}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-secondary font-medium">{stats.daysRemaining} days left</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Warning for Free Trial */}
      {stats.subscription === 'Free Trial' && stats.imagesUsedToday >= 7 && (
        <div className="mb-8 bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-amber-800 font-bold text-sm">Daily Limit Approaching</h4>
            <p className="text-amber-700 text-xs mt-1">
              You've used {stats.imagesUsedToday}/10 images today. Upgrade to a paid plan for unlimited detections.
            </p>
          </div>
          <Link to="/pricing" className="ml-auto text-amber-800 font-bold text-xs underline">Upgrade Now</Link>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Link to={card.link} className="block card h-full border-b-4 hover:border-b-secondary transition-all">
              <div className={`w-14 h-14 ${card.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{card.description}</p>
              <div className="mt-4 flex items-center text-secondary font-bold text-sm">
                Go to {card.title} <ChevronRight className="ml-1 w-4 h-4" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Chats */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <History className="w-6 h-6 mr-2 text-gray-400" />
              Recent Conversations
            </h2>
            <Link to="/dashboard/chats" className="text-secondary font-bold text-sm hover:underline">View All</Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl"></div>)}
              </div>
            ) : stats.recentChats.length > 0 ? (
              stats.recentChats.map((chat) => (
                <Link 
                  key={chat.id} 
                  to={`/dashboard/chat/${chat.id}`}
                  className="block bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-secondary transition">
                        <MessageSquarePlus className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{chat.title}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(chat.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-secondary" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center">
                <p className="text-gray-500">No chat history yet. Start your first diagnosis!</p>
                <Link to="/dashboard/chat/new" className="btn-primary inline-flex mt-4 py-2">Start Chat</Link>
              </div>
            )}
          </div>
        </div>

        {/* Tips / Weather Card */}
        <div className="space-y-6">
          <div className="card bg-secondary text-white">
            <h3 className="text-xl font-bold mb-4">Farmer Tip of the Day</h3>
            <p className="text-red-50 text-sm leading-relaxed mb-6">
              "Mulching your tomato plants helps retain moisture and prevents soil-borne diseases from splashing onto leaves during heavy rain."
            </p>
            <button className="bg-white text-secondary px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider">Learn More</button>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <p className="text-gray-500 text-sm mb-4">Need help with the app or your plants?</p>
            <a href="https://wa.me/250780000000" className="flex items-center justify-center bg-green-500 text-white p-3 rounded-xl font-bold hover:bg-green-600 transition">
               Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
