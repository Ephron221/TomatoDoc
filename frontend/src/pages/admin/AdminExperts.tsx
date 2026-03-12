import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { 
  UserCheck, 
  UserPlus,
  Mail, 
  Phone, 
  Award, 
  ExternalLink, 
  Search, 
  Loader2,
  Trash2,
  CheckCircle,
  FileText,
  MessageCircle,
  X,
  Camera,
  Upload,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Expert {
  id: number;
  full_name: string;
  photo: string;
  description: string;
  email: string;
  whatsapp: string;
  phone: string;
  specialization: string;
}

const AdminExperts: React.FC = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDegreeModalOpen, setIsDegreeModalOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    specialization: '',
    email: '',
    phone: '',
    whatsapp: '',
    description: ''
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const res = await api.get('/admin/experts');
      setExperts(res.data);
    } catch (err) {
      toast.error('Failed to load experts');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (photoFile) {
        data.append('photo', photoFile);
      }

      await api.post('/admin/experts', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('New expert added successfully');
      setIsAddModalOpen(false);
      resetForm();
      fetchExperts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add expert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      specialization: '',
      email: '',
      phone: '',
      whatsapp: '',
      description: ''
    });
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this expert?')) return;
    setActionLoading(id);
    try {
      await api.delete(`/admin/experts/${id}`);
      toast.success('Expert removed successfully');
      fetchExperts();
    } catch (err) {
      toast.error('Failed to delete expert');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredExperts = experts.filter(e => 
    e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Expert Verification</h1>
          <p className="text-gray-500 mt-1">Review and manage certified agronomists and specialists.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search specialists..." 
              className="input-field pl-11 py-3 text-sm w-full shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto btn-primary px-6 py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center shadow-red-100"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Expert
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-secondary mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Experts...</p>
        </div>
      ) : filteredExperts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredExperts.map((expert) => (
            <div key={expert.id} className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/40 flex flex-col group transition-all hover:border-red-100">
              <div className="p-8 pb-4">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-4 border-gray-50 shadow-inner bg-gray-100">
                      {expert.photo ? (
                        <img src={`/${expert.photo}`} alt={expert.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-black text-gray-300">
                          {expert.full_name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-xl border-4 border-white shadow-lg shadow-green-100">
                      <CheckCircle className="w-3 h-3" />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(expert.id)}
                    disabled={actionLoading === expert.id}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    {actionLoading === expert.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{expert.full_name}</h3>
                  <p className="text-secondary text-xs font-black uppercase tracking-widest flex items-center">
                    <Award className="w-3 h-3 mr-1.5" /> {expert.specialization}
                  </p>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                  <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-3 italic">
                    "{expert.description}"
                  </p>
                </div>
              </div>

              <div className="px-8 py-6 space-y-3 bg-gray-50/30 mt-auto border-t border-gray-50">
                <div className="flex items-center text-xs text-gray-500 font-bold">
                  <Mail className="w-3.5 h-3.5 mr-3 text-gray-400" /> {expert.email}
                </div>
                <div className="flex items-center text-xs text-gray-500 font-bold">
                  <Phone className="w-3.5 h-3.5 mr-3 text-gray-400" /> {expert.phone}
                </div>
                <div className="flex items-center text-xs text-gray-500 font-bold">
                  <MessageCircle className="w-3.5 h-3.5 mr-3 text-gray-400" /> {expert.whatsapp}
                </div>
              </div>

              <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedExpert(expert);
                    setIsDegreeModalOpen(true);
                  }}
                  className="flex-1 py-3.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all flex items-center justify-center"
                >
                  Verify Degree <FileText className="ml-2 w-3 h-3" />
                </button>
                <a 
                  href={`mailto:${expert.email}`}
                  className="p-3.5 bg-gray-100 text-gray-400 rounded-2xl hover:bg-secondary hover:text-white transition-all shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <UserCheck className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No Experts Found</h3>
          <p className="text-gray-400 max-w-sm mx-auto">There are currently no registered experts in the system matching your search.</p>
        </div>
      )}

      {/* Add Expert Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-8 border-b border-gray-100">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Register New Expert</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Official Verification Required</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 flex justify-center mb-6">
                    <div 
                      className="relative w-28 h-28 rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-secondary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 group-hover:text-secondary transition-colors">
                          <Camera className="w-8 h-8 mb-1" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Photo</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      className="input-field w-full"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Plant Pathology"
                      className="input-field w-full"
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      className="input-field w-full"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      className="input-field w-full"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      className="input-field w-full"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bio / Description</label>
                    <textarea 
                      rows={3}
                      required
                      className="input-field w-full py-3 resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-4 bg-secondary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-100 flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm & Register'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Degree Modal (Simulated) */}
      <AnimatePresence>
        {isDegreeModalOpen && selectedExpert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDegreeModalOpen(false)}
              className="absolute inset-0 bg-gray-900/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Academic Certification</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{selectedExpert.full_name} • {selectedExpert.specialization}</p>
                </div>
                <button onClick={() => setIsDegreeModalOpen(false)} className="p-3 hover:bg-gray-100 rounded-2xl transition-all text-gray-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-grow bg-gray-50 p-10 overflow-auto flex items-center justify-center">
                {/* Simulated Degree Document */}
                <div className="w-[600px] h-[800px] bg-white shadow-2xl rounded-sm border-8 border-double border-gray-100 p-16 flex flex-col items-center text-center font-serif relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
                    <CheckCircle className="w-full h-full scale-150 rotate-12" />
                  </div>
                  
                  <Award className="w-20 h-20 text-secondary mb-10" />
                  <h4 className="text-4xl font-bold uppercase tracking-widest text-gray-900 mb-2">Certificate of Excellence</h4>
                  <div className="w-40 h-1 bg-secondary mb-10" />
                  
                  <p className="text-xl italic text-gray-500 mb-8">This is to certify that</p>
                  <p className="text-5xl font-black text-gray-900 mb-10 underline decoration-secondary decoration-4 underline-offset-8">{selectedExpert.full_name}</p>
                  
                  <p className="text-xl leading-relaxed text-gray-600 mb-20 px-10">
                    Has successfully completed the advanced program in <br/>
                    <strong className="text-gray-900 font-bold">{selectedExpert.specialization}</strong> <br/>
                    with honors and is hereby recognized as a certified specialist.
                  </p>
                  
                  <div className="mt-auto w-full flex justify-between items-end px-10">
                    <div className="text-left">
                      <div className="w-40 h-px bg-gray-300 mb-2" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Academic Dean</p>
                    </div>
                    <div className="w-24 h-24 border-4 border-secondary/20 rounded-full flex items-center justify-center opacity-50">
                       <ShieldCheck className="w-12 h-12 text-secondary" />
                    </div>
                    <div className="text-right">
                      <div className="w-40 h-px bg-gray-300 mb-2" />
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Certified Registrar</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t flex justify-end gap-4">
                 <button className="btn-outline px-6 py-3 text-[10px] font-black uppercase tracking-widest flex items-center">
                   Download PDF <Upload className="ml-2 w-4 h-4" />
                 </button>
                 <button className="btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest flex items-center shadow-red-100">
                   Mark as Verified <CheckCircle className="ml-2 w-4 h-4" />
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShieldCheck = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default AdminExperts;
