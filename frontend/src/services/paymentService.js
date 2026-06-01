import api from './api';

export const paymentService = {
  getAllPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  recordPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  updatePaymentStatus: async (id, status, extraFields = {}) => {
    const response = await api.put(`/payments/${id}`, { status, ...extraFields });
    return response.data;
  }
};
