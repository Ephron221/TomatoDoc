import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { Phone, Mail, MessageSquare, Loader2, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

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

const Experts: React.FC = () => {
  const { t } = useTranslation();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const res = await api.get('/experts');
      setExperts(res.data);
    } catch (err) {
      toast.error('Failed to load experts');
    } finally {
      setLoading(false);
    }
  };

  const filteredExperts = experts.filter(expert => 
    expert.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Agricultural Experts</h1>
        <p className="text-gray-500">
          Connect with certified specialists in tomato farming across Rwanda for personalized guidance and support.
        </p>
      </div>

      <div className="mb-8 relative max-w-md mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or specialization..."
          className="input-field pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        </div>
      ) : filteredExperts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExperts.map((expert) => (
            <div key={expert.id} className="card flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-red-50 p-1">
                <img 
                  src={expert.photo ? `/api/${expert.photo}` : `https://ui-avatars.com/api/?name=${expert.full_name}&background=FF6347&color=fff`} 
                  alt={expert.full_name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{expert.full_name}</h3>
              <p className="text-secondary font-medium text-sm mb-4">{expert.specialization}</p>
              <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">
                {expert.description}
              </p>
              
              <div className="w-full grid grid-cols-3 gap-2">
                <a 
                  href={`https://wa.me/${expert.whatsapp.replace(/\+/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase">WhatsApp</span>
                </a>
                <a 
                  href={`mailto:${expert.email}`} 
                  className="flex flex-col items-center justify-center p-3 bg-red-50 text-secondary rounded-xl hover:bg-red-100 transition"
                  title="Email"
                >
                  <Mail className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Email</span>
                </a>
                <a 
                  href={`tel:${expert.phone}`} 
                  className="flex flex-col items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
                  title="Call"
                >
                  <Phone className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold uppercase">Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No experts found matching your search.</p>
        </div>
      )}

      <div className="mt-16 bg-secondary rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Are you an agricultural expert?</h2>
          <p className="text-red-100">Join our network and help farmers across Rwanda improve their tomato production.</p>
        </div>
        <a href="mailto:experts@tomatodoc.rw" className="bg-white text-secondary px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition flex items-center">
          Apply to Join <ExternalLink className="ml-2 w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default Experts;
