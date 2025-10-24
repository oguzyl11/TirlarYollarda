'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  Truck,
  Users,
  CreditCard,
  Shield,
  Settings,
  FileText,
  Download,
  ExternalLink
} from 'lucide-react';
import Header from '../../components/Header';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "Nasıl hesap oluşturabilirim?",
      answer: "Ana sayfadaki 'Kayıt Ol' butonuna tıklayarak veya header'daki 'Kayıt Ol' linkini kullanarak hesap oluşturabilirsiniz. Şoför veya İşveren olarak kayıt olabilirsiniz.",
      category: "Hesap"
    },
    {
      id: 2,
      question: "Şifremi unuttum, nasıl sıfırlayabilirim?",
      answer: "Giriş sayfasında 'Şifremi Unuttum' linkine tıklayın. Email adresinizi girin ve size gönderilen link ile şifrenizi sıfırlayabilirsiniz.",
      category: "Hesap"
    },
    {
      id: 3,
      question: "İş ilanı nasıl oluştururum?",
      answer: "Dashboard'ınızda 'Yeni İş' butonuna tıklayın. İş detaylarını, rota bilgilerini ve ödeme koşullarını doldurun. İlanınız onaylandıktan sonra yayınlanacaktır.",
      category: "İş İlanları"
    },
    {
      id: 4,
      question: "Teklif nasıl veririm?",
      answer: "İş ilanı detay sayfasında 'Teklif Ver' butonuna tıklayın. Teklif miktarınızı ve mesajınızı girin. İşveren teklifinizi değerlendirecektir.",
      category: "Teklifler"
    },
    {
      id: 5,
      question: "Ödeme nasıl yapılır?",
      answer: "Ödemeler platform üzerinden güvenli şekilde yapılır. İş tamamlandıktan sonra ödeme otomatik olarak şoföre aktarılır. Platform komisyonu %3'tür.",
      category: "Ödeme"
    },
    {
      id: 6,
      question: "Profilimi nasıl doğrularım?",
      answer: "Profil sayfanızda 'Doğrula' butonuna tıklayın. Kimlik belgesi, ehliyet ve araç ruhsatı gibi belgeleri yükleyin. Doğrulama 1-2 iş günü sürer.",
      category: "Doğrulama"
    },
    {
      id: 7,
      question: "Değerlendirme sistemi nasıl çalışır?",
      answer: "Her iş tamamlandıktan sonra karşılıklı değerlendirme yapılır. 1-5 yıldız arası puanlama ve yorum yazabilirsiniz. Bu değerlendirmeler profil sayfanızda görünür.",
      category: "Değerlendirme"
    },
    {
      id: 8,
      question: "Hesabımı nasıl silerim?",
      answer: "Profil ayarlarından 'Hesabı Sil' seçeneğini bulabilirsiniz. Hesap silme işlemi geri alınamaz ve tüm verileriniz kalıcı olarak silinir.",
      category: "Hesap"
    }
  ];

  const categories = [
    { name: "Hesap", icon: Users, color: "blue" },
    { name: "İş İlanları", icon: Truck, color: "green" },
    { name: "Teklifler", icon: MessageCircle, color: "purple" },
    { name: "Ödeme", icon: CreditCard, color: "yellow" },
    { name: "Doğrulama", icon: Shield, color: "red" },
    { name: "Değerlendirme", icon: CheckCircle, color: "indigo" }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Yardım Merkezi</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Sorularınızın cevaplarını bulun, destek alın ve platformumuzu daha iyi tanıyın.
            </p>
            
            {/* Search Box */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Sorunuzu arayın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hızlı Yardım</h2>
            <p className="text-xl text-gray-600">
              En sık sorulan sorular ve hızlı çözümler
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/register" className="bg-blue-50 rounded-xl p-6 hover:bg-blue-100 transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Hesap Oluştur</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Ücretsiz hesap oluşturun ve platformumuzun avantajlarından yararlanın.
              </p>
            </Link>
            
            <Link href="/jobs" className="bg-green-50 rounded-xl p-6 hover:bg-green-100 transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">İş İlanları</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Binlerce iş ilanı arasından size uygun olanı bulun.
              </p>
            </Link>
            
            <Link href="/profile" className="bg-purple-50 rounded-xl p-6 hover:bg-purple-100 transition-colors">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Profil Ayarları</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Profil bilgilerinizi güncelleyin ve doğrulama işlemlerini tamamlayın.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sık Sorulan Sorular</h2>
            <p className="text-xl text-gray-600">
              En çok merak edilen konular ve detaylı cevapları
            </p>
          </div>
          
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span className="text-lg font-semibold text-gray-900">{faq.question}</span>
                  </div>
                  {expandedFaq === faq.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategoriler</h2>
            <p className="text-xl text-gray-600">
              Konulara göre düzenlenmiş yardım içerikleri
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              const categoryFaqs = faqs.filter(faq => faq.category === category.name);
              
              return (
                <div key={category.name} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-${category.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                      <Icon className={`w-6 h-6 text-${category.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{categoryFaqs.length} soru</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {categoryFaqs.slice(0, 3).map((faq) => (
                      <button
                        key={faq.id}
                        onClick={() => {
                          setSearchQuery(faq.question);
                          setExpandedFaq(faq.id);
                        }}
                        className="block text-left text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {faq.question}
                      </button>
                    ))}
                    {categoryFaqs.length > 3 && (
                      <p className="text-xs text-gray-500">+{categoryFaqs.length - 3} daha fazla</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Hala Yardıma İhtiyacınız Var mı?</h2>
            <p className="text-xl text-blue-100">
              Uzman ekibimiz size yardımcı olmaya hazır
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Canlı Destek</h3>
              <p className="text-blue-100 mb-4">
                7/24 canlı destek hattımızla anında yardım alın
              </p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Sohbet Başlat
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Desteği</h3>
              <p className="text-blue-100 mb-4">
                Detaylı sorularınız için email gönderin
              </p>
              <a 
                href="mailto:support@tirlaryollarda.com"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
              >
                Email Gönder
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Telefon Desteği</h3>
              <p className="text-blue-100 mb-4">
                Acil durumlar için telefon desteği
              </p>
              <a 
                href="tel:+902125550123"
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
              >
                Ara
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kaynaklar</h2>
            <p className="text-xl text-gray-600">
              Platform kullanımı için faydalı dokümanlar
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kullanım Kılavuzu</h3>
              <p className="text-gray-600 text-sm mb-4">
                Platformun tüm özelliklerini öğrenin
              </p>
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                İndir <Download className="w-4 h-4 inline ml-1" />
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Güvenlik Rehberi</h3>
              <p className="text-gray-600 text-sm mb-4">
                Güvenli kullanım için ipuçları
              </p>
              <button className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                Oku <ExternalLink className="w-4 h-4 inline ml-1" />
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Info className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SSS</h3>
              <p className="text-gray-600 text-sm mb-4">
                En sık sorulan sorular
              </p>
              <button className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                Görüntüle <ExternalLink className="w-4 h-4 inline ml-1" />
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Güncellemeler</h3>
              <p className="text-gray-600 text-sm mb-4">
                Son güncellemeler ve yenilikler
              </p>
              <button className="text-yellow-600 font-semibold hover:text-yellow-700 transition-colors">
                Takip Et <ExternalLink className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 relative">
                  <Image
                    src="/logo.png"
                    alt="LoadING Logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                    priority
                  />
                </div>
                <span className="font-bold text-lg">LoadING</span>
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
                  support@tirlaryollarda.com
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +90 (212) 555 0123
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  7/24 Destek
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
