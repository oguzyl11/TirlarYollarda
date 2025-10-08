import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Truck, Mail, Lock, User, Phone, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('driver');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const userData = {
        email: data.email,
        password: data.password,
        userType,
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          city: data.city,
        },
        ...(userType === 'driver' && {
          driverDetails: {
            licenseType: data.licenseType,
            experience: parseInt(data.experience),
            vehicleType: data.vehicleType,
          },
        }),
        ...(userType === 'employer' && {
          employerDetails: {
            companyName: data.companyName,
            taxNumber: data.taxNumber,
            companyAddress: data.companyAddress,
          },
        }),
      };

      const result = await registerUser(userData);
      if (result.success) {
        toast.success('Kayıt başarılı! Hoş geldiniz!');
        navigate('/dashboard');
      } else {
        toast.error(result.message || 'Kayıt olurken hata oluştu');
      }
    } catch (error) {
      toast.error('Beklenmeyen bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Truck className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Hesap oluşturun
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Zaten hesabınız var mı?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Giriş yapın
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* User Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Hesap tipi seçin
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('driver')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  userType === 'driver'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Tırcı</div>
                <div className="text-xs text-gray-500">İş arıyorum</div>
              </button>
              <button
                type="button"
                onClick={() => setUserType('employer')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  userType === 'employer'
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <Building className="h-6 w-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Şirket</div>
                <div className="text-xs text-gray-500">Tırcı arıyorum</div>
              </button>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Ad
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('firstName', {
                      required: 'Ad gereklidir',
                    })}
                    type="text"
                    className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Adınız"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Soyad
                </label>
                <div className="mt-1 relative">
                  <input
                    {...register('lastName', {
                      required: 'Soyad gereklidir',
                    })}
                    type="text"
                    className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Soyadınız"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email adresi
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email adresi gereklidir',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Geçerli bir email adresi giriniz',
                    },
                  })}
                  type="email"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="ornek@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('phone', {
                    required: 'Telefon numarası gereklidir',
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: 'Geçerli bir telefon numarası giriniz',
                    },
                  })}
                  type="tel"
                  className={`input-field pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="0555 123 45 67"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Şehir
              </label>
              <input
                {...register('city')}
                type="text"
                className="input-field"
                placeholder="İstanbul"
              />
            </div>

            {/* Driver specific fields */}
            {userType === 'driver' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="licenseType" className="block text-sm font-medium text-gray-700">
                      Ehliyet Tipi
                    </label>
                    <select
                      {...register('licenseType')}
                      className="input-field"
                    >
                      <option value="B">B Sınıfı</option>
                      <option value="C">C Sınıfı</option>
                      <option value="C+E">C+E Sınıfı</option>
                      <option value="D">D Sınıfı</option>
                      <option value="E">E Sınıfı</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                      Deneyim (Yıl)
                    </label>
                    <input
                      {...register('experience', {
                        min: { value: 0, message: 'Deneyim 0\'dan küçük olamaz' },
                      })}
                      type="number"
                      className={`input-field ${errors.experience ? 'border-red-500' : ''}`}
                      placeholder="5"
                      min="0"
                    />
                    {errors.experience && (
                      <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                    Araç Tipi
                  </label>
                  <input
                    {...register('vehicleType')}
                    type="text"
                    className="input-field"
                    placeholder="Kamyon, Tır, vs."
                  />
                </div>
              </>
            )}

            {/* Employer specific fields */}
            {userType === 'employer' && (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Şirket Adı
                  </label>
                  <input
                    {...register('companyName', {
                      required: userType === 'employer' ? 'Şirket adı gereklidir' : false,
                    })}
                    type="text"
                    className={`input-field ${errors.companyName ? 'border-red-500' : ''}`}
                    placeholder="ABC Lojistik A.Ş."
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700">
                    Vergi Numarası
                  </label>
                  <input
                    {...register('taxNumber')}
                    type="text"
                    className="input-field"
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">
                    Şirket Adresi
                  </label>
                  <textarea
                    {...register('companyAddress')}
                    rows={3}
                    className="input-field"
                    placeholder="Şirket adresinizi giriniz..."
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Şifre gereklidir',
                    minLength: {
                      value: 6,
                      message: 'Şifre en az 6 karakter olmalıdır',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Şifre Tekrar
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: 'Şifre tekrarı gereklidir',
                    validate: (value) =>
                      value === password || 'Şifreler eşleşmiyor',
                  })}
                  type="password"
                  className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and conditions */}
            <div className="flex items-center">
              <input
                {...register('terms', {
                  required: 'Kullanım şartlarını kabul etmelisiniz',
                })}
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                  Kullanım şartlarını
                </Link>{' '}
                ve{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                  gizlilik politikasını
                </Link>{' '}
                kabul ediyorum.
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
            )}

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                {isLoading ? 'Kayıt oluşturuluyor...' : 'Hesap Oluştur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

