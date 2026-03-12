import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Users, 
  CreditCard, 
  CheckCircle, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  const data = [
    { name: 'Mon', detections: 40 },
    { name: 'Tue', detections: 30 },
    { name: 'Wed', detections: 65 },
    { name: 'Thu', detections: 45 },
    { name: 'Fri', detections: 90 },
    { name: 'Sat', detections: 55 },
    { name: 'Sun', detections: 70 },
  ];

  const statCards = [
    { 
      title: 'Total Farmers', 
      value: stats?.totalUsers || '0', 
      icon: <Users className="w-6 h-6" />, 
      color: 'bg-blue-500', 
      trend: '+12%', 
      positive: true 
    },
    { 
      title: 'Pending Payments', 
      value: stats?.pendingPayments || '0', 
      icon: <CreditCard className="w-6 h-6" />, 
      color: 'bg-amber-500', 
      trend: '+5%', 
      positive: false 
    },
    { 
      title: 'Active Subs', 
      value: stats?.activeSubscriptions || '0', 
      icon: <CheckCircle className="w-6 h-6" />, 
      color: 'bg-green-500', 
      trend: '+18%', 
      positive: true 
    },
    { 
      title: 'Total Detections', 
      value: stats?.totalDetections || '0', 
      icon: <Activity className="w-6 h-6" />, 
      color: 'bg-secondary', 
      trend: '+24%', 
      positive: true 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Overview</h1>
          <p className="text-gray-500 mt-1">System status and performance metrics.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, index) => (
          <div key={index} className="card p-6 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{card.title}</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{card.value}</h3>
              <div className={`flex items-center text-xs font-bold ${card.positive ? 'text-green-500' : 'text-amber-500'}`}>
                {card.positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {card.trend} <span className="text-gray-400 font-normal ml-1">since last month</span>
              </div>
            </div>
            <div className={`${card.color} text-white p-3 rounded-2xl shadow-lg shadow-${card.color.split('-')[1]}-100`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Detection Activity</h3>
            <select className="bg-gray-50 border-none text-xs font-bold py-2 px-4 rounded-lg focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6347" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF6347" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="detections" stroke="#FF6347" strokeWidth={3} fillOpacity={1} fill="url(#colorDetections)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <Link to="/admin/payments" className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100 group transition hover:bg-amber-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center mr-4">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-amber-900">Review Payments</p>
                  <p className="text-xs text-amber-700">{stats?.pendingPayments || 0} pending approvals</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link to="/admin/users" className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100 group transition hover:bg-blue-100">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center mr-4">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-blue-900">Manage Users</p>
                  <p className="text-xs text-blue-700">View farmer database</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
             <div className="bg-secondary bg-opacity-10 p-6 rounded-2xl flex items-start">
               <AlertCircle className="w-6 h-6 text-secondary mr-4 flex-shrink-0" />
               <div>
                 <h4 className="font-bold text-secondary mb-1">System Update</h4>
                 <p className="text-xs text-gray-600 leading-relaxed">
                   The AI model was last updated on Oct 24, 2023. Next scheduled retrain is in 12 days.
                 </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
