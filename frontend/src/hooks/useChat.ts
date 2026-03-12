import { useState, useCallback } from 'react';
import { chatService } from '../services/chatService';
import { ChatMessage, ChatSession } from '../types';
import { toast } from 'sonner';

export const useChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await chatService.getSessions();
      setSessions(data);
    } catch (err) {
      toast.error('Failed to load chat history');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (sessionId: string | number) => {
    setLoading(true);
    try {
      const data = await chatService.getMessages(sessionId);
      setMessages(data);
    } catch (err) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (sessionId: string | number, content: string, type: string = 'text') => {
    setSending(true);
    try {
      await chatService.sendMessage(sessionId, content, type);
      const updatedMessages = await chatService.getMessages(sessionId);
      setMessages(updatedMessages);
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  }, []);

  return {
    sessions,
    messages,
    loading,
    sending,
    fetchSessions,
    fetchMessages,
    sendMessage,
    setMessages
  };
};
