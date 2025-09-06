import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import Button from '../components/UI/Button';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProducts({ limit: 6 });
      setFeaturedProducts(response);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Custom SVG Icons
  const SearchIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  const ShieldIcon = () => (
    <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );

  const LeafIcon = ({ className = "w-8 h-8 text-primary-600" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-teal-100 text-gray-900 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 opacity-10">
          <LeafIcon className="w-96 h-96 text-emerald-600" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sustainable Shopping Made Simple
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-emerald-800 max-w-3xl mx-auto">
              Discover eco-friendly products from our community. Buy, sell, and trade 
              sustainable items while making a positive impact on the environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-emerald-200 transition-all">
                  <SearchIcon />
                  Browse Products
                </Button>
              </Link>
              <Link to="/add-product">
                <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
                  Sell Your Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EcoFind?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're committed to making sustainable living accessible and affordable for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-emerald-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <LeafIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Eco-Friendly</h3>
              <p className="text-gray-600">
                All products are verified for their environmental impact and sustainability credentials.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-green-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UsersIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600">
                Connect with like-minded individuals who share your passion for sustainable living.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-blue-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Safe & Secure</h3>
              <p className="text-gray-600">
                Secure transactions and verified sellers ensure a safe shopping experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Discover amazing eco-friendly products from our community
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                  <Link to={`/products/${product._id}`}>
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
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-emerald-600">
                          {formatPrice(product.price)}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" className="inline-flex items-center bg-emerald-600 text-white hover:bg-emerald-700">
                View All Products
                <ArrowRightIcon />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Sustainable Journey?
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of eco-conscious individuals who are making a difference 
            through sustainable shopping and selling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg">
                Get Started Free
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Stats */}
      <section className="bg-gradient-to-r from-emerald-700 to-teal-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-emerald-300 mb-2">1000+</div>
              <div className="text-emerald-100">Products Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-300 mb-2">500+</div>
              <div className="text-emerald-100">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-300 mb-2">50+</div>
              <div className="text-emerald-100">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-300 mb-2">100%</div>
              <div className="text-emerald-100">Eco-Friendly</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;