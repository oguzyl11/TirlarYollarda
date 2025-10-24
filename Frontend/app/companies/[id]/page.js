'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { userAPI } from '../../../lib/api';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Briefcase, 
  Phone, 
  Mail, 
  Globe, 
  Calendar,
  Users,
  CheckCircle,
  Building2,
  Truck,
  Clock,
  Award,
  MessageCircle,
  Heart,
  Share2,
  Filter,
  Search
} from 'lucide-react';

export default function CompanyProfile() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCompanyDetails();
    }
  }, [params.id]);

  const fetchCompanyDetails = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getCompanyDetails(params.id);
      
      if (response.data.success) {
        const { company, jobs, reviews } = response.data.data;
        setCompany(company);
        setJobs(jobs);
        setReviews(reviews);
      }
    } catch (error) {
      console.error('Şirket detayları getirilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    // Toast notification eklenebilir
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-2xl p-8 mb-6">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Şirket Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız şirket mevcut değil.</p>
          <Link href="/companies" className="btn-primary">
            Şirketlere Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">{company.employerDetails?.companyName}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Company Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start space-x-6 mb-8">
            {/* Company Logo */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-12 h-12 text-white" />
            </div>
            
            {/* Company Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h2 className="text-2xl font-bold text-gray-800">{company.employerDetails?.companyName}</h2>
                {company.verified && (
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{company.profile?.city}</span>
                <span>•</span>
                <span>{company.employerDetails?.companyType}</span>
                <span>•</span>
                <span>{company.employerDetails?.establishedYear} yılından beri</span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {company.employerDetails?.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{company.stats?.totalJobs}</div>
                  <div className="text-sm text-gray-600">Aktif İlan</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{company.stats?.completedJobs}</div>
                  <div className="text-sm text-gray-600">Tamamlanan</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{company.stats?.activeDrivers}</div>
                  <div className="text-sm text-gray-600">Aktif Şoför</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">{company.stats?.yearsExperience}</div>
                  <div className="text-sm text-gray-600">Yıl Deneyim</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-800">
                    {typeof company.rating === 'object' ? company.rating?.average || '4.5' : company.rating || '4.5'}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({typeof company.rating === 'object' ? company.rating?.count || 0 : company.reviewCount || 0} değerlendirme)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleFollow}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isFollowing 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">İletişim Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{company.profile?.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{company.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{company.employerDetails?.website}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{company.employerDetails?.address}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Uzmanlık Alanları</h3>
              <div className="flex flex-wrap gap-2">
                {company.employerDetails?.specialties?.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'jobs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                İş İlanları ({jobs.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Değerlendirmeler ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'about'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Hakkında
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Jobs Tab */}
            {activeTab === 'jobs' && (
              <div className="space-y-4">
                {jobs.length > 0 ? (
                  jobs.map((job) => (
                    <div key={job._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg mb-2">{job.title}</h3>
                          <p className="text-gray-600 mb-3">{job.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{job.route?.from?.city} → {job.route?.to?.city}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Truck className="w-4 h-4" />
                              <span>{job.loadDetails?.type}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(job.schedule?.startDate).toLocaleDateString('tr-TR')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {job.payment?.amount?.toLocaleString()} {job.payment?.currency}
                          </div>
                          <div className="text-sm text-gray-500">{job.views} görüntülenme</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Aktif
                        </span>
                        <Link
                          href={`/jobs/${job._id}`}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Detayları Gör
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Henüz İlan Yok</h3>
                    <p className="text-gray-500">Bu şirket henüz iş ilanı yayınlamamış.</p>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {review.reviewer?.name?.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-800">{review.reviewer?.name}</h4>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          <div className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Henüz Değerlendirme Yok</h3>
                    <p className="text-gray-500">Bu şirket için henüz değerlendirme yapılmamış.</p>
                  </div>
                )}
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Şirket Hakkında</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {company.employerDetails?.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Şirket Bilgileri</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kuruluş Yılı:</span>
                        <span className="font-medium">{company.employerDetails?.establishedYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Çalışan Sayısı:</span>
                        <span className="font-medium">{company.employerDetails?.employeeCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Şirket Türü:</span>
                        <span className="font-medium">{company.employerDetails?.companyType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Çalışma Saatleri:</span>
                        <span className="font-medium">{company.employerDetails?.workingHours}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">İstatistikler</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Toplam İlan:</span>
                        <span className="font-medium">{company.stats?.totalJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tamamlanan İş:</span>
                        <span className="font-medium">{company.stats?.completedJobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Aktif Şoför:</span>
                        <span className="font-medium">{company.stats?.activeDrivers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deneyim:</span>
                        <span className="font-medium">{company.stats?.yearsExperience} yıl</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}