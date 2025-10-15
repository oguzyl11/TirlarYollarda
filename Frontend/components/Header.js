'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, Menu, X, User, LogOut, Bell, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TırlarYollarda</span>
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
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 hover:text-blue-600 transition rounded-lg hover:bg-gray-100"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <>
                <button className="p-2 text-gray-600 hover:text-blue-600 transition rounded-lg hover:bg-gray-100 relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="hidden md:flex items-center space-x-3">
                  <Link href="/profile" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
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