import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus, CreditCard, Camera, MessageCircle, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <UserPlus className="w-10 h-10" />,
      title: "Step 1: Register",
      description: "Create your account and verify your email via the 6-digit OTP sent to you."
    },
    {
      icon: <CreditCard className="w-10 h-10" />,
      title: "Step 2: Choose a Plan",
      description: "Start with a 15-day free trial or choose a daily, weekly, or monthly plan."
    },
    {
      icon: <Camera className="w-10 h-10" />,
      title: "Step 3: Capture/Upload Image",
      description: "Take a photo of the affected tomato leaf or upload an existing image from your gallery."
    },
    {
      icon: <MessageCircle className="w-10 h-10" />,
      title: "Step 4: Get AI Diagnosis",
      description: "Our AI analyzes the image and provides instant diagnosis, severity, causes, and treatment."
    },
    {
      icon: <UserCheck className="w-10 h-10" />,
      title: "Step 5: Connect with Experts",
      description: "If you need more help, connect directly with agricultural experts via WhatsApp, Email, or Phone."
    }
  ];

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">How TomatoDoc Works</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            A simple 5-step process to protect your tomato crops using advanced AI technology.
          </p>
        </div>

        <div className="space-y-12 relative">
          {/* Vertical line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 -translate-x-1/2"></div>
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 w-full md:w-1/2 p-4">
                <div className={`card ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}>
                  <div className="text-secondary mb-4">{step.icon}</div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
              
              <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-secondary text-white font-bold text-lg z-10 my-6 md:my-0">
                {index + 1}
              </div>
              
              <div className="flex-1 hidden md:block w-1/2"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
