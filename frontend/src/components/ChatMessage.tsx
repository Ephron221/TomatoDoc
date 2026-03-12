import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAI = message.sender === 'ai';

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <AlertCircle className="w-4 h-4 mr-1" />;
      case 'high': return <AlertCircle className="w-4 h-4 mr-1" />;
      case 'moderate': return <Info className="w-4 h-4 mr-1" />;
      case 'low': return <CheckCircle2 className="w-4 h-4 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm relative ${
        isAI 
          ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none' 
          : 'bg-secondary text-white rounded-tr-none'
      }`}>
        {/* Avatar/Icon for AI */}
        {isAI && (
          <div className="absolute -left-10 top-0 w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-secondary border border-red-100 hidden md:flex">
            <span className="text-sm">🤖</span>
          </div>
        )}

        {/* Image Content */}
        {message.message_type === 'image' && message.image_path && (
          <div className="mb-3 rounded-xl overflow-hidden bg-black/5">
            <img 
              src={`/api/${message.image_path}`} 
              alt="Uploaded leaf" 
              className="w-full h-auto max-h-72 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
              }}
            />
          </div>
        )}

        {/* Text Content */}
        {message.content && (
          <p className="leading-relaxed whitespace-pre-wrap text-sm md:text-base">
            {message.content}
          </p>
        )}

        {/* Voice Placeholder (if needed) */}
        {message.message_type === 'voice' && (
          <div className="flex items-center space-x-2 py-2">
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full w-1/3"></div>
            </div>
            <span className="text-[10px] opacity-70">Voice Message</span>
          </div>
        )}

        {/* Detection Results Overlay */}
        {message.disease_name && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getSeverityColor(message.severity)}`}>
                {getSeverityIcon(message.severity)}
                {message.severity} Severity
              </span>
              <span className="text-[10px] font-bold text-gray-400">
                {Math.round((message.confidence_score || 0.95) * 100)}% Match
              </span>
            </div>
            
            <h4 className="text-xl font-black text-secondary mb-3 tracking-tight">
              {message.disease_name}
            </h4>

            <div className="space-y-4">
              <section>
                <h5 className="text-xs font-bold text-gray-400 uppercase mb-1">Diagnosis</h5>
                <p className="text-sm text-gray-700 leading-relaxed">{message.diagnosis}</p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <section className="bg-orange-50/50 p-3 rounded-xl border border-orange-100">
                  <h5 className="text-[10px] font-bold text-orange-800 uppercase mb-1">Causes</h5>
                  <p className="text-xs text-orange-900 leading-relaxed">{message.possible_causes}</p>
                </section>
                <section className="bg-green-50/50 p-3 rounded-xl border border-green-100">
                  <h5 className="text-[10px] font-bold text-green-800 uppercase mb-1">Prevention</h5>
                  <p className="text-xs text-green-900 leading-relaxed">{message.prevention_tips}</p>
                </section>
              </div>
            </div>
          </div>
        )}

        <div className={`text-[10px] mt-2 font-medium ${isAI ? 'text-gray-400' : 'text-red-100'}`}>
          {format(new Date(message.created_at), 'HH:mm')}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
