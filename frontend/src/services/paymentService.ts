import api from './api';
import { Payment } from '../types';

export const paymentService = {
  submitPayment: async (formData: FormData) => {
    const response = await api.post('/payments/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getMyPayments: async () => {
    const response = await api.get<Payment[]>('/payments/my-payments');
    return response.data;
  },
};
