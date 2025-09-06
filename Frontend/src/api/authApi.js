import axiosInstance from '../utils/axiosInstance';

export const authApi = {
  // Register user
  registerUser: async (userData) => {
    const formData = new FormData();
    formData.append('username', userData.username);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('location', userData.location || '');
    if (userData.profilePic) {
      formData.append('profilePic', userData.profilePic);
    }

    const response = await axiosInstance.post('/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Login user
  loginUser: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const formData = new FormData();
    if (userData.username) formData.append('username', userData.username);
    if (userData.email) formData.append('email', userData.email);
    if (userData.location) formData.append('location', userData.location);
    if (userData.password) formData.append('password', userData.password);
    if (userData.profilePic) {
      formData.append('profilePic', userData.profilePic);
    }

    const response = await axiosInstance.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};