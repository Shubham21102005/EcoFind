import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { productApi } from '../../api/productApi';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import toast from 'react-hot-toast';

// Custom SVG Icons
const UploadIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const CloseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const PlusIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const LeafIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7.84 19.84a10 10 0 0 1-3.47-3.17 10 10 0 0 1-1.37-9.67 10 10 0 0 1 9.67-1.37 10 10 0 0 1 3.17 3.47" />
    <path d="M8.5 15.5c.5.5 1 1 1.5 1.5s1 1 1.5 1.5" />
    <path d="M16 8c-1.5 1.5-3 3-4.5 4.5" />
    <path d="M14 14c1.5-1.5 3-3 4.5-4.5" />
    <path d="M9.5 9.5 15 15" />
    <path d="M15 9.5 9.5 15" />
  </svg>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: null,
    ecoFriendly: false,
    materials: '',
    sustainabilityInfo: ''
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = ['Clothing', 'Electronics', 'Furniture', 'Books', 'Other'];
  const materials = ['Organic Cotton', 'Bamboo', 'Recycled Materials', 'Hemp', 'Linen', 'Other'];

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'image' && files[0]) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.image) {
      newErrors.image = 'Product image is required';
    }

    if (formData.ecoFriendly && !formData.materials) {
      newErrors.materials = 'Please specify eco-friendly materials';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await productApi.createProduct(formData);
      toast.success('Product created successfully!');
      navigate('/products');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setPreview(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-emerald-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <LeafIcon className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-900 mb-4">Please login to add a product</h1>
            <p className="text-emerald-700 mb-6">Join our community of eco-conscious sellers</p>
            <div className="flex space-x-4 justify-center">
              <Button onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/register')} variant="outline">Register</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
          {/* Header with leaf pattern */}
          <div className="bg-emerald-700 py-6 px-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 L100,100" stroke="white" strokeWidth="2" />
                <path d="M100,0 L0,100" stroke="white" strokeWidth="2" />
                <path d="M20,0 L100,80" stroke="white" strokeWidth="2" />
                <path d="M0,20 L80,100" stroke="white" strokeWidth="2" />
              </svg>
            </div>
            <div className="relative z-10 flex items-center">
              <LeafIcon className="w-8 h-8 text-white mr-3" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Add Eco-Friendly Product</h1>
                <p className="text-emerald-100">List your sustainable product for our conscious community</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2 flex items-center">
                <UploadIcon className="w-4 h-4 mr-2" />
                Product Image *
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-emerald-300 rounded-xl hover:border-emerald-400 transition-colors bg-emerald-50/50">
                <div className="space-y-1 text-center">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Product preview"
                        className="mx-auto h-40 w-40 md:h-48 md:w-48 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 hover:bg-rose-600 transition-colors shadow-md"
                        aria-label="Remove image"
                      >
                        <CloseIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="mx-auto flex justify-center">
                        <div className="bg-emerald-100 p-3 rounded-full">
                          <UploadIcon className="w-8 h-8 text-emerald-600" />
                        </div>
                      </div>
                      <div className="flex text-sm text-emerald-700 justify-center mt-4">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer bg-emerald-500 text-white rounded-md font-medium px-4 py-2 hover:bg-emerald-600 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-emerald-600 mt-3">PNG, JPG, GIF up to 10MB</p>
                      <p className="text-xs text-emerald-500 mt-1">or drag and drop here</p>
                    </div>
                  )}
                </div>
              </div>
              {errors.image && (
                <p className="mt-2 text-sm text-rose-600 flex items-center">
                  <CloseIcon className="w-4 h-4 mr-1" />
                  {errors.image}
                </p>
              )}
            </div>

            {/* Product Title */}
            <Input
              label="Product Title *"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="E.g., Organic Cotton T-Shirt"
              icon={<LeafIcon className="w-4 h-4" />}
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product in detail, including its eco-friendly features..."
                className={`block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                  errors.description ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-emerald-300'
                }`}
              />
              {errors.description && (
                <p className="mt-2 text-sm text-rose-600 flex items-center">
                  <CloseIcon className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Input
                label="Price (USD) *"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="0.00"
              />

              <div>
                <label className="block text-sm font-medium text-emerald-900 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                    errors.category ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' : 'border-emerald-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-2 text-sm text-rose-600 flex items-center">
                    <CloseIcon className="w-4 h-4 mr-1" />
                    {errors.category}
                </p>
                )}
              </div>
            </div>

            {/* Eco-friendly Options */}
            <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200">
              <h3 className="text-lg font-medium text-emerald-900 mb-4 flex items-center">
                <LeafIcon className="w-5 h-5 mr-2 text-emerald-600" />
                Sustainability Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="ecoFriendly"
                      name="ecoFriendly"
                      type="checkbox"
                      checked={formData.ecoFriendly}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300 rounded"
                    />
                  </div>
                  <label htmlFor="ecoFriendly" className="ml-3 text-sm text-emerald-800">
                    This is an eco-friendly/sustainable product
                  </label>
                </div>

                {formData.ecoFriendly && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-emerald-900 mb-2">
                        Primary Sustainable Material *
                      </label>
                      <select
                        name="materials"
                        value={formData.materials}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                          errors.materials ? 'border-rose-300' : 'border-emerald-300'
                        }`}
                      >
                        <option value="">Select material</option>
                        {materials.map((material) => (
                          <option key={material} value={material}>
                            {material}
                          </option>
                        ))}
                      </select>
                      {errors.materials && (
                        <p className="mt-2 text-sm text-rose-600 flex items-center">
                          <CloseIcon className="w-4 h-4 mr-1" />
                          {errors.materials}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-emerald-900 mb-2">
                        Additional Sustainability Information
                      </label>
                      <textarea
                        name="sustainabilityInfo"
                        rows={3}
                        value={formData.sustainabilityInfo}
                        onChange={handleChange}
                        placeholder="Share details about certifications, ethical production, carbon footprint, etc."
                        className="block w-full px-4 py-3 border border-emerald-300 rounded-xl shadow-sm placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Eco-friendly Tips */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="text-sm font-medium text-amber-800 mb-3 flex items-center">
                <LeafIcon className="w-4 h-4 mr-2" />
                Eco-friendly Listing Tips
              </h3>
              <ul className="text-sm text-amber-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>Use natural lighting for product photos to reduce energy consumption</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>Mention if you use sustainable packaging materials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>Highlight any certifications (organic, fair trade, recycled content, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">•</span>
                  <span>Share the product's environmental benefits compared to conventional alternatives</span>
                </li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-reverse space-y-4 sm:space-x-4 sm:space-y-0 pt-6 border-t border-emerald-200 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/products')}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center bg-emerald-600 hover:bg-emerald-700"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Sustainable Product
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;