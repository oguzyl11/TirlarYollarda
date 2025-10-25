'use client';

import { useState, useEffect } from 'react';
import useNotificationStore from '../store/notificationStore';
import { getRateLimitStatus, resetRateLimiter } from '../lib/rateLimiter';

export default function RateLimitDebug() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const updateStatus = () => {
      setStatus(getRateLimitStatus());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="mb-2 font-bold">Global Rate Limit Status</div>
      <div>Requests: {status.requestsUsed}/{status.requestsRemaining + status.requestsUsed}</div>
      <div>Remaining: {status.requestsRemaining}</div>
      <div>Reset in: {formatTime(status.timeUntilReset)}</div>
      <div>Queue: {status.queueLength}</div>
      <div>Processing: {status.isProcessing ? 'Yes' : 'No'}</div>
      <div>Cache: {status.cacheSize} items</div>
      <div className={`${status.circuitBreakerOpen ? 'text-red-400' : 'text-green-400'}`}>
        Circuit Breaker: {status.circuitBreakerOpen ? 'OPEN' : 'CLOSED'}
      </div>
      <div>Failures: {status.consecutiveFailures}/{status.maxConsecutiveFailures}</div>
      <button
        onClick={resetRateLimiter}
        className="mt-2 px-2 py-1 bg-red-600 text-white rounded text-xs"
      >
        Reset All
      </button>
    </div>
  );
}
