import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/ImageUploader';
import { detectionService } from '../../services/detectionService';
import { chatService } from '../../services/chatService';
import { toast } from 'sonner';
import { 
  ChevronLeft, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Activity, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageDetection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleCapture = (file: File) => {
    setImageFile(file);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      toast.error('Please upload or capture an image first');
      return;
    }

    setLoading(true);
    try {
      // 1. Create a new chat session for this detection if none exists
      // In this specific page context, we'll create a session dedicated to the detection
      const session = await chatService.createSession(`Detection: ${new Date().toLocaleString()}`, i18n.language);
      
      // 2. Perform detection
      const data = await detectionService.detect(imageFile, session.id);
      setResult(data.prediction);
      toast.success('Analysis complete!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Detection failed');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-10">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center text-gray-500 hover:text-secondary font-medium transition"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-black text-gray-900 leading-none">Leaf Diagnosis</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Powered by TomatoDoc AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-secondary" />
              Analyze Leaf
            </h2>
            <ImageUploader onCapture={handleCapture} isProcessing={loading} />
            
            <button 
              onClick={handleAnalyze}
              disabled={loading || !imageFile}
              className="btn-primary w-full py-4 text-lg mt-6 shadow-xl shadow-red-100"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing Tissue...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5 mr-2" />
                  Start Diagnosis
                </>
              )}
            </button>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
             <h4 className="text-amber-900 font-bold mb-2 flex items-center">
               <AlertCircle className="w-4 h-4 mr-2" />
               Daily Limit
             </h4>
             <p className="text-xs text-amber-800 leading-relaxed">
               Free trial users are limited to 10 detections per day. Upgrade to a premium plan for unlimited AI analysis and priority expert support.
             </p>
          </div>
        </div>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                   <Sparkles className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-lg font-bold text-gray-400">Waiting for Data</h3>
                <p className="text-sm text-gray-400 mt-2">Upload a leaf photo and click "Start Diagnosis" to see the AI analysis here.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center p-10 bg-white rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="relative w-24 h-24 mb-8">
                   <div className="absolute inset-0 border-4 border-red-100 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-secondary rounded-full border-t-transparent animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
                   </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Scanning Image</h3>
                <p className="text-gray-500 text-sm mt-2">Our AI is identifying disease patterns...</p>
                <div className="w-full max-w-xs mt-8 space-y-2">
                   <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="h-full bg-secondary"
                      />
                   </div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase text-center">Processing Neural Network</p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card border-t-8 border-t-secondary h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getSeverityColor(result.severity)}`}>
                    {result.severity} Severity
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Confidence</p>
                    <p className="text-lg font-black text-secondary">{Math.round(result.confidence * 100)}%</p>
                  </div>
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">
                  {result.disease}
                </h2>

                <div className="space-y-6 flex-grow">
                  <section>
                    <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                      <Info className="w-3.5 h-3.5 mr-1.5" />
                      Diagnosis
                    </div>
                    <p className="text-gray-600 leading-relaxed italic">
                      "{result.diagnosis}"
                    </p>
                  </section>

                  <section className="bg-red-50 p-5 rounded-2xl border border-red-100">
                    <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Likely Causes</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.causes}</p>
                  </section>

                  <section className="bg-green-50 p-5 rounded-2xl border border-green-100">
                    <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest mb-2">Prevention & Treatment</h4>
                    <p className="text-sm text-green-800 leading-relaxed font-medium">{result.prevention}</p>
                  </section>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <button 
                    onClick={() => navigate('/dashboard/chats')}
                    className="text-gray-500 font-bold text-sm hover:text-secondary flex items-center"
                  >
                    View in Chat <ArrowRight className="ml-1.5 w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard/experts')}
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition"
                  >
                    Ask an Expert
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ImageDetection;
