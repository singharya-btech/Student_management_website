import api from './api';

export const noticeService = {
  getAllNotices: async () => {
    const response = await api.get('/notices');
    return response.data;
  },

  createNotice: async (noticeData) => {
    const response = await api.post('/notices', noticeData);
    return response.data;
  },

  deleteNotice: async (id) => {
    const response = await api.delete(`/notices/${id}`);
    return response.data;
  }
};
