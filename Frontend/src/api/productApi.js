import axiosInstance from '../utils/axiosInstance';

export const productApi = {
  // Get all products
  getProducts: async (params = {}) => {
    const response = await axiosInstance.get('/products', { params });
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData) => {
    const formData = new FormData();
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await axiosInstance.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update product
  updateProduct: async (id, productData) => {
    const formData = new FormData();
    if (productData.title) formData.append('title', productData.title);
    if (productData.description) formData.append('description', productData.description);
    if (productData.price) formData.append('price', productData.price);
    if (productData.category) formData.append('category', productData.category);
    if (productData.image) {
      formData.append('image', productData.image);
    }

    const response = await axiosInstance.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },
};