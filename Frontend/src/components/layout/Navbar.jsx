import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiMenu, FiX, FiUser, FiLogOut, FiShoppingBag, FiMessageCircle, FiPlus } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: null },
    { path: '/products', label: 'Products', icon: null },
  ];

  if (user) {
    navItems.push(
      { path: '/add-product', label: 'Add Product', icon: <FiPlus className="w-4 h-4" /> },
      { path: '/chats', label: 'Messages', icon: <FiMessageCircle className="w-4 h-4" /> }
    );
  }

  return (
    <nav className="bg-white shadow-lg border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">EcoFind</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-secondary-700 hover:text-primary-600 hover:bg-secondary-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-secondary-300 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{user.username}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-secondary-200">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiUser className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                    >
                      <FiLogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-secondary-700 hover:text-primary-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-secondary-700 hover:text-primary-600"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-secondary-200">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-secondary-700 hover:text-primary-600 hover:bg-secondary-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {user ? (
                <div className="pt-4 border-t border-secondary-200">
                  <div className="flex items-center px-3 py-2">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-secondary-300 rounded-full flex items-center justify-center mr-3">
                        <FiUser className="w-4 h-4" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-secondary-700">{user.username}</span>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-secondary-200 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;