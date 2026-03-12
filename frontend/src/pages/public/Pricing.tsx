import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, Zap, Clock, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Pricing: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Free Trial',
      price: '0',
      duration: '15 Days',
      features: ['10 Images / Day', 'AI Chatbot Support', 'Expert Directory Access', 'Basic Notifications'],
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-gray-100',
      textColor: 'text-gray-900',
      buttonVariant: 'btn-outline',
      id: 'trial'
    },
    {
      name: 'Daily',
      price: '1,000',
      duration: '1 Day',
      features: ['Unlimited Images', 'Priority AI Chatbot', 'Expert Support', 'Instant Notifications'],
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-red-50',
      textColor: 'text-secondary',
      buttonVariant: 'btn-primary',
      id: 'daily'
    },
    {
      name: 'Weekly',
      price: '5,000',
      duration: '7 Days',
      features: ['Unlimited Images', 'Priority AI Chatbot', 'Expert Support', 'Instant Notifications', 'Export Reports'],
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-red-100',
      textColor: 'text-secondary',
      buttonVariant: 'btn-primary',
      recommended: true,
      id: 'weekly'
    },
    {
      name: 'Monthly',
      price: '15,000',
      duration: '30 Days',
      features: ['Unlimited Images', 'Priority AI Chatbot', 'Expert Support', 'Full History Access', 'Season Analytics'],
      icon: <Shield className="w-6 h-6" />,
      color: 'bg-red-600',
      textColor: 'text-white',
      buttonVariant: 'bg-white text-secondary hover:bg-gray-100',
      id: 'monthly'
    }
  ];

  const handleSubscribe = (planId: string) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/pricing', plan: planId } });
    } else {
      navigate('/dashboard/payment', { state: { plan: planId } });
    }
  };

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Choose Your Plan</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-16">
          Affordable pricing options to help you protect your tomato farm throughout the season.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative rounded-3xl p-8 border ${plan.recommended ? 'border-secondary shadow-xl scale-105 z-10' : 'border-gray-200 shadow-sm'} flex flex-col`}
            >
              {plan.recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold">
                  Recommended
                </div>
              )}
              
              <div className={`w-12 h-12 ${plan.color} ${plan.textColor} rounded-2xl flex items-center justify-center mb-6`}>
                {plan.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-gray-500 ml-1 font-medium">RWF / {plan.duration}</span>
              </div>
              
              <ul className="space-y-4 mb-10 flex-grow text-left">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition duration-300 ${
                  plan.buttonVariant.includes('btn-') ? plan.buttonVariant : `flex items-center justify-center ${plan.buttonVariant}`
                }`}
              >
                {plan.id === 'trial' ? 'Get Started' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
