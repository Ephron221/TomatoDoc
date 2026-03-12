import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploaderProps {
  onCapture: (file: File) => void;
  isProcessing?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onCapture, isProcessing = false }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
      onCapture(file);
    }
  };

  const startCamera = async () => {
    setMode('camera');
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPreview(dataUrl);
      
      // Convert to file
      fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          onCapture(file);
          stopCamera();
        });
    }
  };

  return (
    <div className="w-full">
      <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
        <button 
          onClick={() => { setMode('upload'); stopCamera(); }}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${mode === 'upload' ? 'bg-white shadow-sm text-secondary' : 'text-gray-500'}`}
        >
          Upload Photo
        </button>
        <button 
          onClick={startCamera}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${mode === 'camera' ? 'bg-white shadow-sm text-secondary' : 'text-gray-500'}`}
        >
          Take Photo
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'upload' ? (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center hover:border-secondary transition cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <div className="relative w-full aspect-square max-h-64 rounded-2xl overflow-hidden shadow-lg">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-50 text-secondary rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary group-hover:text-white transition">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="text-gray-500 font-medium">Click or drag photo here</p>
                <p className="text-xs text-gray-400 mt-2">Supports JPG, PNG (Max 5MB)</p>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-3xl overflow-hidden bg-black aspect-square max-h-80 flex items-center justify-center shadow-2xl"
          >
            {preview && !isCameraActive ? (
              <img src={preview} alt="Captured" className="w-full h-full object-cover" />
            ) : (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            )}
            
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
              {isCameraActive ? (
                <button 
                  onClick={takePhoto}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-gray-200 active:scale-90 transition"
                >
                  <div className="w-12 h-12 bg-secondary rounded-full"></div>
                </button>
              ) : (
                <button 
                  onClick={startCamera}
                  className="bg-white text-secondary px-6 py-2 rounded-full font-bold shadow-lg"
                >
                  Retake
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8">
        <div className="bg-blue-50 p-4 rounded-2xl flex items-start mb-6">
          <AlertCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
          <p className="text-blue-800 text-xs leading-relaxed">
            Ensure the tomato leaf is centered, well-lit, and the affected areas are clearly visible for the AI to provide an accurate diagnosis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
