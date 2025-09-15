import React, { useEffect, useState } from 'react';
import { investmentAPI } from '../services/api';
import InvestmentCard from './InvestmentCard';

export default function InvestmentList() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInvestments() {
      setLoading(true);
      try {
        const data = await investmentAPI.getUserInvestments();
        setInvestments(data.investments || []);
        setError(null);
      } catch (err) {
        setError('Failed to load investments');
      } finally {
        setLoading(false);
      }
    }
    fetchInvestments();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Investments</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {investments.map(inv => <InvestmentCard key={inv.id || inv._id} investment={inv} />)}
      </div>
    </div>
  );
}
