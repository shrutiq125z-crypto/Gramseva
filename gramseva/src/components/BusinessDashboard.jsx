import React, { useEffect, useState } from 'react';
import { businessAPI } from '../services/api';
import BusinessCard from './BusinessCard';

const steps = [
  { label: 'Create Business', description: 'Register your business and funding goal.' },
  { label: 'Add Performance', description: 'Submit quarterly performance reports.' },
  { label: 'Track Investments', description: 'Monitor investments and funding progress.' },
  { label: 'Distribute Profits', description: 'Share profits with investors.' },
];

export default function BusinessDashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('Business Owner'); // You can fetch this from user context/auth if available
  const ownerId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true);
      try {
        const data = await businessAPI.getAllBusinesses({ owner: ownerId });
        setBusinesses(data.businesses || []);
        setError(null);
      } catch (err) {
        setError('Failed to load your businesses');
      } finally {
        setLoading(false);
      }
    }
    fetchBusinesses();
  }, [ownerId]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Businesses</h2>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">{role}</span>
      </div>
      {/* Process Stepper */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {steps.map((step, idx) => (
          <div key={step.label} className="flex flex-col items-center flex-1">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-white mb-2 ${idx === 0 ? 'bg-blue-500' : idx === 1 ? 'bg-purple-500' : idx === 2 ? 'bg-yellow-500' : 'bg-green-500'}`}>{idx + 1}</div>
            <div className="text-sm font-semibold mb-1 text-center">{step.label}</div>
            <div className="text-xs text-gray-500 text-center">{step.description}</div>
            {idx < steps.length - 1 && (
              <div className="hidden md:block w-full h-1 bg-gray-200 my-2" style={{ marginLeft: '2.5rem', marginRight: '2.5rem' }}></div>
            )}
          </div>
        ))}
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {businesses.map(biz => <BusinessCard key={biz.id || biz._id} business={biz} />)}
      </div>
    </div>
  );
}
