import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createOrGetChat } = useChat();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProductById(id);
      setProduct(response);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChatWithSeller = async () => {
    if (!user) {
      toast.error('Please login to chat with seller');
      navigate('/login');
      return;
    }

    if (user._id === product.seller._id) {
      toast.error('You cannot chat with yourself');
      return;
    }

    try {
      await createOrGetChat(product.seller._id, product._id);
      navigate('/chats');
    } catch (error) {
      toast.error('Failed to start chat');
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Custom SVG Icons
  const ArrowLeftIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );

  const HeartIcon = ({ className = "w-5 h-5", filled = false }) => (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  const ShareIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );

  const MapPinIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  const UserIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  const MessageCircleIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );

  const LeafIcon = ({ className = "w-12 h-12" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LeafIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <Link to="/products">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Back to Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-emerald-700 hover:text-emerald-800 mb-6 transition-colors"
        >
          <ArrowLeftIcon className="mr-2" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div>
              <div className="aspect-w-1 aspect-h-1 mb-4">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.title}
                    className="w-full h-96 object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-96 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <LeafIcon className="w-16 h-16 text-emerald-400" />
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden transition-all ${
                        selectedImage === index ? 'ring-2 ring-emerald-500 scale-105' : 'hover:ring-1 hover:ring-emerald-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                      {product.category}
                    </span>
                    {product.isSold && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Sold
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full transition-colors ${
                      isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                  >
                    <HeartIcon filled={isLiked} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <ShareIcon />
                  </button>
                </div>
              </div>

              <div className="text-4xl font-bold text-emerald-600 mb-6">
                {formatPrice(product.price)}
              </div>

              <div className="prose max-w-none mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-emerald-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Seller Info */}
              <div className="border-t border-emerald-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
                <div className="flex items-center space-x-4">
                  {product.seller.profilePic ? (
                    <img
                      src={product.seller.profilePic}
                      alt={product.seller.username}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-100"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-200">
                      <UserIcon className="w-6 h-6 text-emerald-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{product.seller.username}</p>
                    <div className="flex items-center text-sm text-emerald-700">
                      <MapPinIcon className="mr-1" />
                      <span>{product.seller.location || 'Location not specified'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                {user && user._id !== product.seller._id && !product.isSold && (
                  <Button
                    onClick={handleChatWithSeller}
                    className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl"
                    size="lg"
                  >
                    <MessageCircleIcon className="mr-2" />
                    Chat with Seller
                  </Button>
                )}

                {user && user._id === product.seller._id && (
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigate(`/products/${product._id}/edit`)}
                      className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      variant="outline"
                    >
                      Edit Product
                    </Button>
                    <Button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this product?')) {
                          // Handle delete
                          toast.success('Product deleted');
                          navigate('/products');
                        }
                      }}
                      className="w-full bg-red-100 text-red-700 hover:bg-red-200 border-red-200"
                    >
                      Delete Product
                    </Button>
                  </div>
                )}

                {!user && (
                  <div className="text-center">
                    <p className="text-emerald-700 mb-4">
                      Please login to chat with the seller
                    </p>
                    <div className="flex space-x-4">
                      <Link to="/login" className="flex-1">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Login</Button>
                      </Link>
                      <Link to="/register" className="flex-1">
                        <Button className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50" variant="outline">Register</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="border-t border-emerald-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="font-medium text-emerald-700">Category</dt>
                    <dd className="text-gray-900">{product.category}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-emerald-700">Listed on</dt>
                    <dd className="text-gray-900">{formatDate(product.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-emerald-700">Condition</dt>
                    <dd className="text-gray-900">Used</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-emerald-700">Status</dt>
                    <dd className="text-gray-900">
                      {product.isSold ? 'Sold' : 'Available'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;