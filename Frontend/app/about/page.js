'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Truck, 
  Users, 
  Target, 
  Shield, 
  Heart, 
  Award, 
  CheckCircle,
  ArrowRight,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Building2,
  UserCheck
} from 'lucide-react';
import Header from '../../components/Header';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 relative mr-4">
                <Image
                  src="/logo.png"
                  alt="LoadING Logo"
                  width={96}
                  height={96}
                  className="rounded-2xl"
                  priority
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">LoadING</h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Nakliyat sektörünün dijital buluşma noktası. Şirketler ve şoförler için güvenilir, hızlı ve verimli işbirliği platformu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Hemen Başla
              </Link>
              <Link href="/jobs" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                İş İlanlarını Gör
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Türkiye'nin nakliyat sektöründe dijital dönüşümü hızlandırarak, şirketler ve şoförler arasında güvenilir köprüler kuruyoruz.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hedefimiz</h3>
              <p className="text-gray-600">
                Nakliyat sektöründe şeffaflık ve güveni artırarak, tüm paydaşlar için değer yaratmak.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Vizyonumuz</h3>
              <p className="text-gray-600">
                Türkiye'nin en büyük nakliyat ağı olarak, sektörün dijital geleceğini şekillendirmek.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Değerlerimiz</h3>
              <p className="text-gray-600">
                Güven, şeffaflık, kalite ve müşteri memnuniyeti odaklı yaklaşımımızla hizmet veriyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden TırlarYollarda?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Platformumuzun sunduğu avantajlar ve özellikler
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Güvenli Platform</h3>
              </div>
              <p className="text-gray-600">
                Tüm kullanıcılarımız doğrulanır ve güvenlik protokolleri ile korunur.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Hızlı Eşleşme</h3>
              </div>
              <p className="text-gray-600">
                Akıllı algoritmalarımız sayesinde en uygun iş-şoför eşleşmelerini sağlar.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Değerlendirme Sistemi</h3>
              </div>
              <p className="text-gray-600">
                Her iş sonrası değerlendirme yaparak kalite standartlarını koruruz.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Analitik Raporlar</h3>
              </div>
              <p className="text-gray-600">
                Detaylı raporlar ile iş performansınızı takip edin ve geliştirin.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <UserCheck className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Doğrulanmış Profiller</h3>
              </div>
              <p className="text-gray-600">
                Tüm şirket ve şoför profilleri titizlikle doğrulanır ve kontrol edilir.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <Globe className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Geniş Ağ</h3>
              </div>
              <p className="text-gray-600">
                Türkiye genelinde binlerce şirket ve şoförle bağlantı kurun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Rakamlarla TırlarYollarda</h2>
            <p className="text-xl text-blue-100">
              Platformumuzun başarı hikayesi
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-blue-100">Aktif Kullanıcı</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">8,932</div>
              <div className="text-blue-100">Tamamlanan İş</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">4.8/5</div>
              <div className="text-blue-100">Memnuniyet Oranı</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1,247</div>
              <div className="text-blue-100">Aktif İlan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nakliyat sektörüne olan tutkumuz ve teknoloji uzmanlığımızla, sizin için en iyi platformu geliştiriyoruz.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Teknoloji Ekibi</h3>
              <p className="text-gray-600">
                Modern teknolojiler kullanarak platformumuzu sürekli geliştiriyoruz.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Müşteri Hizmetleri</h3>
              <p className="text-gray-600">
                7/24 müşteri desteği ile her zaman yanınızdayız.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sektör Uzmanları</h3>
              <p className="text-gray-600">
                Nakliyat sektöründe deneyimli uzmanlarımızla birlikte çalışıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Hemen Başlayın!</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            TırlarYollarda ailesine katılın ve nakliyat sektöründe fark yaratın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Ücretsiz Kayıt Ol
            </Link>
            <Link href="/support" className="border-2 border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Destek Al
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="w-6 h-6 text-blue-400" />
                <span className="font-bold text-lg">TırlarYollarda</span>
              </div>
              <p className="text-gray-400 text-sm">
                Nakliyat sektörünün dijital buluşma noktası
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/jobs" className="block hover:text-white">İş İlanları</Link>
                <Link href="/companies" className="block hover:text-white">Şirketler</Link>
                <Link href="/drivers" className="block hover:text-white">Şoförler</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Destek</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/support" className="block hover:text-white">Yardım Merkezi</Link>
                <Link href="/about" className="block hover:text-white">Hakkımızda</Link>
                <Link href="/contact" className="block hover:text-white">İletişim</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">İletişim</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  info@tirlaryollarda.com
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +90 (212) 555 0123
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  İstanbul, Türkiye
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 TırlarYollarda. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
