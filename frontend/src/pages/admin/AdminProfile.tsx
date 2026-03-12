import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Camera, 
  Shield, 
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

const AdminProfile: React.FC = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    email: '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Sync form with user data when it loads or changes
  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        email: user.email || '',
      });
      if (user.profile_image) {
        setPreviewUrl(`/${user.profile_image}`);
      }
    }
  }, [user]);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('full_name', profileData.full_name);
      formData.append('phone', profileData.phone);
      if (selectedImage) {
        formData.append('profile_image', selectedImage);
      }

      const res = await api.put('/admin/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update global context and local storage
      setUser(res.data.user);
      toast.success('Profile updated successfully');
      setSelectedImage(null);
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    setPasswordLoading(true);
    try {
      await api.post('/admin/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500 mt-1">Manage your administrator profile and security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleProfileUpdate} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex items-center space-x-6 mb-10">
              <div className="relative group">
                <div 
                  className="w-24 h-24 rounded-[2rem] bg-red-50 text-secondary flex items-center justify-center font-black text-3xl border-2 border-red-100 shadow-inner overflow-hidden cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile" className="w-full h-full object-cover transition-opacity group-hover:opacity-75" />
                  ) : (
                    user?.full_name?.charAt(0)
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-2xl shadow-lg border border-gray-100 text-gray-500 hover:text-secondary transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 leading-none">{user?.full_name}</h3>
                <p className="text-xs text-gray-400 mt-2 font-black uppercase tracking-widest">System Administrator</p>
                <div className="flex items-center mt-3 text-[10px] text-green-600 bg-green-50 px-3 py-1 rounded-full font-black uppercase tracking-wider w-fit">
                  <Shield className="w-3 h-3 mr-1.5" /> Verified Account
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    className="input-field pl-11 w-full" 
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    className="input-field pl-11 w-full bg-gray-50 opacity-70 cursor-not-allowed" 
                    value={profileData.email}
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="tel" 
                    className="input-field pl-11 w-full" 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-50 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest flex items-center shadow-red-100"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Security Card */}
        <div className="space-y-6">
          <form onSubmit={handlePasswordChange} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-gray-200">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-black text-gray-900 tracking-tight">Security</h3>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                <input 
                  type="password" 
                  className="input-field w-full"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                <input 
                  type="password" 
                  className="input-field w-full"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                <input 
                  type="password" 
                  className="input-field w-full"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={passwordLoading}
              className="w-full mt-10 py-4 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200 flex items-center justify-center"
            >
              {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Update Password
            </button>
          </form>

          <div className="bg-secondary bg-opacity-5 rounded-[2.5rem] p-8 border border-red-50">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-secondary" />
              <h4 className="font-black text-secondary text-sm">Two-Factor Auth</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              Your account uses email verification (OTP) for enhanced security. This is currently active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
