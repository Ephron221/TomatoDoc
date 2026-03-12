export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: 'farmer' | 'admin';
  is_verified: boolean;
  created_at: string;
}

export interface Subscription {
  id: number;
  user_id: number;
  plan: 'trial' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
  start_date: string;
  end_date: string;
  is_active: boolean;
  images_used_today: number;
  last_image_date: string;
}

export interface Payment {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
  plan: string;
  amount: number;
  payment_method: 'mobile_money' | 'bank';
  proof_file: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  approved_at?: string;
}

export interface ChatSession {
  id: number;
  user_id: number;
  title: string;
  language: 'en' | 'rw';
  created_at: string;
}

export interface ChatMessage {
  id: number;
  session_id: number;
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
  confidence_score?: number;
}

export interface Expert {
  id: number;
  full_name: string;
  photo: string;
  description: string;
  email: string;
  whatsapp: string;
  phone: string;
  specialization: string;
}

export interface Notification {
  id: number;
  target: 'admin' | 'user';
  user_id?: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
