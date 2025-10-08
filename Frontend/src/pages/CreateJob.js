import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { jobsAPI } from '../services/api';
import { ArrowLeft, MapPin, Calendar, Truck, DollarSign, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateJob = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const jobType = watch('jobType');

  const createJobMutation = useMutation(jobsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('jobs');
      toast.success('İlan başarıyla oluşturuldu!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'İlan oluşturulurken hata oluştu');
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const jobData = {
        ...data,
        schedule: {
          startDate: data.startDate,
          flexibility: data.flexibility || 'flexible',
        },
        payment: {
          amount: parseInt(data.amount),
          currency: 'TRY',
          paymentType: data.paymentType,
          paymentMethod: data.paymentMethod,
        },
      };

      await createJobMutation.mutateAsync(jobData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Geri Dön
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Yeni İlan Oluştur</h1>
          <p className="mt-2 text-gray-600">
            Detaylı bilgilerle iş ilanınızı oluşturun ve doğru kişilere ulaşın.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Job Type */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İlan Tipi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="relative">
                <input
                  {...register('jobType', { required: 'İlan tipi seçmelisiniz' })}
                  type="radio"
                  value="employer-seeking-driver"
                  className="sr-only peer"
                />
                <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3 peer-checked:border-primary-500 peer-checked:bg-primary-500"></div>
                    <div>
                      <p className="font-medium text-gray-900">Şirket Tırcı Arıyor</p>
                      <p className="text-sm text-gray-600">Lojistik şirketi olarak tırcı arıyorsunuz</p>
                    </div>
                  </div>
                </div>
              </label>

              <label className="relative">
                <input
                  {...register('jobType')}
                  type="radio"
                  value="driver-seeking-job"
                  className="sr-only peer"
                />
                <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3 peer-checked:border-primary-500 peer-checked:bg-primary-500"></div>
                    <div>
                      <p className="font-medium text-gray-900">Tırcı İş Arıyor</p>
                      <p className="text-sm text-gray-600">Tırcı olarak iş arıyorsunuz</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
            {errors.jobType && (
              <p className="mt-2 text-sm text-red-600">{errors.jobType.message}</p>
            )}
          </div>

          {/* Job Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              İlan Detayları
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İlan Başlığı *
                </label>
                <input
                  {...register('title', { required: 'İlan başlığı gereklidir' })}
                  type="text"
                  className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Örn: İstanbul - Ankara Parsiyel Taşımacılığı"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  {...register('description', { required: 'Açıklama gereklidir' })}
                  rows={4}
                  className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="İş hakkında detaylı bilgi verin..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Güzergah Bilgileri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nereden *
                </label>
                <input
                  {...register('route.from.city', { required: 'Başlangıç şehri gereklidir' })}
                  type="text"
                  className={`input-field ${errors['route.from.city'] ? 'border-red-500' : ''}`}
                  placeholder="İstanbul"
                />
                {errors['route.from.city'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['route.from.city'].message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nereye *
                </label>
                <input
                  {...register('route.to.city', { required: 'Varış şehri gereklidir' })}
                  type="text"
                  className={`input-field ${errors['route.to.city'] ? 'border-red-500' : ''}`}
                  placeholder="Ankara"
                />
                {errors['route.to.city'] && (
                  <p className="mt-1 text-sm text-red-600">{errors['route.to.city'].message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Load Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Yük Detayları
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yük Tipi
                </label>
                <select {...register('loadDetails.type')} className="input-field">
                  <option value="">Seçiniz</option>
                  <option value="Parsiyel">Parsiyel</option>
                  <option value="Konteyner">Konteyner</option>
                  <option value="Dorse">Dorse</option>
                  <option value="Frigo">Frigo</option>
                  <option value="Tanker">Tanker</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ağırlık
                </label>
                <input
                  {...register('loadDetails.weight')}
                  type="text"
                  className="input-field"
                  placeholder="Örn: 10 ton"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Araç Tipi
                </label>
                <select {...register('vehicleRequirements.type')} className="input-field">
                  <option value="">Seçiniz</option>
                  <option value="Tır">Tır</option>
                  <option value="Kamyon">Kamyon</option>
                  <option value="Çekici">Çekici</option>
                  <option value="Kamyonet">Kamyonet</option>
                  <option value="Frigo">Frigo</option>
                  <option value="Tanker">Tanker</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Zamanlama
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç Tarihi *
                </label>
                <input
                  {...register('startDate', { required: 'Başlangıç tarihi gereklidir' })}
                  type="date"
                  className={`input-field ${errors.startDate ? 'border-red-500' : ''}`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Esneklik
                </label>
                <select {...register('flexibility')} className="input-field">
                  <option value="exact">Kesin tarih</option>
                  <option value="flexible">Esnek</option>
                  <option value="negotiable">Pazarlıklı</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Ödeme Bilgileri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ücret (₺)
                </label>
                <input
                  {...register('amount', { 
                    required: 'Ücret bilgisi gereklidir',
                    min: { value: 1, message: 'Ücret 0\'dan büyük olmalıdır' }
                  })}
                  type="number"
                  className={`input-field ${errors.amount ? 'border-red-500' : ''}`}
                  placeholder="2500"
                  min="1"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Tipi
                </label>
                <select {...register('paymentType')} className="input-field">
                  <option value="fixed">Sabit ücret</option>
                  <option value="per-km">Km başı</option>
                  <option value="negotiable">Pazarlıklı</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ödeme Yöntemi
                </label>
                <select {...register('paymentMethod')} className="input-field">
                  <option value="bank-transfer">Banka havalesi</option>
                  <option value="cash">Nakit</option>
                  <option value="check">Çek</option>
                  <option value="other">Diğer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'İlan Oluşturuluyor...' : 'İlanı Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJob;

