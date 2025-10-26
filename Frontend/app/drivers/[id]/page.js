'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { userAPI, reviewAPI, bidAPI } from '../../../lib/api';
import { useAuthStore } from '../../../store/authStore';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Briefcase, 
  Phone, 
  Mail, 
  Calendar,
  Users,
  CheckCircle,
  User,
  Truck,
  Clock,
  Award,
  MessageCircle,
  Heart,
  Share2,
  FileText,
  Languages,
  Shield,
  Car
} from 'lucide-react';

export default function DriverProfile() {
  const params = useParams();
  const router = useRouter();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [jobs, setJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    job: '',
    rating: 5,
    comment: '',
    categories: {
      communication: 5,
      professionalism: 5,
      punctuality: 5,
      quality: 5
    }
  });

  useEffect(() => {
    if (params.id) {
      fetchDriverDetails();
      checkFollowStatus();
    }
  }, [params.id]);

  const fetchDriverDetails = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getDriverDetails(params.id);
      
      if (response.data.success) {
        const { driver, jobs, reviews } = response.data.data;
        setDriver(driver);
        setJobs(jobs);
        setReviews(reviews);
      }
    } catch (error) {
      console.error('Şoför detayları getirilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await userAPI.checkFollowing(params.id);
      if (response.data.success) {
        setIsFollowing(response.data.isFollowing);
      }
    } catch (error) {
      console.error('Takip durumu kontrol edilemedi:', error);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await userAPI.followUser(params.id);
      if (response.data.success) {
        setIsFollowing(response.data.isFollowing);
        setToastMessage(response.data.isFollowing ? 'Şoförü takip ediyorsunuz' : 'Takibi bıraktınız');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error('Takip hatası:', error);
      setToastMessage('İşlem gerçekleştirilemedi');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToastMessage('Link kopyalandı!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Kopyalama hatası:', error);
      setToastMessage('Link kopyalanamadı');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleMessage = () => {
    router.push(`/messages?userId=${params.id}`);
  };

  const { user } = useAuthStore();

  const submitReview = async (e) => {
    e.preventDefault();
    
    // Validate that a job is selected
    if (!reviewForm.job) {
      setToastMessage('Lütfen bir iş seçin');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    try {
      await reviewAPI.createReview({
        reviewee: params.id,
        job: reviewForm.job,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        categories: reviewForm.categories
      });

      setToastMessage('Değerlendirme başarıyla gönderildi!');
      setShowToast(true);
      setShowReviewForm(false);
      setReviewForm({
        job: '',
        rating: 5,
        comment: '',
        categories: {
          communication: 5,
          professionalism: 5,
          punctuality: 5,
          quality: 5
        }
      });
      
      // Refresh reviews
      fetchDriverDetails();
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Değerlendirme hatası:', error);
      setToastMessage(error.response?.data?.message || 'Değerlendirme gönderilemedi');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
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

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Şoför Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız şoför mevcut değil.</p>
          <Link href="/drivers" className="btn-primary">
            Şoförlere Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

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
              <h1 className="text-xl font-bold text-gray-800">{driver.profile?.firstName} {driver.profile?.lastName}</h1>
            </div>
          </div>
        </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Driver Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start space-x-6 mb-8">
            {/* Driver Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-white" />
            </div>
            
            {/* Driver Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <h2 className="text-2xl font-bold text-gray-800">{driver.profile?.firstName} {driver.profile?.lastName}</h2>
                {driver.verified && (
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span>{driver.profile?.city}</span>
                <span>•</span>
                <Truck className="w-4 h-4" />
                <span>{driver.driverDetails?.vehicleType}</span>
                <span>•</span>
                <span>{driver.driverDetails?.experienceYears} yıl deneyim</span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {driver.profile?.bio}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{driver.stats?.completedJobs}</div>
                  <div className="text-sm text-gray-600">Tamamlanan İş</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{driver.stats?.onTimeDelivery}%</div>
                  <div className="text-sm text-gray-600">Zamanında Teslimat</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{driver.stats?.customerSatisfaction}%</div>
                  <div className="text-sm text-gray-600">Müşteri Memnuniyeti</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">{driver.stats?.yearsExperience}</div>
                  <div className="text-sm text-gray-600">Yıl Deneyim</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-gray-800">
                    {typeof driver.rating === 'object' ? driver.rating?.average || '4.5' : driver.rating || '4.5'}
                  </span>
                </div>
                <span className="text-gray-500">
                  ({typeof driver.rating === 'object' ? driver.rating?.count || 0 : driver.reviewCount || 0} değerlendirme)
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleFollow}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isFollowing 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  title="Paylaş"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={handleMessage}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                  title="Mesaj Gönder"
                >
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
                  <span className="text-gray-700">{driver.profile?.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{driver.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{driver.driverDetails?.workingHours}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{driver.driverDetails?.availability}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Uzmanlık Alanları</h3>
              <div className="flex flex-wrap gap-2">
                {driver.driverDetails?.specialties?.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
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
                onClick={() => setActiveTab('about')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'about'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Hakkında
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'jobs'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Tamamlanan İşler ({jobs.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Değerlendirmeler ({reviews.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Şoför Hakkında</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {driver.profile?.bio}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Araç Bilgileri</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Araç Türü:</span>
                        <span className="font-medium">{driver.driverDetails?.vehicleType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kapasite:</span>
                        <span className="font-medium">{driver.driverDetails?.vehicleCapacity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Model:</span>
                        <span className="font-medium">{driver.driverDetails?.vehicleModel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Yıl:</span>
                        <span className="font-medium">{driver.driverDetails?.vehicleYear}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Sertifikalar</h4>
                    <div className="space-y-2">
                      {driver.driverDetails?.certifications?.map((cert, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Diller</h4>
                    <div className="flex flex-wrap gap-2">
                      {driver.driverDetails?.languages?.map((language, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Özellikler</h4>
                    <div className="space-y-2">
                      {driver.driverDetails?.gpsTracking && (
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">GPS Takip</span>
                        </div>
                      )}
                      {driver.driverDetails?.temperatureControl && (
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">Sıcaklık Kontrolü</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{driver.driverDetails?.insurance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                              <span>{new Date(job.completedAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 mb-1">
                            {job.payment?.amount?.toLocaleString()} {job.payment?.currency}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-500">{job.rating}/5</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          Tamamlandı
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(job.completedAt).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Henüz Tamamlanan İş Yok</h3>
                    <p className="text-gray-500">Bu şoför henüz iş tamamlamamış.</p>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Add Review Button */}
                {user && user.userType !== 'driver' && (
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {showReviewForm ? 'İptal' : 'Değerlendirme Yap'}
                    </button>
                  </div>
                )}

                {/* Review Form */}
                {showReviewForm && (
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Değerlendirme Yap</h3>
                    <form onSubmit={submitReview} className="space-y-4">
                      {/* Job Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">İş Seçin</label>
                        <select
                          value={reviewForm.job}
                          onChange={(e) => setReviewForm({ ...reviewForm, job: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          required
                        >
                          <option value="">İş seçin...</option>
                          {jobs.map((job) => (
                            <option key={job._id} value={job._id}>
                              {job.title || `İş #${job._id.substring(0, 8)}`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Rating */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Genel Puan</label>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= reviewForm.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-gray-800 font-medium">{reviewForm.rating}/5</span>
                        </div>
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Yorumunuz</label>
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          rows="4"
                          placeholder="Bu şoför hakkında değerlendirmenizi yazın..."
                          required
                        />
                      </div>

                      {/* Categories */}
                      <div>
                        <label className="block text-base font-bold text-gray-900 mb-3">Kategorik Değerlendirmeler</label>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(reviewForm.categories).map(([key, value]) => (
                            <div key={key}>
                              <label className="block text-sm font-bold text-gray-900 mb-2 capitalize">{key}</label>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                      setReviewForm({
                                        ...reviewForm,
                                        categories: { ...reviewForm.categories, [key]: star }
                                      })
                                    }
                                    className="focus:outline-none"
                                  >
                                    <Star
                                      className={`w-5 h-5 ${
                                        star <= value
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Değerlendirmeyi Gönder
                      </button>
                    </form>
                  </div>
                )}

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
                            <span className="text-sm text-gray-600">({review.reviewer?.company})</span>
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
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">İş:</span> {review.jobTitle}
                          </div>
                          <div className="text-sm text-gray-600">
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
                    <p className="text-gray-500">Bu şoför için henüz değerlendirme yapılmamış.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}