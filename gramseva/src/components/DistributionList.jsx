import React, { useEffect, useState } from 'react';
import { distributionAPI } from '../services/api';
import DistributionCard from './DistributionCard';

export default function DistributionList() {
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDistributions() {
      setLoading(true);
      try {
        const data = await distributionAPI.getUserDistributions();
        setDistributions(data.distributions || []);
        setError(null);
      } catch (err) {
        setError('Failed to load distributions');
      } finally {
        setLoading(false);
      }
    }
    fetchDistributions();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Distributions</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {distributions.map(dist => <DistributionCard key={dist.id || dist._id} distribution={dist} />)}
      </div>
    </div>
  );
}
