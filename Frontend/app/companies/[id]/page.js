'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  ArrowLeft, 
  MapPin, 
  Star, 
  Briefcase, 
  Phone, 
  Mail, 
  Globe,
  Calendar,
  DollarSign,
  Truck,
  Users,
  CheckCircle,
  Clock,
  MessageSquare,
  Filter,
  Search
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { jobAPI } from '../../../lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, initAuth } = useAuthStore();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    initAuth();
    loadCompanyData();
  }, [params.id]);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      
      // Mock company data - gerçekte API'den gelecek
      const mockCompanies = {
        1: {
          id: 1,
          name: 'Mega Lojistik A.Ş.',
          city: 'İstanbul',
          address: 'Maslak Mahallesi, Büyükdere Caddesi No:123',
          rating: 4.8,
          reviewCount: 156,
          jobCount: 45,
          verified: true,
          phone: '+90 212 555 0123',
          email: 'info@megalojistik.com',
          website: 'www.megalojistik.com',
          description: 'Türkiye\'nin önde gelen lojistik firmalarından biri olan Mega Lojistik, 15 yıllık deneyimi ile güvenilir taşımacılık hizmetleri sunmaktadır.',
          foundedYear: 2008,
          employeeCount: 250,
          fleetSize: 150,
          specialties: ['Kargo Taşımacılığı', 'Parsiyel Yük', 'Tam Yük', 'Konteyner Taşımacılığı'],
          workingHours: '7/24',
          certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001']
        },
        2: {
          id: 2,
          name: 'Hızlı Taşıma Ltd.',
          city: 'Ankara',
          address: 'Çankaya Mahallesi, Atatürk Bulvarı No:456',
          rating: 4.6,
          reviewCount: 89,
          jobCount: 32,
          verified: true,
          phone: '+90 312 555 0456',
          email: 'info@hizlitasma.com',
          website: 'www.hizlitasma.com',
          description: 'Ankara merkezli hızlı taşımacılık firması. Acil kargo ve ekspres taşımacılık konularında uzman.',
          foundedYear: 2015,
          employeeCount: 120,
          fleetSize: 80,
          specialties: ['Ekspres Taşımacılık', 'Acil Kargo', 'Şehir İçi Dağıtım'],
          workingHours: '6:00 - 22:00',
          certifications: ['ISO 9001']
        },
        3: {
          id: 3,
          name: 'Güven Nakliyat',
          city: 'İzmir',
          address: 'Konak Mahallesi, Cumhuriyet Meydanı No:789',
          rating: 4.9,
          reviewCount: 203,
          jobCount: 67,
          verified: true,
          phone: '+90 232 555 0789',
          email: 'info@guvennakliyat.com',
          website: 'www.guvennakliyat.com',
          description: 'İzmir ve çevre illerde güvenilir nakliyat hizmetleri sunan köklü firma. Müşteri memnuniyeti odaklı hizmet anlayışı.',
          foundedYear: 2000,
          employeeCount: 180,
          fleetSize: 120,
          specialties: ['Bölgesel Taşımacılık', 'Ev Eşyası Taşıma', 'Ofis Taşıma'],
          workingHours: '7/24',
          certifications: ['ISO 9001', 'ISO 14001']
        },
        4: {
          id: 4,
          name: 'Anadolu Kargo',
          city: 'Bursa',
          address: 'Osmangazi Mahallesi, Uludağ Caddesi No:321',
          rating: 4.5,
          reviewCount: 78,
          jobCount: 28,
          verified: false,
          phone: '+90 224 555 0321',
          email: 'info@anadolukargo.com',
          website: 'www.anadolukargo.com',
          description: 'Bursa merkezli kargo ve taşımacılık firması. Bölgesel hizmetlerde uzman.',
          foundedYear: 2012,
          employeeCount: 95,
          fleetSize: 60,
          specialties: ['Kargo Taşımacılığı', 'Bölgesel Dağıtım'],
          workingHours: '8:00 - 20:00',
          certifications: []
        },
        5: {
          id: 5,
          name: 'Express Lojistik',
          city: 'Antalya',
          address: 'Muratpaşa Mahallesi, Atatürk Caddesi No:654',
          rating: 4.7,
          reviewCount: 134,
          jobCount: 41,
          verified: true,
          phone: '+90 242 555 0654',
          email: 'info@expresslojistik.com',
          website: 'www.expresslojistik.com',
          description: 'Antalya ve çevre illerde ekspres lojistik hizmetleri sunan modern firma.',
          foundedYear: 2018,
          employeeCount: 110,
          fleetSize: 75,
          specialties: ['Ekspres Lojistik', 'Turizm Taşımacılığı', 'Hava Kargo'],
          workingHours: '7/24',
          certifications: ['ISO 9001', 'IATA']
        },
        6: {
          id: 6,
          name: 'Yıldırım Taşımacılık',
          city: 'Konya',
          address: 'Meram Mahallesi, Mevlana Caddesi No:987',
          rating: 4.4,
          reviewCount: 56,
          jobCount: 19,
          verified: false,
          phone: '+90 332 555 0987',
          email: 'info@yildirimtasimacilik.com',
          website: 'www.yildirimtasimacilik.com',
          description: 'Konya merkezli geleneksel taşımacılık firması. Yerel hizmetlerde deneyimli.',
          foundedYear: 2005,
          employeeCount: 65,
          fleetSize: 45,
          specialties: ['Yerel Taşımacılık', 'Tarım Ürünleri Taşıma'],
          workingHours: '7:00 - 19:00',
          certifications: []
        }
      };

      const companyData = mockCompanies[params.id];
      if (companyData) {
        setCompany(companyData);
        loadCompanyJobs(companyData.id);
      } else {
        toast.error('Şirket bulunamadı');
        router.push('/companies');
      }
    } catch (error) {
      console.error('Şirket verileri yüklenemedi:', error);
      toast.error('Şirket verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyJobs = async (companyId) => {
    try {
      setJobsLoading(true);
      // Mock jobs data - gerçekte API'den gelecek
      const mockJobs = [
        {
          _id: '1',
          title: 'İstanbul-Ankara Kargo Taşıma',
          description: 'Acil kargo taşıma işi. Güvenli ve hızlı teslimat gerekiyor.',
          route: { from: { city: 'İstanbul' }, to: { city: 'Ankara' } },
          payment: { amount: 2500, currency: 'TL' },
          schedule: { startDate: '2024-01-15T08:00:00Z' },
          loadDetails: { type: 'Kargo', weight: '2' },
          status: 'active',
          createdAt: '2024-01-10T10:00:00Z'
        },
        {
          _id: '2',
          title: 'İzmir-Bursa Parsiyel Yük',
          description: 'Parsiyel yük taşıma işi. Ekonomik çözüm aranıyor.',
          route: { from: { city: 'İzmir' }, to: { city: 'Bursa' } },
          payment: { amount: 1800, currency: 'TL' },
          schedule: { startDate: '2024-01-18T09:00:00Z' },
          loadDetails: { type: 'Parsiyel', weight: '5' },
          status: 'active',
          createdAt: '2024-01-12T14:30:00Z'
        },
        {
          _id: '3',
          title: 'Antalya-Konya Tam Yük',
          description: 'Tam yük taşıma işi. Büyük araç gerekiyor.',
          route: { from: { city: 'Antalya' }, to: { city: 'Konya' } },
          payment: { amount: 4500, currency: 'TL' },
          schedule: { startDate: '2024-01-20T07:00:00Z' },
          loadDetails: { type: 'Tam Yük', weight: '20' },
          status: 'active',
          createdAt: '2024-01-14T16:45:00Z'
        }
      ];
      
      setJobs(mockJobs);
    } catch (error) {
      console.error('İşler yüklenemedi:', error);
      toast.error('İşler yüklenirken hata oluştu');
    } finally {
      setJobsLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || job.loadDetails.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Şirket bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Şirket bulunamadı</h1>
          <Link href="/companies" className="text-blue-600 hover:text-blue-700">
            Şirketler listesine dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/companies" className="flex items-center text-gray-600 hover:text-blue-600">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Geri Dön
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">{company.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                    {company.verified && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{company.city}</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{company.rating}</span>
                    <span className="text-gray-500">({company.reviewCount} değerlendirme)</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{company.description}</p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{company.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{company.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{company.website}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{company.address}</span>
                </div>
              </div>

              {/* Company Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{company.fleetSize}</div>
                  <div className="text-sm text-gray-600">Araç Filosu</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{company.employeeCount}</div>
                  <div className="text-sm text-gray-600">Çalışan</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full btn-primary py-3 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  İletişime Geç
                </button>
                <button className="w-full btn-secondary py-3 flex items-center justify-center">
                  <Star className="w-5 h-5 mr-2" />
                  Değerlendir
                </button>
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Şirket Detayları</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kuruluş Yılı</span>
                  <span className="font-medium">{company.foundedYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Çalışma Saatleri</span>
                  <span className="font-medium">{company.workingHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doğrulama</span>
                  <span className={`font-medium ${company.verified ? 'text-green-600' : 'text-gray-500'}`}>
                    {company.verified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                  </span>
                </div>
              </div>

              {/* Specialties */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Uzmanlık Alanları</h4>
                <div className="flex flex-wrap gap-2">
                  {company.specialties.map((specialty, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              {company.certifications.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Sertifikalar</h4>
                  <div className="flex flex-wrap gap-2">
                    {company.certifications.map((cert, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Jobs Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Aktif İş İlanları</h2>
                  <span className="text-sm text-gray-500">{jobs.length} ilan</span>
                </div>

                {/* Search and Filter */}
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="İş ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="input-field w-48"
                  >
                    <option value="all">Tüm Türler</option>
                    <option value="Kargo">Kargo</option>
                    <option value="Parsiyel">Parsiyel</option>
                    <option value="Tam Yük">Tam Yük</option>
                    <option value="Konteyner">Konteyner</option>
                  </select>
                </div>
              </div>

              {/* Jobs List */}
              <div className="p-6">
                {jobsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : filteredJobs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredJobs.map((job) => (
                      <Link
                        key={job._id}
                        href={`/jobs/${job._id}`}
                        className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{job.description}</p>
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {job.route.from.city} → {job.route.to.city}
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {job.payment.amount} {job.payment.currency}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(job.schedule.startDate).toLocaleDateString('tr-TR')}
                              </div>
                              <div className="flex items-center">
                                <Truck className="w-4 h-4 mr-1" />
                                {job.loadDetails.type}
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center">
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                              Aktif
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Bu şirketin aktif ilanı bulunmuyor</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
