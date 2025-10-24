'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Truck, Menu, X, User, LogOut, Bell } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import useNotificationStore from '../store/notificationStore';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { notifications, unreadCount, loadNotifications, markAsRead, startPolling, stopPolling } = useNotificationStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
      startPolling();
    } else {
      stopPolling();
    }
    
    return () => {
      stopPolling();
    };
  }, [isAuthenticated, user, loadNotifications, startPolling, stopPolling]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-dropdown')) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
      scrolled ? 'shadow-md' : 'border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-20 h-20 relative">
              <Image
                src="/logo.png"
                alt="LoadING Logo"
                width={80}
                height={80}
                className="rounded-lg"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium transition">
              İlanlar
            </Link>
            <Link href="/companies" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Şirketler
            </Link>
            <Link href="/drivers" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Şoförler
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Hakkımızda
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Destek
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notification Button */}
                <div className="relative notification-dropdown">
                  <button 
                    onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition rounded-lg hover:bg-gray-100 relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotificationDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
                          {unreadCount > 0 && (
                            <span className="text-sm text-gray-500">{unreadCount} okunmamış</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>Henüz bildirim yok</p>
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notification) => (
                            <div
                              key={notification._id}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => {
                                if (!notification.read) {
                                  markAsRead(notification._id);
                                }
                                setShowNotificationDropdown(false);
                              }}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  notification.priority === 'high' ? 'bg-red-500' :
                                  notification.priority === 'medium' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-2">
                                    {new Date(notification.createdAt).toLocaleString('tr-TR')}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      
                      {notifications.length > 0 && (
                        <div className="p-4 border-t border-gray-200">
                          <Link
                            href="/notifications"
                            className="block w-full text-center text-blue-600 hover:text-blue-700 font-medium"
                            onClick={() => setShowNotificationDropdown(false)}
                          >
                            Tüm Bildirimleri Gör
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="hidden md:flex items-center space-x-3">
                  <Link href="/dashboard" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.profile?.firstName}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-600 hover:text-red-600 transition rounded-lg hover:bg-gray-100"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Giriş Yap
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
                  Kayıt Ol
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link href="/jobs" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                İlanlar
              </Link>
              <Link href="/companies" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                Şirketler
              </Link>
              <Link href="/drivers" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                Şoförler
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                Hakkımızda
              </Link>
              <Link href="/support" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                Destek
              </Link>
              {!isAuthenticated && (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                    Giriş Yap
                  </Link>
                  <Link href="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-center">
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}