import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { productApi } from '../../api/productApi';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    location: '',
    profilePic: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        location: user.location || '',
        profilePic: null,
      });
      setPreview(user.profilePic || null);
      fetchUserProducts();
    }
  }, [user]);

  const fetchUserProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProducts({ seller: user._id });
      setUserProducts(response);
    } catch (error) {
      console.error('Error fetching user products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profilePic' && files[0]) {
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
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || '',
      email: user.email || '',
      location: user.location || '',
      profilePic: null,
    });
    setPreview(user.profilePic || null);
    setIsEditing(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Custom SVG Icons
  const UserIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const EditIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const SaveIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );

  const CloseIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );

  const UploadIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );

  const MapPinIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  const MailIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );

  const CalendarIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  const PackageIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );

  const ShoppingBagIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );

  const LeafIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Please login to view profile</h1>
            <p className="text-emerald-700">You need to be logged in to access your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Eco Profile</h1>
          <p className="text-emerald-700">Manage your account and view your sustainable activity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="relative inline-block mb-4">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-emerald-100"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-200">
                      <UserIcon className="w-12 h-12 text-emerald-600" />
                    </div>
                  )}
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-2 cursor-pointer hover:bg-emerald-700 transition-colors shadow-md">
                      <UploadIcon />
                      <input
                        type="file"
                        name="profilePic"
                        onChange={handleChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* User Info */}
                {isEditing ? (
                  <div className="space-y-4">
                    <Input
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                    <Input
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter location"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                    <div className="flex items-center justify-center text-emerald-700">
                      <MailIcon className="mr-2" />
                      <span>{user.email}</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center justify-center text-emerald-700">
                        <MapPinIcon className="mr-2" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-center text-emerald-700">
                      <CalendarIcon className="mr-2" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 space-y-2">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        loading={loading}
                        disabled={loading}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      >
                        <SaveIcon className="mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <CloseIcon className="mr-2" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      <EditIcon className="mr-2" />
                      Edit Profile
                    </Button>
                  )}
                  
                  <Button
                    onClick={logout}
                    variant="danger"
                    className="w-full bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PackageIcon className="text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {userProducts.length}
                </h3>
                <p className="text-emerald-700">Products Listed</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-emerald-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBagIcon className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {user.purchaseHistory?.length || 0}
                </h3>
                <p className="text-emerald-700">Items Purchased</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-emerald-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LeafIcon className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {user.cart?.length || 0}
                </h3>
                <p className="text-emerald-700">Items in Cart</p>
              </div>
            </div>

            {/* My Products */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">My Sustainable Products</h3>
                <Button 
                  onClick={() => window.location.href = '/add-product'}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Add Product
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                </div>
              ) : userProducts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PackageIcon className="text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No products yet</h4>
                  <p className="text-emerald-700 mb-4">Start your sustainable journey by adding your first product</p>
                  <Button 
                    onClick={() => window.location.href = '/add-product'}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Add Your First Product
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userProducts.map((product) => (
                    <div key={product._id} className="border border-emerald-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow bg-white">
                      <div className="aspect-w-16 aspect-h-12">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-emerald-100 flex items-center justify-center">
                            <LeafIcon className="w-12 h-12 text-emerald-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.title}
                        </h4>
                        <p className="text-emerald-700 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-emerald-600">
                            ${product.price}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.isSold 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product.isSold ? 'Sold' : 'Available'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;