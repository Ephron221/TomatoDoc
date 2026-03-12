import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  MessageSquare, 
  UserCheck, 
  Settings, 
  User, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  Search,
  ChevronRight,
  ShieldCheck,
  Mail,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview' },
    { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Farmers' },
    { path: '/admin/payments', icon: <CreditCard className="w-5 h-5" />, label: 'Payments' },
    { path: '/admin/experts', icon: <UserCheck className="w-5 h-5" />, label: 'Expert Verification' },
    { path: '/admin/contacts', icon: <MessageSquare className="w-5 h-5" />, label: 'Inquiries' },
    { path: '/admin/profile', icon: <User className="w-5 h-5" />, label: 'My Profile' },
    { path: '/admin/settings', icon: <Settings className="w-5 h-5" />, label: 'System Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white border-r border-gray-100 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-red-100">
               <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">Admin<span className="text-secondary">Doc</span></span>
          </Link>
          <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto py-6 px-4 space-y-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">Main Menu</p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                isActive(item.path) 
                ? 'bg-secondary text-white shadow-lg shadow-red-100' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={`${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-secondary'} transition-colors`}>
                {item.icon}
              </span>
              <span className="ml-3 font-bold text-sm tracking-tight">{item.label}</span>
              {isActive(item.path) && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-gray-50">
          <div className="bg-gray-50 rounded-[2rem] p-4 flex items-center space-x-3 border border-gray-100">
             <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center font-black text-secondary overflow-hidden">
               {user?.profile_image ? (
                 <img src={`/${user.profile_image}`} alt="" className="w-full h-full object-cover" />
               ) : (
                 user?.full_name?.charAt(0)
               )}
             </div>
             <div className="flex-grow min-w-0">
                <p className="text-xs font-black text-gray-900 truncate">{user?.full_name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">Administrator</p>
             </div>
             <button 
               onClick={handleLogout}
               className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
             >
               <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 z-30 sticky top-0">
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="hidden md:flex relative group w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-secondary transition-colors" />
            <input 
              type="text" 
              placeholder="Search data, reports, farmers..." 
              className="w-full bg-gray-50/50 border-none rounded-2xl pl-11 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-red-100 transition-all"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Live Status
            </div>
            <NotificationBell />
            <div className="h-8 w-px bg-gray-100 mx-2" />
            <button 
              onClick={() => navigate('/admin/profile')}
              className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded-2xl transition-all"
            >
               <div className="w-8 h-8 rounded-xl bg-secondary text-white flex items-center justify-center font-black text-xs overflow-hidden">
                 {user?.profile_image ? (
                   <img src={`/${user.profile_image}`} alt="" className="w-full h-full object-cover" />
                 ) : (
                   user?.full_name?.charAt(0)
                 )}
               </div>
               <span className="text-xs font-black text-gray-700 hidden sm:block">{user?.full_name?.split(' ')[0]}</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-grow overflow-y-auto bg-gray-50/50 p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
