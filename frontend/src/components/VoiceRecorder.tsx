import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoice } from '../hooks/useVoice';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
  className?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscript, className = '' }) => {
  const { isRecording, startListening, stopListening } = useVoice();
  const [pulse, setPulse] = useState(1);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setPulse(p => (p === 1 ? 1.2 : 1));
      }, 500);
    } else {
      setPulse(1);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopListening();
    } else {
      startListening(onTranscript);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleToggle}
        className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
          isRecording 
            ? 'bg-secondary text-white shadow-lg shadow-red-200' 
            : 'text-gray-400 hover:text-secondary hover:bg-red-50'
        }`}
        title={isRecording ? 'Stop Recording' : 'Start Voice Input'}
      >
        <motion.div
          animate={{ scale: pulse }}
          transition={{ duration: 0.5 }}
        >
          {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </motion.div>
      </button>

      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center whitespace-nowrap shadow-xl"
          >
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
            Listening... Speak now
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceRecorder;
