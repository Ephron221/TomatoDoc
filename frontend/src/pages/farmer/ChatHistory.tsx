import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  ChevronRight, 
  Calendar, 
  Loader2,
  Filter,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface ChatSession {
  id: number;
  title: string;
  language: string;
  created_at: string;
}

const ChatHistory: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/chat/sessions');
      setSessions(res.data);
    } catch (err) {
      toast.error('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    
    try {
      await api.delete(`/chat/sessions/${id}`);
      setSessions(sessions.filter(s => s.id !== id));
      toast.success('Chat deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Chat History</h1>
          <p className="text-gray-500 mt-1">Review all your previous AI consultations.</p>
        </div>
        
        <Link to="/dashboard/chat/new" className="btn-primary py-2.5">
          Start New Chat
        </Link>
      </div>

      <div className="mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search your chats..."
          className="input-field pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        </div>
      ) : filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => navigate(`/dashboard/chat/${session.id}`)}
              className="group bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-50 text-secondary rounded-xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-secondary transition-colors line-clamp-1">
                    {session.title}
                  </h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="flex items-center text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {format(new Date(session.created_at), 'PPP')}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 uppercase">
                      {session.language}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={(e) => handleDelete(e, session.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-secondary group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
             <MessageSquare className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">No chat sessions found.</p>
          <Link to="/dashboard/chat/new" className="text-secondary font-bold text-sm mt-2 inline-block hover:underline">
            Start your first conversation now
          </Link>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
