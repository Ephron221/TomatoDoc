import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  Send, 
  Camera, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  Loader2, 
  MoreVertical,
  ChevronLeft,
  X,
  Plus,
  History,
  Trash2,
  Menu
} from 'lucide-react';
import { toast } from 'sonner';
import ChatMessage from '../../components/ChatMessage';
import VoiceRecorder from '../../components/VoiceRecorder';
import ImageUploader from '../../components/ImageUploader';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  message_type: 'text' | 'image' | 'voice';
  content?: string;
  image_path?: string;
  created_at: string;
  disease_name?: string;
  severity?: string;
  diagnosis?: string;
  possible_causes?: string;
  prevention_tips?: string;
}

interface ChatSession {
  id: number;
  title: string;
  created_at: string;
}

const NewChat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [sessionId, setSessionId] = useState<string | null>(id || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  // UI State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (id) {
      setSessionId(id);
      fetchMessages(id);
    } else {
      setSessionId(null);
      setMessages([]);
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSessions = async () => {
    try {
      const res = await api.get('/chat/sessions');
      setSessions(res.data);
    } catch (err) {
      console.error('Failed to load sessions');
    }
  };

  const fetchMessages = async (sid: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/chat/sessions/${sid}/messages`);
      setMessages(res.data);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || sending) return;

    const messageToSend = inputText;
    setInputText('');
    setSending(true);

    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const sessionRes = await api.post('/chat/sessions', { 
          title: messageToSend.substring(0, 30) + '...',
          language: i18n.language 
        });
        currentSessionId = sessionRes.data.id;
        setSessionId(currentSessionId?.toString() || null);
        fetchSessions();
        navigate(`/dashboard/chat/${currentSessionId}`, { replace: true });
      }

      await api.post('/chat/messages', {
        sessionId: currentSessionId,
        message: messageToSend,
        message_type: 'text'
      });

      fetchMessages(currentSessionId?.toString() || '');
    } catch (err) {
      toast.error('Failed to send message');
      setInputText(messageToSend);
    } finally {
      setSending(false);
    }
  };

  const handleImageCapture = async (file: File) => {
    setIsDetecting(true);
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const sessionRes = await api.post('/chat/sessions', { 
          title: 'Image Analysis ' + new Date().toLocaleTimeString(),
          language: i18n.language 
        });
        currentSessionId = sessionRes.data.id;
        setSessionId(currentSessionId?.toString() || null);
        fetchSessions();
        navigate(`/dashboard/chat/${currentSessionId}`, { replace: true });
      }

      formData.append('sessionId', currentSessionId as string);
      
      await api.post('/detection/detect', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Analysis complete!');
      setShowUploadModal(false);
      fetchMessages(currentSessionId?.toString() || '');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Detection failed');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, sid: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this conversation?')) return;
    try {
      await api.delete(`/chat/sessions/${sid}`);
      setSessions(sessions.filter(s => s.id !== sid));
      if (sessionId === sid.toString()) {
        navigate('/dashboard/chat/new');
      }
      toast.success('Session deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-80 bg-gray-50 border-r transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b bg-white">
            <Link 
              to="/dashboard/chat/new" 
              onClick={() => setIsSidebarOpen(false)}
              className="flex items-center justify-center space-x-2 bg-secondary text-white py-3 rounded-xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-100"
            >
              <Plus className="w-5 h-5" />
              <span>New Conversation</span>
            </Link>
          </div>
          
          <div className="flex-grow overflow-y-auto p-2 space-y-1">
            <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Recent Chats</div>
            {sessions.map((s) => (
              <Link
                key={s.id}
                to={`/dashboard/chat/${s.id}`}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl transition group ${
                  sessionId === s.id.toString() ? 'bg-white shadow-sm border border-gray-100 text-secondary' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center overflow-hidden">
                  <History className={`w-4 h-4 mr-3 flex-shrink-0 ${sessionId === s.id.toString() ? 'text-secondary' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium truncate">{s.title}</span>
                </div>
                <button 
                  onClick={(e) => handleDeleteSession(e, s.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </Link>
            ))}
          </div>

          <div className="p-4 border-t bg-gray-50">
             <Link to="/dashboard" className="flex items-center text-sm text-gray-500 font-bold hover:text-secondary">
               <ChevronLeft className="w-4 h-4 mr-2" />
               Back to Dashboard
             </Link>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-grow flex flex-col relative h-full">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-xl lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="font-black text-gray-900 leading-tight">AI Assistant</h2>
              <div className="flex items-center text-[10px] text-green-500 font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                Secure Diagnostic Channel
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <button onClick={() => navigate('/dashboard/experts')} className="hidden sm:flex items-center text-xs font-bold text-gray-500 hover:text-secondary bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
               Connect Experts
             </button>
             <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl">
               <MoreVertical className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-4 md:p-8 space-y-6 bg-[#F8F9FB]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-secondary" />
              <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center space-y-8">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-5xl relative z-10 border border-gray-100">
                   🍅
                </div>
                <div className="absolute inset-0 bg-secondary blur-2xl opacity-10 scale-150"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">How can I help you today?</h1>
                <p className="text-gray-500 leading-relaxed font-medium">
                  Welcome to TomatoDoc. I'm your specialized AI agricultural assistant. 
                  Ask me about tomato diseases, pests, or cultivation techniques in Rwanda.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="card p-6 border-2 border-dashed border-gray-200 hover:border-secondary transition text-left group"
                >
                  <Camera className="w-8 h-8 text-secondary mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-gray-900 mb-1">Detect Disease</h4>
                  <p className="text-xs text-gray-500">Scan a leaf photo for instant diagnosis</p>
                </button>
                <div className="card p-6 border-2 border-dashed border-gray-200 hover:border-blue-400 transition text-left group">
                  <Plus className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-gray-900 mb-1">General Inquiry</h4>
                  <p className="text-xs text-gray-500">Ask any tomato farming question</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {sending && (
                <div className="flex justify-start animate-pulse">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-200 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} className="h-10" />
            </>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 md:p-6 bg-white border-t">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSendMessage} className="relative flex items-end space-x-2">
              <div className="flex-grow bg-gray-50 rounded-[2rem] border border-gray-100 p-2 shadow-sm focus-within:ring-2 focus-within:ring-secondary/20 focus-within:border-secondary transition-all">
                <div className="flex items-end">
                  <button 
                    type="button"
                    onClick={() => setShowUploadModal(true)}
                    className="p-3 text-gray-400 hover:text-secondary hover:bg-white rounded-full transition shadow-sm hover:shadow-md"
                  >
                    <Camera className="w-6 h-6" />
                  </button>
                  
                  <textarea
                    rows={1}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Describe your plant's symptoms..."
                    className="flex-grow bg-transparent border-none focus:ring-0 py-3 px-4 resize-none max-h-48 text-gray-800 placeholder-gray-400 font-medium"
                  />
                  
                  <VoiceRecorder 
                    onTranscript={(text) => setInputText(prev => prev + (prev ? ' ' : '') + text)} 
                    className="mb-0"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
                  !inputText.trim() || sending 
                  ? 'bg-gray-100 text-gray-300' 
                  : 'bg-secondary text-white hover:bg-red-600 hover:scale-105 active:scale-95 shadow-red-200'
                }`}
              >
                {sending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              </button>
            </form>
            <p className="text-[10px] text-center text-gray-400 mt-4 font-bold uppercase tracking-widest">
              AI can make mistakes. Verify critical diagnosis with local experts.
            </p>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 pb-4 flex justify-between items-center">
                <h3 className="text-2xl font-black text-gray-900">Leaf Scan</h3>
                <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="p-8 pt-0">
                <ImageUploader onCapture={handleImageCapture} isProcessing={isDetecting} />
                
                {isDetecting && (
                  <div className="mt-8 text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                       <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                       <span className="font-black text-secondary uppercase tracking-widest text-sm">Processing Neural Analysis...</span>
                    </div>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto">Our AI is scanning for patterns associated with 10 different tomato diseases common in Rwanda.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewChat;
