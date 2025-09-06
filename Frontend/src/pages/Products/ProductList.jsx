import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/productApi';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');

  const categories = ['All', 'Clothing', 'Electronics', 'Furniture', 'Books', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        sort: sortBy,
      };
      
      const response = await productApi.getProducts(params);
      setProducts(response);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === 'All' ? '' : category);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Custom SVG Icons
  const SearchIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );

  const GridIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );

  const ListIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );

  const MapPinIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  const LeafIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-emerald-100">
      <Link to={`/products/${product._id}`}>
        <div className="aspect-w-16 aspect-h-12">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-emerald-50 flex items-center justify-center">
              <LeafIcon className="text-emerald-300" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.title}
          </h3>
          <p className="text-emerald-700 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-emerald-600">
              {formatPrice(product.price)}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              {product.category}
            </span>
          </div>
          <div className="mt-3 flex items-center text-sm text-emerald-600">
            <MapPinIcon className="mr-1" />
            <span>{product.seller?.location || 'Location not specified'}</span>
          </div>
        </div>
      </Link>
    </div>
  );

  const ProductListItem = ({ product }) => (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition-all duration-300 border border-emerald-100">
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
          ) : (
            <div className="w-20 h-20 bg-emerald-50 rounded-lg flex items-center justify-center">
              <LeafIcon className="w-6 h-6 text-emerald-300" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Link to={`/products/${product._id}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
              {product.title}
            </h3>
          </Link>
          <p className="text-emerald-700 text-sm mt-1 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-lg font-bold text-emerald-600">
              {formatPrice(product.price)}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              {product.category}
            </span>
            <div className="flex items-center text-sm text-emerald-600">
              <MapPinIcon className="mr-1" />
              <span>{product.seller?.location || 'Location not specified'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sustainable Marketplace</h1>
          <p className="text-emerald-700">Discover eco-friendly products from our community</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-emerald-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400">
                  <SearchIcon />
                </div>
                <Input
                  type="text"
                  placeholder="Search sustainable products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 border-emerald-200 focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedCategory === (category === 'All' ? '' : category)
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort and View */}
            <div className="flex items-center space-x-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="flex border border-emerald-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <GridIcon />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-emerald-600 text-white' 
                      : 'text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <ListIcon />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sustainable products found</h3>
            <p className="text-emerald-700 mb-4">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to list an eco-friendly product!'}
            </p>
            <Link to="/add-product">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-sm py-2">
                Add Sustainable Product
              </Button>
            </Link>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
              : 'space-y-4'
          }>
            {products.map((product) => (
              viewMode === 'grid' ? (
                <ProductCard key={product._id} product={product} />
              ) : (
                <ProductListItem key={product._id} product={product} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;