import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Globe, 
  Cpu, 
  Save, 
  RefreshCw,
  HardDrive,
  Cloud,
  Lock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Smartphone,
  MessageCircle,
  Eye,
  EyeOff,
  Server,
  Terminal,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'general' | 'ai' | 'notifications' | 'security' | 'backups';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [loading, setLoading] = useState(false);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    // General
    appName: 'TomatoDoc',
    adminEmail: 'support@tomatodoc.com',
    supportPhone: '+250 788 000 000',
    language: 'en',
    
    // AI
    confidenceThreshold: 85,
    autoTreatment: true,
    modelFlavor: 'ResNet50-V2',
    enableVoiceAnalysis: true,

    // Notifications
    emailAlerts: true,
    smsAlerts: false,
    whatsappAlerts: true,
    marketingEmails: false,

    // Security
    sessionTimeout: 60,
    twoFactorAuth: true,
    passwordExpiry: 90,
    maxLoginAttempts: 5,

    // Backups
    backupFrequency: 'daily',
    retentionDays: 30,
    cloudSync: true
  });

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('System settings updated successfully');
    }, 1200);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', icon: <Globe className="w-4 h-4" />, label: 'General' },
    { id: 'ai', icon: <Zap className="w-4 h-4" />, label: 'AI Configuration' },
    { id: 'notifications', icon: <Bell className="w-4 h-4" />, label: 'Notifications' },
    { id: 'security', icon: <Shield className="w-4 h-4" />, label: 'Security & Auth' },
    { id: 'backups', icon: <Database className="w-4 h-4" />, label: 'Backups' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Settings</h1>
          <p className="text-gray-500 mt-1 font-medium">Global configuration and engine parameters.</p>
        </div>
        <div className="flex items-center space-x-3">
           <div className="hidden md:flex flex-col items-end mr-2">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Synced</span>
             <span className="text-xs font-bold text-gray-600">2 mins ago</span>
           </div>
           <button 
            onClick={handleSave}
            disabled={loading}
            className="btn-primary px-8 py-3.5 text-xs font-black uppercase tracking-widest flex items-center shadow-red-100 transition-all hover:scale-105 active:scale-95"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'bg-white text-secondary shadow-xl shadow-gray-200/50 border border-red-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-white/50 border border-transparent'
              }`}
            >
              <span className={`${activeTab === tab.id ? 'text-secondary' : 'text-gray-400'} transition-colors`}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="activeTab" className="ml-auto w-1.5 h-1.5 bg-secondary rounded-full" />
              )}
            </button>
          ))}

          <div className="mt-10 p-6 bg-secondary/5 rounded-3xl border border-red-50">
             <div className="flex items-center space-x-2 mb-3">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Server Uptime</span>
             </div>
             <p className="text-xl font-black text-gray-900">99.9%</p>
             <p className="text-[10px] text-gray-400 font-bold mt-1">Operational for 42 days</p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8 flex items-center">
                      <Globe className="w-6 h-6 mr-3 text-secondary" /> General Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Application Name</label>
                        <input 
                          type="text" 
                          className="input-field w-full" 
                          value={settings.appName}
                          onChange={(e) => updateSetting('appName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support Email</label>
                        <input 
                          type="email" 
                          className="input-field w-full" 
                          value={settings.adminEmail}
                          onChange={(e) => updateSetting('adminEmail', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Support Phone</label>
                        <input 
                          type="text" 
                          className="input-field w-full" 
                          value={settings.supportPhone}
                          onChange={(e) => updateSetting('supportPhone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Default Language</label>
                        <select 
                          className="input-field w-full"
                          value={settings.language}
                          onChange={(e) => updateSetting('language', e.target.value)}
                        >
                          <option value="en">English (US)</option>
                          <option value="rw">Kinyarwanda</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50/50 rounded-[2.5rem] p-8 border border-red-100 border-dashed">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-100 text-secondary rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-black text-gray-900 tracking-tight mb-1">Maintenance Mode</h3>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6">
                          When active, the system will be read-only for all farmers. Useful for major database upgrades.
                        </p>
                        <button 
                          onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
                          className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            isMaintenanceMode 
                            ? 'bg-red-500 text-white shadow-lg shadow-red-200' 
                            : 'bg-white border border-red-200 text-secondary hover:bg-red-50'
                          }`}
                        >
                          {isMaintenanceMode ? 'System Locked' : 'Activate Maintenance'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center">
                        <Cpu className="w-6 h-6 mr-3 text-secondary" /> AI Model Configuration
                      </h3>
                      <span className="px-4 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        v2.4.0-stable
                      </span>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-sm font-black text-gray-900">Confidence Threshold</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-tight mt-1">Minimum accuracy to show diagnosis</p>
                          </div>
                          <span className="text-2xl font-black text-secondary">{settings.confidenceThreshold}%</span>
                        </div>
                        <input 
                          type="range" 
                          className="w-full accent-secondary h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer" 
                          min="50" 
                          max="100"
                          value={settings.confidenceThreshold}
                          onChange={(e) => updateSetting('confidenceThreshold', parseInt(e.target.value))}
                        />
                        <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                          <span>Conservative</span>
                          <span>Precision Balanced</span>
                          <span>Aggressive</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                          <div>
                            <p className="text-sm font-black text-gray-900">Auto Treatment</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">AI suggests organic remedies</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.autoTreatment} onChange={(e) => updateSetting('autoTreatment', e.target.checked)} />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
                          <div>
                            <p className="text-sm font-black text-gray-900">Voice Analysis</p>
                            <p className="text-[10px] text-gray-400 font-bold mt-1">Process audio descriptions</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.enableVoiceAnalysis} onChange={(e) => updateSetting('enableVoiceAnalysis', e.target.checked)} />
                            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Detection Model Engine</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                           {['EfficientNet-B4', 'ResNet50-V2', 'Vision-Transformer'].map((model) => (
                             <button 
                               key={model}
                               onClick={() => updateSetting('modelFlavor', model)}
                               className={`p-4 rounded-2xl border-2 text-xs font-black transition-all ${
                                 settings.modelFlavor === model 
                                 ? 'border-secondary bg-red-50 text-secondary' 
                                 : 'border-gray-100 hover:border-gray-200 text-gray-500'
                               }`}
                             >
                               {model}
                             </button>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8 flex items-center">
                    <Bell className="w-6 h-6 mr-3 text-secondary" /> Communication Channels
                  </h3>
                  <div className="space-y-4">
                    {[
                      { id: 'emailAlerts', label: 'Email Notifications', desc: 'Critical alerts and system updates', icon: <Mail className="w-5 h-5 text-blue-500" /> },
                      { id: 'smsAlerts', label: 'SMS Gateway', desc: 'Real-time detection alerts for farmers', icon: <Smartphone className="w-5 h-5 text-green-500" /> },
                      { id: 'whatsappAlerts', label: 'WhatsApp Integration', desc: 'Direct chat with experts and bots', icon: <MessageCircle className="w-5 h-5 text-emerald-500" /> },
                      { id: 'marketingEmails', label: 'Farmer Outreach', desc: 'Newsletters and educational content', icon: <Globe className="w-5 h-5 text-purple-500" /> }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-white transition-all group">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-400 font-bold mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={(settings as any)[item.id]} 
                            onChange={(e) => updateSetting(item.id, e.target.checked)} 
                          />
                          <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                   <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8 flex items-center">
                      <Shield className="w-6 h-6 mr-3 text-secondary" /> Security & Session
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Session Timeout (Minutes)</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            type="number" 
                            className="input-field pl-11 w-full" 
                            value={settings.sessionTimeout}
                            onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Login Attempts</label>
                        <input 
                          type="number" 
                          className="input-field w-full" 
                          value={settings.maxLoginAttempts}
                          onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100 col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-4">
                           <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                             <Lock className="w-5 h-5 text-gray-900" />
                           </div>
                           <div>
                              <p className="text-sm font-black text-gray-900">Enforce Two-Factor Auth</p>
                              <p className="text-xs text-gray-400 font-bold mt-0.5">Mandatory for all administrator accounts</p>
                           </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={settings.twoFactorAuth} onChange={(e) => updateSetting('twoFactorAuth', e.target.checked)} />
                          <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-[2.5rem] p-8 border border-gray-800 shadow-2xl">
                     <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xl font-black text-white tracking-tight flex items-center">
                         <Terminal className="w-6 h-6 mr-3 text-secondary" /> System Logs
                       </h3>
                       <button className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] hover:text-white transition-colors">Clear All</button>
                     </div>
                     <div className="bg-black/50 rounded-2xl p-6 font-mono text-[10px] text-green-400 space-y-2 overflow-auto max-h-40 scrollbar-hide">
                        <p>[14:22:01] Auth: User 142 logged in successfully</p>
                        <p>[14:25:34] AI: Detection request received from session #901</p>
                        <p>[14:25:36] AI: Processed image in 452ms (Threshold: 0.85)</p>
                        <p className="text-amber-400">[14:30:12] DB: Table "payments" optimized</p>
                        <p>[14:45:00] Cron: Periodic health check passed</p>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'backups' && (
                <div className="space-y-6">
                   <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-8 flex items-center">
                      <Database className="w-6 h-6 mr-3 text-secondary" /> Backup & Recovery
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                       <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Backup Frequency</label>
                        <select 
                          className="input-field w-full"
                          value={settings.backupFrequency}
                          onChange={(e) => updateSetting('backupFrequency', e.target.value)}
                        >
                          <option value="hourly">Every Hour</option>
                          <option value="daily">Every Day</option>
                          <option value="weekly">Every Week</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Retention Policy (Days)</label>
                        <input 
                          type="number" 
                          className="input-field w-full" 
                          value={settings.retentionDays}
                          onChange={(e) => updateSetting('retentionDays', parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Cloud Sync Status</p>
                      <div className="flex items-center justify-between p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                         <div className="flex items-center space-x-4">
                           <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-blue-100 flex items-center justify-center">
                             <Cloud className="w-6 h-6 text-blue-500" />
                           </div>
                           <div>
                              <p className="text-sm font-black text-blue-900">Google Cloud Storage</p>
                              <p className="text-xs text-blue-500 font-bold mt-0.5">Connected: bucket-tomatodoc-primary</p>
                           </div>
                         </div>
                         <button className="px-6 py-2.5 bg-white text-blue-600 text-[10px] font-black rounded-xl border border-blue-200 hover:bg-blue-600 hover:text-white transition-all">Test Sync</button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40">
                    <h3 className="text-sm font-black text-gray-900 tracking-tight mb-6">Recent Backups</h3>
                    <div className="space-y-3">
                       {[
                         { date: 'Today, 04:00 AM', size: '242 MB', status: 'Success' },
                         { date: 'Yesterday, 04:00 AM', size: '241 MB', status: 'Success' },
                         { date: '2 days ago, 04:00 AM', size: '238 MB', status: 'Success' },
                       ].map((backup, i) => (
                         <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                           <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                               <Server className="w-4 h-4" />
                             </div>
                             <div>
                               <p className="text-xs font-black text-gray-900">{backup.date}</p>
                               <p className="text-[10px] text-gray-400 font-bold">{backup.size}</p>
                             </div>
                           </div>
                           <button className="p-3 text-gray-400 hover:text-secondary transition-colors">
                             <RefreshCw className="w-4 h-4" />
                           </button>
                         </div>
                       ))}
                    </div>
                    <button className="w-full mt-6 py-4 bg-gray-50 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center border border-gray-100 border-dashed">
                       View Full Backup History
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
