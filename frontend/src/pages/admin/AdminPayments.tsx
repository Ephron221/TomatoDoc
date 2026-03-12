import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  Check, 
  X, 
  Eye, 
  Search, 
  Loader2, 
  ExternalLink,
  MoreHorizontal,
  Download,
  Maximize2,
  Minimize2,
  RotateCw,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Payment {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  plan: string;
  amount: number;
  payment_method: string;
  proof_file: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Modal for viewing proof
  const [selectedProof, setSelectedProof] = useState<{url: string, id: number} | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [proofLoading, setProofLoading] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/admin/payments');
      setPayments(res.data);
    } catch (err) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (!window.confirm('Are you sure you want to approve this payment?')) return;
    
    setActionLoading(id);
    try {
      await api.post(`/admin/payments/approve/${id}`);
      toast.success('Payment approved and subscription activated');
      fetchPayments();
    } catch (err) {
      toast.error('Approval failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = window.prompt('Reason for rejection:');
    if (reason === null) return;

    setActionLoading(id);
    try {
      await api.post(`/admin/payments/reject/${id}`, { reason });
      toast.success('Payment rejected');
      fetchPayments();
    } catch (err) {
      toast.error('Rejection failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this payment record and proof? This action cannot be undone.')) return;

    setActionLoading(id);
    try {
      await api.delete(`/admin/payments/${id}`);
      toast.success('Payment record deleted');
      setSelectedProof(null);
      fetchPayments();
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setActionLoading(null);
    }
  };

  const openProof = (payment: Payment) => {
    const filePath = payment.proof_file;
    // Standardize path: remove backend absolute path parts if any, ensure forward slashes
    const cleanPath = filePath.replace(/\\/g, '/');
    const fullUrl = `/${cleanPath}`;
    setSelectedProof({ url: fullUrl, id: payment.id });
    setIsPdf(cleanPath.toLowerCase().endsWith('.pdf'));
    setProofLoading(true);
    setRotation(0);
    setZoom(1);
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Payment Management</h1>
          <p className="text-gray-500 mt-1">Review and manage subscription payment proofs.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search farmers..." 
              className="input-field pl-10 py-2.5 text-sm w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-white text-secondary shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Farmer</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Plan & Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Method</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-secondary mx-auto" />
                  </td>
                </tr>
              ) : filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-red-50 text-secondary rounded-2xl flex items-center justify-center mr-4 font-black text-lg border border-red-100 shadow-sm">
                          {p.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-none">{p.full_name}</p>
                          <p className="text-xs text-gray-400 mt-1 font-medium">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div>
                        <p className="font-black text-gray-900 uppercase text-xs tracking-widest">{p.plan}</p>
                        <p className="text-sm text-secondary font-black mt-0.5">{p.amount.toLocaleString()} RWF</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                        {p.payment_method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                      {new Date(p.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        p.status === 'approved' ? 'bg-green-100 text-green-700' :
                        p.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          p.status === 'approved' ? 'bg-green-500' :
                          p.status === 'rejected' ? 'bg-red-500' :
                          'bg-amber-500 animate-pulse'
                        }`}></span>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openProof(p)}
                          className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all shadow-sm bg-white border border-gray-100"
                          title="View Proof"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        
                        {p.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleApprove(p.id)}
                              disabled={actionLoading === p.id}
                              className="p-3 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-xl transition-all shadow-sm bg-white border border-gray-100"
                              title="Approve"
                            >
                              {actionLoading === p.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                            </button>
                            <button 
                              onClick={() => handleReject(p.id)}
                              disabled={actionLoading === p.id}
                              className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm bg-white border border-gray-100"
                              title="Reject"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleDelete(p.id)}
                          disabled={actionLoading === p.id}
                          className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete Record"
                        >
                          {actionLoading === p.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center text-gray-400 font-medium italic">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Modal */}
      <AnimatePresence>
        {selectedProof && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProof(null)}
              className="absolute inset-0 bg-gray-900/90 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-full"
            >
              <div className="flex items-center justify-between p-6 md:px-10 border-b bg-white z-10">
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Payment Verification</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Proof of Transaction</p>
                </div>
                <div className="flex items-center space-x-3">
                  {!isPdf && (
                    <div className="hidden md:flex items-center bg-gray-100 rounded-xl p-1 mr-2">
                      <button onClick={() => setRotation(r => r - 90)} className="p-2 hover:bg-white rounded-lg transition-all text-gray-500"><RotateCw className="w-4 h-4 scale-x-[-1]" /></button>
                      <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-2 hover:bg-white rounded-lg transition-all text-gray-500"><Minimize2 className="w-4 h-4" /></button>
                      <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 hover:bg-white rounded-lg transition-all text-gray-500"><Maximize2 className="w-4 h-4" /></button>
                      <button onClick={() => setRotation(r => r + 90)} className="p-2 hover:bg-white rounded-lg transition-all text-gray-500"><RotateCw className="w-4 h-4" /></button>
                    </div>
                  )}
                  <button 
                    onClick={() => handleDelete(selectedProof.id)}
                    className="p-3 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-2xl transition-all"
                    title="Delete Proof"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setSelectedProof(null)}
                    className="p-3 hover:bg-gray-100 text-gray-400 rounded-2xl transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-grow overflow-auto bg-gray-50 flex items-center justify-center p-6 relative min-h-[400px]">
                {proofLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 bg-gray-50/50">
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-12 h-12 animate-spin text-secondary mb-4" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Loading Document...</p>
                    </div>
                  </div>
                )}

                {isPdf ? (
                  <iframe 
                    src={`${selectedProof.url}#toolbar=0`} 
                    className="w-full h-[70vh] rounded-2xl border-none shadow-lg"
                    onLoad={() => setProofLoading(false)}
                  />
                ) : (
                  <motion.img 
                    src={selectedProof.url} 
                    alt="Payment Proof" 
                    animate={{ rotate: rotation, scale: zoom }}
                    className="max-h-[70vh] w-auto object-contain shadow-2xl rounded-xl"
                    onLoad={() => setProofLoading(false)}
                    onError={() => {
                      setProofLoading(false);
                      toast.error('Failed to load image');
                    }}
                  />
                )}
              </div>

              <div className="p-6 md:px-10 bg-white border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  <Download className="w-4 h-4" />
                  <span>Verified Secure Access</span>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <a 
                    href={selectedProof.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 sm:flex-none btn-outline py-3 px-6 text-xs uppercase tracking-widest font-black flex items-center justify-center"
                  >
                    Open Full Size <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedProof.url;
                      link.download = `proof-${Date.now()}`;
                      link.click();
                    }}
                    className="flex-1 sm:flex-none btn-primary py-3 px-6 text-xs uppercase tracking-widest font-black flex items-center justify-center shadow-red-100"
                  >
                    Download Proof <Download className="ml-2 w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPayments;
