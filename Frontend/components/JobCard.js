import Link from 'next/link';
import { MapPin, Package, Clock, DollarSign, Star, Building2, TrendingUp, AlertCircle } from 'lucide-react';

export default function JobCard({ job, featured = false }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getUrgencyBadge = () => {
    const startDate = new Date(job.schedule?.startDate);
    const today = new Date();
    const daysUntil = Math.floor((startDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntil <= 2) {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-medium">
          <AlertCircle className="w-3 h-3" />
          <span>ACİL</span>
        </div>
      );
    }
    return null;
  };

  return (
    <Link href={`/jobs/${job._id}`} className="card p-5 block hover:shadow-lg hover:border-blue-200 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {featured && (
              <div className="flex items-center space-x-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>ÖNE ÇIKAN</span>
              </div>
            )}
            {getUrgencyBadge()}
          </div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2 hover:text-blue-600 transition line-clamp-1">
            {job.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
            <Building2 className="w-4 h-4" />
            <span className="font-medium">{job.postedBy?.profile?.firstName || 'Şirket Adı'}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{job.postedBy?.rating?.average?.toFixed(1) || '4.5'}</span>
            </div>
          </div>
        </div>
        {job.payment?.amount && (
          <div className="text-right ml-3">
            <div className="text-xl font-bold text-blue-600">
              {job.payment.amount.toLocaleString('tr-TR')} ₺
            </div>
            <div className="text-xs text-gray-500">
              {job.payment.paymentType === 'per-km' ? '/km' : 'Sabit'}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{job.route?.from?.city}</span>
          <span>→</span>
          <span className="font-medium">{job.route?.to?.city}</span>
          {job.route?.distance && (
            <span className="text-gray-500">({job.route.distance} km)</span>
          )}
        </div>
        {job.loadDetails?.type && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Package className="w-4 h-4 text-gray-400" />
            <span>{job.loadDetails.type}</span>
            {job.loadDetails.weight && (
              <>
                <span>•</span>
                <span>{job.loadDetails.weight}</span>
              </>
            )}
          </div>
        )}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{formatDate(job.schedule?.startDate)}</span>
        </div>
      </div>

      {job.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {job.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <span>{job.views || 0} görüntülenme</span>
          {job.bids && job.bids.length > 0 && (
            <>
              <span>•</span>
              <span className="text-blue-600 font-medium">{job.bids.length} teklif</span>
            </>
          )}
        </div>
        <div className="text-blue-600 text-sm font-medium hover:text-blue-700">
          Detayları Gör →
        </div>
      </div>
    </Link>
  );
}