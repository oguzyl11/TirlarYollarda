'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Building2, Star, MapPin, Briefcase, Search } from 'lucide-react';
import Link from 'next/link';

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - gerçekte API'den gelecek
  const companies = [
    { id: 1, name: 'Mega Lojistik A.Ş.', city: 'İstanbul', rating: 4.8, reviewCount: 156, jobCount: 45, verified: true },
    { id: 2, name: 'Hızlı Taşıma Ltd.', city: 'Ankara', rating: 4.6, reviewCount: 89, jobCount: 32, verified: true },
    { id: 3, name: 'Güven Nakliyat', city: 'İzmir', rating: 4.9, reviewCount: 203, jobCount: 67, verified: true },
    { id: 4, name: 'Anadolu Kargo', city: 'Bursa', rating: 4.5, reviewCount: 78, jobCount: 28, verified: false },
    { id: 5, name: 'Express Lojistik', city: 'Antalya', rating: 4.7, reviewCount: 134, jobCount: 41, verified: true },
    { id: 6, name: 'Yıldırım Taşımacılık', city: 'Konya', rating: 4.4, reviewCount: 56, jobCount: 19, verified: false },
  ];

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Popüler Şirketler</h1>
          <p className="text-gray-600">En çok tercih edilen ve güvenilir nakliyat firmaları</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Şirket veya şehir ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => (
            <Link key={company.id} href={`/companies/${company.id}`} className="card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-900 truncate">{company.name}</h3>
                    {company.verified && (
                      <span className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{company.city}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{company.rating}</span>
                      <span className="text-gray-500">({company.reviewCount})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{company.jobCount} ilan</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Şirket bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinizi değiştirip tekrar deneyin</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}