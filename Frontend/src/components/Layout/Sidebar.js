import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Home, 
  Briefcase, 
  Truck, 
  MessageCircle, 
  User, 
  Settings, 
  LogOut,
  Plus,
  FileText,
  HelpCircle,
  Phone
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated, logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Ana Sayfa', path: '/' },
    { icon: Briefcase, label: 'İş İlanları', path: '/jobs' },
    { icon: Truck, label: 'Araçlarım', path: '/vehicles' },
    { icon: MessageCircle, label: 'Mesajlar', path: '/messages' },
    { icon: User, label: 'Profilim', path: '/profile' },
    { icon: Plus, label: 'İlan Ver', path: '/create-job' },
    { icon: FileText, label: 'Sözleşmelerim', path: '/contracts' },
    { icon: Settings, label: 'Ayarlar', path: '/settings' },
    { icon: HelpCircle, label: 'Yardım', path: '/help' },
    { icon: Phone, label: 'İletişim', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Menü</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 p-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary-600 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Section */}
          <div className="border-t border-gray-200 mt-6 pt-6 px-4">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Çıkış Yap</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <span className="font-medium">Giriş Yap</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  onClick={onClose}
                >
                  <span className="font-medium">Kayıt Ol</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
