import React from 'react';
import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  duration: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  textColor: string;
  buttonVariant: string;
  recommended?: boolean;
  onSubscribe: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  duration,
  features,
  icon,
  color,
  textColor,
  buttonVariant,
  recommended,
  onSubscribe
}) => {
  return (
    <div 
      className={`relative rounded-3xl p-8 border flex flex-col transition-all duration-300 ${
        recommended ? 'border-secondary shadow-xl scale-105 z-10 bg-white' : 'border-gray-200 shadow-sm bg-white hover:shadow-md'
      }`}
    >
      {recommended && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap">
          Most Popular
        </div>
      )}
      
      <div className={`w-12 h-12 ${color} ${textColor} rounded-2xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-extrabold">{price}</span>
        <span className="text-gray-500 ml-1 font-medium">RWF / {duration}</span>
      </div>
      
      <ul className="space-y-4 mb-10 flex-grow text-left">
        {features.map((feature, fIndex) => (
          <li key={fIndex} className="flex items-start">
            <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-gray-600 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        onClick={onSubscribe}
        className={`w-full py-4 rounded-xl font-bold text-lg transition duration-300 flex items-center justify-center ${
          buttonVariant.includes('btn-') ? buttonVariant : buttonVariant
        }`}
      >
        {name === 'Free Trial' ? 'Get Started' : 'Subscribe Now'}
      </button>
    </div>
  );
};

export default PricingCard;
