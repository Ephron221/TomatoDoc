import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  Search, 
  Loader2,
  Trash2,
  Reply,
  MessageCircle,
  CheckCircle2,
  Filter,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/admin/contacts');
      setContacts(res.data);
    } catch (err) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">User Inquiries</h1>
          <p className="text-gray-500 mt-1">Manage and respond to support messages from the contact form.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="input-field pl-11 py-3 text-sm w-full sm:w-80 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-secondary transition-all shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-secondary mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Loading Messages...</p>
        </div>
      ) : filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl shadow-gray-200/40 flex flex-col md:flex-row group transition-all hover:border-red-100">
              <div className="md:w-72 p-8 bg-gray-50/50 border-r border-gray-50">
                 <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-4 text-secondary font-black">
                   {contact.name.charAt(0)}
                 </div>
                 <h3 className="font-black text-gray-900 leading-tight mb-1 truncate">{contact.name}</h3>
                 <p className="text-xs text-gray-400 font-bold mb-6 truncate">{contact.email}</p>
                 
                 <div className="space-y-4">
                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5 mr-2" />
                      {new Date(contact.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Phone className="w-3.5 h-3.5 mr-2" />
                      {contact.phone}
                    </div>
                 </div>
              </div>

              <div className="flex-grow p-8 flex flex-col">
                <div className="mb-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-secondary text-[10px] font-black uppercase tracking-wider mb-2">
                    {contact.subject}
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    {contact.message}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50 flex flex-wrap items-center gap-4">
                  <a 
                    href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                    className="btn-primary py-2.5 px-6 text-[10px] font-black uppercase tracking-widest flex items-center shadow-red-100"
                  >
                    Reply via Email <Mail className="ml-2 w-3.5 h-3.5" />
                  </a>
                  <button 
                    onClick={() => openWhatsApp(contact.phone)}
                    className="py-2.5 px-6 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-600 transition-all flex items-center shadow-lg shadow-green-100"
                  >
                    WhatsApp <MessageCircle className="ml-2 w-3.5 h-3.5" />
                  </button>
                  <button className="p-2.5 bg-gray-100 text-gray-400 rounded-xl hover:text-red-500 hover:bg-red-50 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-gray-100">
          <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-black text-gray-900">No Messages Yet</h3>
          <p className="text-gray-400 text-sm">When users contact you, their inquiries will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
