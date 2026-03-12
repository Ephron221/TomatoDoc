import api from './api';
import { ChatSession, ChatMessage } from '../types';

export const chatService = {
  getSessions: async () => {
    const response = await api.get<ChatSession[]>('/chat/sessions');
    return response.data;
  },
  createSession: async (title: string, language: string) => {
    const response = await api.post<ChatSession>('/chat/sessions', { title, language });
    return response.data;
  },
  deleteSession: async (id: number) => {
    const response = await api.delete(`/chat/sessions/${id}`);
    return response.data;
  },
  getMessages: async (sessionId: string | number) => {
    const response = await api.get<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`);
    return response.data;
  },
  sendMessage: async (sessionId: string | number, message: string, message_type: string = 'text') => {
    const response = await api.post('/chat/messages', { sessionId, message, message_type });
    return response.data;
  }
};
