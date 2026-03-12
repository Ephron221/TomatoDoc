import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  CreditCard, 
  Upload, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  Smartphone,
  Landmark,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';

const PaymentForm: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPlanId = location.state?.plan;

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    plan: selectedPlanId || 'daily',
    amount: '1000',
    payment_method: 'mobile_money' as 'mobile_money' | 'bank'
  });

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const plans = [
    { id: 'daily', name: 'Daily', price: 1000 },
    { id: 'weekly', name: 'Weekly', price: 5000 },
    { id: 'biweekly', name: 'Bi-Weekly', price: 8000 },
    { id: 'monthly', name: 'Monthly', price: 15000 },
  ];

  useEffect(() => {
    if (formData.plan) {
      const plan = plans.find(p => p.id === formData.plan);
      if (plan) {
        setFormData(prev => ({ ...prev, amount: plan.price.toString() }));
      }
    }
  }, [formData.plan]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Max 5MB.');
        return;
      }
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile) {
      toast.error('Please upload payment proof');
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append('proof', proofFile);

    try {
      await api.post('/payments/submit', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      toast.success('Payment submitted for approval');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Payment Submitted!</h1>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          Your payment proof has been received and is currently being reviewed by our team. 
          Your subscription will be activated within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
          <button 
             onClick={() => navigate('/contact')}
             className="btn-outline"
          >
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-secondary font-medium mb-8"
      >
        <ChevronLeft className="w-5 h-5 mr-1" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <div className="card">
            <h1 className="text-2xl font-bold mb-8">Subscription Payment</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="input-field" 
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    className="input-field" 
                    placeholder="078XXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Select Plan</label>
                  <select 
                    className="input-field"
                    value={formData.plan}
                    onChange={(e) => setFormData({...formData, plan: e.target.value})}
                  >
                    {plans.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Amount (RWF)</label>
                  <input type="text" readOnly className="input-field bg-gray-50" value={formData.amount} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, payment_method: 'mobile_money'})}
                    className={`flex items-center justify-center p-4 rounded-xl border-2 transition ${
                      formData.payment_method === 'mobile_money' ? 'border-secondary bg-red-50 text-secondary' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    <span className="font-bold">Mobile Money</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, payment_method: 'bank'})}
                    className={`flex items-center justify-center p-4 rounded-xl border-2 transition ${
                      formData.payment_method === 'bank' ? 'border-secondary bg-red-50 text-secondary' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <Landmark className="w-5 h-5 mr-2" />
                    <span className="font-bold">Bank Transfer</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Payment Proof</label>
                <div 
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${
                    proofPreview ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-secondary'
                  }`}
                >
                  {proofPreview ? (
                    <div className="relative inline-block">
                      <img src={proofPreview} alt="Proof" className="max-h-40 rounded-lg shadow-sm" />
                      <button 
                        type="button" 
                        onClick={() => {setProofFile(null); setProofPreview(null);}}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-600">Click to upload screenshot or photo of receipt</span>
                      <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-4 text-lg mt-4 shadow-xl shadow-red-100"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                Submit Proof for Approval
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-white border border-gray-100 shadow-xl shadow-gray-200/50">
            <h3 className="text-xl font-bold mb-8 flex items-center text-gray-900">
              <CreditCard className="w-6 h-6 mr-2 text-secondary" />
              Payment Details
            </h3>
            
            <div className="space-y-10">
              {formData.payment_method === 'mobile_money' ? (
                <div className="space-y-6">
                  <h4 className="text-secondary font-black text-[10px] uppercase tracking-[0.2em]">MTN / Airtel Money</h4>
                  
                  <div>
                    <p className="text-sm font-bold text-gray-400 mb-2">Phone Number</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tight">+250 787 846 344</p>
                    <p className="text-xs font-bold text-secondary mt-2">Registered: Ephron TUYISHIME</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h4 className="text-secondary font-black text-[10px] uppercase tracking-[0.2em]">Bank Transfer</h4>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-bold text-gray-400 mb-2">Bank Name</p>
                      <p className="text-2xl font-black text-gray-900 tracking-tight">Equity Bank</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-bold text-gray-400 mb-2">Account Number</p>
                      <p className="text-2xl font-black text-gray-900 tracking-tight font-mono">4009100876268</p>
                      <p className="text-xs font-bold text-secondary mt-2">Owner: Ephron TUYISHIME</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-gray-50">
                <div className="flex items-start space-x-3 text-xs text-gray-500 leading-relaxed">
                  <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p>Your payment is secure. We manually verify every transaction to ensure accuracy and prevent fraud.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50/50 p-8 rounded-[2rem] border border-red-100/50">
            <h4 className="font-black text-gray-900 text-sm mb-2">Need Help?</h4>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">If you experience any issues with the payment, contact our finance team.</p>
            <a 
              href="https://wa.me/250787846344" 
              target="_blank" 
              rel="noreferrer"
              className="text-secondary font-black text-[10px] uppercase tracking-widest flex items-center hover:translate-x-1 transition-transform"
            >
              Chat on WhatsApp <ChevronLeft className="w-3 h-3 ml-2 rotate-180" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
