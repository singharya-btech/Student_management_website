import api from './api';

export const attendanceService = {
  getAttendance: async (date) => {
    const response = await api.get('/attendance', { params: { date } });
    return response.data;
  },

  saveAttendance: async (date, records) => {
    const response = await api.post('/attendance', { date, records });
    return response.data;
  },

  getStudentAttendanceHistory: async (studentId) => {
    const response = await api.get(`/attendance/student/${studentId}`);
    return response.data;
  }
};
