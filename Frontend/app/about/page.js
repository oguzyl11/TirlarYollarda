'use client';

import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';
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
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-28 h-28 relative mr-6">
                <Image
                  src="/logo.png"
                  alt="LoadING Logo"
                  width={112}
                  height={112}
                  className="rounded-3xl shadow-lg"
                  priority
                />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-2">LoadING</h1>
                <p className="text-lg text-gray-600 font-medium">Nakliyatın Geleceği</p>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-10 leading-relaxed">
              Nakliyat sektörünün dijital buluşma noktası. Şirketler ve şoförler için güvenilir, hızlı ve verimli işbirliği platformu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Hemen Başla
              </Link>
              <Link href="/jobs" className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
                İş İlanlarını Gör
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Misyonumuz</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Türkiye&apos;nin nakliyat sektöründe dijital dönüşümü hızlandırarak, şirketler ve şoförler arasında güvenilir köprüler kuruyoruz.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Hedefimiz</h3>
              <p className="text-gray-600 leading-relaxed">
                Nakliyat sektöründe şeffaflık ve güveni artırarak, tüm paydaşlar için değer yaratmak.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Vizyonumuz</h3>
              <p className="text-gray-600 leading-relaxed">
                Türkiye&apos;nin en büyük nakliyat ağı olarak, sektörün dijital geleceğini şekillendirmek.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Değerlerimiz</h3>
              <p className="text-gray-600 leading-relaxed">
                Güven, şeffaflık, kalite ve müşteri memnuniyeti odaklı yaklaşımımızla hizmet veriyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Neden LoadING?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Platformumuzun sunduğu avantajlar ve özellikler
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mr-6">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Güvenli Platform</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Tüm kullanıcılarımız doğrulanır ve güvenlik protokolleri ile korunur.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mr-6">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Hızlı Eşleşme</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Akıllı algoritmalarımız sayesinde en uygun iş-şoför eşleşmelerini sağlar.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mr-6">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Değerlendirme Sistemi</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Her iş sonrası değerlendirme yaparak kalite standartlarını koruruz.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mr-6">
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Analitik Raporlar</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Detaylı raporlar ile iş performansınızı takip edin ve geliştirin.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mr-6">
                  <UserCheck className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Doğrulanmış Profiller</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Tüm şirket ve şoför profilleri titizlikle doğrulanır ve kontrol edilir.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mr-6">
                  <Globe className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Geniş Ağ</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Türkiye genelinde binlerce şirket ve şoförle bağlantı kurun.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Rakamlarla LoadING</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Platformumuzun başarı hikayesi
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl font-bold mb-3 text-blue-600">15,000+</div>
              <div className="text-gray-600 text-lg">Aktif Kullanıcı</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl font-bold mb-3 text-green-600">8,932</div>
              <div className="text-gray-600 text-lg">Tamamlanan İş</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl font-bold mb-3 text-purple-600">4.8/5</div>
              <div className="text-gray-600 text-lg">Memnuniyet Oranı</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl font-bold mb-3 text-orange-600">1,247</div>
              <div className="text-gray-600 text-lg">Aktif İlan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Ekibimiz</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Nakliyat sektörüne olan tutkumuz ve teknoloji uzmanlığımızla, sizin için en iyi platformu geliştiriyoruz.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Building2 className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Teknoloji Ekibi</h3>
              <p className="text-gray-600 leading-relaxed">
                Modern teknolojiler kullanarak platformumuzu sürekli geliştiriyoruz.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-28 h-28 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Müşteri Hizmetleri</h3>
              <p className="text-gray-600 leading-relaxed">
                7/24 müşteri desteği ile her zaman yanınızdayız.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="w-28 h-28 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Award className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sektör Uzmanları</h3>
              <p className="text-gray-600 leading-relaxed">
                Nakliyat sektöründe deneyimli uzmanlarımızla birlikte çalışıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Hemen Başlayın!</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            LoadING ailesine katılın ve nakliyat sektöründe fark yaratın.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register" className="bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Ücretsiz Kayıt Ol
            </Link>
            <Link href="/support" className="border-2 border-blue-600 text-blue-600 px-10 py-4 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
              Destek Al
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
