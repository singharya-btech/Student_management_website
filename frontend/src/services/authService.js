import api from './api';

export const authService = {
  login: async (email, password, role) => {
    const response = await api.post('/auth/login', { email, password, role });
    if (response.data && response.data.token) {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (email, password, role, name, phone, department, semester, gpa) => {
    const response = await api.post('/auth/register', { 
      email, 
      password, 
      role: role || 'Student',
      name,
      phone,
      department,
      semester: Number(semester),
      gpa: Number(gpa)
    });
    if (response.data && response.data.token) {
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!sessionStorage.getItem('token');
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
