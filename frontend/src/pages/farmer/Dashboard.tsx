import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Clock,
  TrendingUp,
  Zap,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Info,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    subscription: 'Free Trial',
    daysRemaining: 15,
    imagesUsedToday: 0,
    totalDetections: 0,
    recentChats: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sessionsRes, subRes] = await Promise.all([
        api.get('/chat/sessions'),
        api.get('/subscriptions/my-subscription')
      ]);
      
      const subData = subRes.data;
      const expiryDate = new Date(subData.end_date);
      const today = new Date();
      const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setStats({
        subscription: subData.plan.charAt(0).toUpperCase() + subData.plan.slice(1),
        daysRemaining: diffDays,
        imagesUsedToday: subData.images_used_today || 0,
        totalDetections: sessionsRes.data.length,
        recentChats: sessionsRes.data.slice(0, 4)
      });
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      title: 'New Diagnosis',
      desc: 'Scan tomato leaves for diseases',
      icon: <Camera className="w-6 h-6" />,
      link: '/dashboard/chat/new',
      color: 'bg-secondary',
      shadow: 'shadow-red-100'
    },
    {
      title: 'Expert Chat',
      desc: 'Ask agronomists for advice',
      icon: <Users className="w-6 h-6" />,
      link: '/dashboard/experts',
      color: 'bg-blue-500',
      shadow: 'shadow-blue-100'
    },
    {
      title: 'History',
      desc: 'Review past reports & chats',
      icon: <History className="w-6 h-6" />,
      link: '/dashboard/chats',
      color: 'bg-amber-500',
      shadow: 'shadow-amber-100'
    },
    {
      title: 'Upgrade',
      desc: 'Extend your active plan',
      icon: <CreditCard className="w-6 h-6" />,
      link: '/dashboard/payment',
      color: 'bg-purple-500',
      shadow: 'shadow-purple-100'
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-gray-900 p-8 md:p-12 text-white shadow-2xl">
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="flex items-center space-x-3 mb-6"
               >
                 <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-secondary border border-white/10">
                   Farm Portal
                 </span>
                 <div className="h-1 w-1 bg-white/30 rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                   {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                 </span>
               </motion.div>
               <motion.h1 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="text-4xl md:text-5xl font-black tracking-tight mb-4"
               >
                 Welcome back, <span className="text-secondary">{user?.full_name.split(' ')[0]}!</span>
               </motion.h1>
               <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="text-gray-400 font-medium text-lg leading-relaxed"
               >
                 Your farm is currently in the <span className="text-white font-bold">Growing Phase</span>. 
                 Check your latest detections to ensure crop health.
               </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 md:w-80"
            >
               <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-secondary rounded-2xl shadow-lg shadow-red-900/20">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    stats.subscription === 'Trial' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {stats.subscription} Active
                  </span>
               </div>
               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                       <span>Time Remaining</span>
                       <span>{stats.daysRemaining} Days</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(stats.daysRemaining / 30) * 100}%` }}
                         className="h-full bg-secondary" 
                       />
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/dashboard/payment')}
                    className="w-full py-3 bg-white text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-white transition-all flex items-center justify-center"
                  >
                    Manage Plan <ArrowRight className="ml-2 w-3 h-3" />
                  </button>
               </div>
            </motion.div>
         </div>

         {/* Decorative Background Elements */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
      </div>

      {/* Stats Quick Look */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex items-center space-x-5">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-secondary">
               <Camera className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scans Today</p>
               <h4 className="text-2xl font-black text-gray-900">{stats.imagesUsedToday} <span className="text-xs text-gray-300">/ 10</span></h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex items-center space-x-5">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
               <TrendingUp className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Reports</p>
               <h4 className="text-2xl font-black text-gray-900">{stats.totalDetections}</h4>
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex items-center space-x-5">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Health Score</p>
               <h4 className="text-2xl font-black text-gray-900">92%</h4>
            </div>
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         
         {/* Left Side: Actions & History */}
         <div className="lg:col-span-2 space-y-10">
            <div>
               <h2 className="text-xl font-black text-gray-900 tracking-tight mb-6 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-secondary" /> Quick Actions
               </h2>
               <motion.div 
                 variants={container}
                 initial="hidden"
                 animate="show"
                 className="grid grid-cols-1 sm:grid-cols-2 gap-6"
               >
                  {actions.map((action, i) => (
                    <motion.div key={i} variants={item}>
                       <Link 
                         to={action.link} 
                         className="flex items-center p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:border-red-50 transition-all group"
                       >
                          <div className={`w-16 h-16 ${action.color} text-white rounded-[1.5rem] flex items-center justify-center shadow-lg ${action.shadow} group-hover:scale-110 transition-transform`}>
                             {action.icon}
                          </div>
                          <div className="ml-6 flex-grow">
                             <h4 className="font-black text-gray-900">{action.title}</h4>
                             <p className="text-xs text-gray-400 font-bold mt-1">{action.desc}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                       </Link>
                    </motion.div>
                  ))}
               </motion.div>
            </div>

            <div>
               <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
                     <History className="w-5 h-5 mr-2 text-gray-400" /> Recent History
                  </h2>
                  <Link to="/dashboard/chats" className="text-[10px] font-black text-secondary uppercase tracking-widest hover:underline">View All</Link>
               </div>

               <div className="grid grid-cols-1 gap-4">
                  {loading ? (
                    [1,2,3].map(n => <div key={n} className="h-24 bg-white rounded-3xl animate-pulse" />)
                  ) : stats.recentChats.length > 0 ? (
                    stats.recentChats.map((chat) => (
                      <Link 
                        key={chat.id} 
                        to={`/dashboard/chat/${chat.id}`}
                        className="flex items-center p-5 bg-white rounded-[2rem] border border-gray-100 hover:border-red-100 hover:shadow-lg transition-all group"
                      >
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-secondary transition-colors">
                            <MessageSquarePlus className="w-5 h-5" />
                         </div>
                         <div className="ml-5 flex-grow">
                            <h4 className="text-sm font-black text-gray-900">{chat.title || 'Untitled Report'}</h4>
                            <div className="flex items-center space-x-3 mt-1">
                               <span className="text-[10px] font-bold text-gray-400 flex items-center uppercase">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(chat.created_at).toLocaleDateString()}
                               </span>
                               <span className="w-1 h-1 bg-gray-200 rounded-full" />
                               <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Analysis Ready</span>
                            </div>
                         </div>
                         <div className="bg-gray-50 p-2 rounded-xl group-hover:bg-secondary group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                         </div>
                      </Link>
                    ))
                  ) : (
                    <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-gray-100 text-center">
                       <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                          <History className="w-8 h-8 text-gray-200" />
                       </div>
                       <h3 className="text-lg font-black text-gray-900 mb-2">No Reports Found</h3>
                       <p className="text-xs text-gray-400 font-bold max-w-xs mx-auto mb-8 uppercase tracking-widest">Start your first AI-powered tomato leaf scan to see history here.</p>
                       <Link to="/dashboard/chat/new" className="btn-primary py-4 px-10 text-[10px] font-black uppercase tracking-widest shadow-red-100">Start Diagnosis</Link>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Right Side: Tips, Weather, Support */}
         <div className="space-y-8">
            <div className="bg-gradient-to-br from-secondary to-red-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-red-100 relative overflow-hidden group">
               <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                     <Info className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight mb-4">Farmer Tip of the Day</h3>
                  <p className="text-sm font-medium text-red-50 leading-relaxed italic mb-8">
                    "Mulching your tomato plants helps retain moisture and prevents soil-borne diseases from splashing onto leaves during heavy rain."
                  </p>
                  <button className="w-full py-3 bg-white text-secondary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all shadow-lg">
                    Read More Articles
                  </button>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-secondary" /> Weather Forecast
               </h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                     <div className="flex items-center space-x-3">
                        <span className="text-2xl">☀️</span>
                        <div>
                           <p className="text-xs font-black text-gray-900">Today</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase">Sunny</p>
                        </div>
                     </div>
                     <span className="text-lg font-black text-gray-900">28°C</span>
                  </div>
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
                     <div className="flex items-center space-x-3">
                        <span className="text-2xl">⛅</span>
                        <div>
                           <p className="text-xs font-black text-gray-400">Tomorrow</p>
                           <p className="text-[10px] font-bold text-gray-400 uppercase">Partly Cloudy</p>
                        </div>
                     </div>
                     <span className="text-lg font-black text-gray-400 group-hover:text-secondary transition-colors">26°C</span>
                  </div>
               </div>
            </div>

            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-gray-300">
               <h3 className="text-lg font-black tracking-tight mb-2">Need Expert Help?</h3>
               <p className="text-xs text-gray-400 font-medium mb-8 leading-relaxed">Connect with our certified agronomists for direct voice assistance.</p>
               <a 
                 href="https://wa.me/250780000000" 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex items-center justify-center space-x-3 bg-green-500 text-white p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-900/20"
               >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Support</span>
               </a>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
