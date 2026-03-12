import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Subscription } from '../types';
import { useAuth } from '../context/AuthContext';

export const useSubscription = () => {
  const { isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await api.get('/api/subscriptions/my-subscription');
      setSubscription(res.data);
    } catch (err) {
      console.error('Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const isLimitReached = () => {
    if (!subscription) return true;
    if (subscription.plan === 'trial') {
      return subscription.images_used_today >= 10;
    }
    return false; // Paid plans have no limits in this business logic
  };

  const daysRemaining = () => {
    if (!subscription) return 0;
    const end = new Date(subscription.end_date);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return {
    subscription,
    loading,
    fetchSubscription,
    isLimitReached,
    daysRemaining: daysRemaining()
  };
};
