import Link from 'next/link';
import Image from 'next/image';
import { Truck, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 relative">
                <Image
                  src="/logo.png"
                  alt="LoadING Logo"
                  width={64}
                  height={64}
                  className="rounded-lg"
                  priority
                />
              </div>
              <span className="text-2xl font-bold text-white">LoadING</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Nakliyat sektörünün dijital buluşma noktası. Güvenilir, hızlı ve kolay.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hızlı Bağlantılar</h4>
            <div className="space-y-2 text-sm">
              <Link href="/jobs" className="block hover:text-blue-400 transition">
                İş İlanları
              </Link>
              <Link href="/companies" className="block hover:text-blue-400 transition">
                Şirketler
              </Link>
              <Link href="/drivers" className="block hover:text-blue-400 transition">
                Şoförler
              </Link>
              <Link href="/about" className="block hover:text-blue-400 transition">
                Hakkımızda
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Destek</h4>
            <div className="space-y-2 text-sm">
              <Link href="/support" className="block hover:text-blue-400 transition">
                Yardım Merkezi
              </Link>
              <Link href="/about" className="block hover:text-blue-400 transition">
                Hakkımızda
              </Link>
              <Link href="/support" className="block hover:text-blue-400 transition">
                İletişim
              </Link>
              <Link href="/jobs" className="block hover:text-blue-400 transition">
                İş İlanları
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">İletişim</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>info@loading.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+90 (212) 555 0123</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5" />
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © 2025 LoadING. Tüm hakları saklıdır.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/about" className="hover:text-blue-400 transition">
                Hakkımızda
              </Link>
              <Link href="/support" className="hover:text-blue-400 transition">
                Destek
              </Link>
              <Link href="/jobs" className="hover:text-blue-400 transition">
                İş İlanları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}