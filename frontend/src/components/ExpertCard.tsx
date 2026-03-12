import React from 'react';
import { MessageSquare, Mail, Phone } from 'lucide-react';
import { Expert } from '../types';

interface ExpertCardProps {
  expert: Expert;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  return (
    <div className="card flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-red-50 p-1">
        <img 
          src={expert.photo ? `/api/${expert.photo}` : `https://ui-avatars.com/api/?name=${expert.full_name}&background=FF6347&color=fff`} 
          alt={expert.full_name} 
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-1">{expert.full_name}</h3>
      <p className="text-secondary font-medium text-sm mb-4">{expert.specialization}</p>
      <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">
        {expert.description}
      </p>
      
      <div className="w-full grid grid-cols-3 gap-2">
        <a 
          href={`https://wa.me/${expert.whatsapp.replace(/\+/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition"
          title="WhatsApp"
        >
          <MessageSquare className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold uppercase">WhatsApp</span>
        </a>
        <a 
          href={`mailto:${expert.email}`} 
          className="flex flex-col items-center justify-center p-3 bg-red-50 text-secondary rounded-xl hover:bg-red-100 transition"
          title="Email"
        >
          <Mail className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold uppercase">Email</span>
        </a>
        <a 
          href={`tel:${expert.phone}`} 
          className="flex flex-col items-center justify-center p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition"
          title="Call"
        >
          <Phone className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold uppercase">Call</span>
        </a>
      </div>
    </div>
  );
};

export default ExpertCard;
