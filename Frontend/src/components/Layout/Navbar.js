import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Truck, User, LogOut, Plus, Heart, Bell } from 'lucide-react';

const Navbar = ({ onSidebarToggle, onNotificationsToggle, onFavoritesToggle }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Side - Hamburger Menu + Logo */}
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu Button */}
            <button
              onClick={onSidebarToggle}
              className="text-gray-600 hover:text-primary-600 p-2 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">TIRLAR YOLLARDA</span>
            </Link>
          </div>

          {/* Center - Truck Logo */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Truck className="h-12 w-12 text-primary-600" />
              <div className="absolute -bottom-1 -right-1 w-6 h-4 bg-primary-600 rounded-sm"></div>
            </div>
          </div>

          {/* Right Side - Icons */}
          <div className="flex items-center space-x-4">
            {/* Favorites */}
            <button
              onClick={onFavoritesToggle}
              className="text-gray-600 hover:text-primary-600 p-2 transition-colors"
            >
              <Heart className="h-6 w-6" />
            </button>

            {/* Notifications */}
            <button
              onClick={onNotificationsToggle}
              className="text-gray-600 hover:text-primary-600 p-2 transition-colors relative"
            >
              <Bell className="h-6 w-6" />
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile */}
            <button
              onClick={handleProfileClick}
              className="text-gray-600 hover:text-primary-600 p-2 transition-colors"
            >
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

