import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { businessAPI, investmentAPI, performanceAPI, distributionAPI } from '../services/api';

export default function BusinessDetail() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Related data
  const [investments, setInvestments] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [distributions, setDistributions] = useState([]);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [biz, inv, perf, dist] = await Promise.all([
          businessAPI.getBusinessById(id),
          investmentAPI.getBusinessInvestments(id),
          performanceAPI.getBusinessPerformance(id),
          distributionAPI.getBusinessDistributions(id),
        ]);
        setBusiness(biz.business || biz);
        setInvestments(inv.investments || inv);
        setPerformance(perf.performance || perf);
        setDistributions(dist.distributions || dist);
        setError(null);
      } catch (err) {
        setError('Failed to load business details');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!business) return <div>No business found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{business.name}</h2>
      <p className="mb-2">{business.description}</p>
      <p className="mb-2">Sector: {business.sector}</p>
      <p className="mb-2">Funding: ₹{business.raisedAmount} / ₹{business.fundingGoal}</p>
      <p className="mb-2">Status: {business.status}</p>
      <h3 className="font-bold mt-6 mb-2">Investments</h3>
      <ul className="mb-4">
        {investments.length === 0 ? <li>No investments yet.</li> : investments.map(inv => (
          <li key={inv.id || inv._id}>Investor: {inv.investor?.username || inv.investor} | Amount: ₹{inv.amount} | Status: {inv.status}</li>
        ))}
      </ul>
      <h3 className="font-bold mt-6 mb-2">Performance</h3>
      <ul className="mb-4">
        {performance.length === 0 ? <li>No performance reports yet.</li> : performance.map(perf => (
          <li key={perf.id || perf._id}>Q{perf.period?.quarter} {perf.period?.year} | Revenue: ₹{perf.revenue} | Profit: ₹{perf.profit}</li>
        ))}
      </ul>
      <h3 className="font-bold mt-6 mb-2">Distributions</h3>
      <ul>
        {distributions.length === 0 ? <li>No distributions yet.</li> : distributions.map(dist => (
          <li key={dist.id || dist._id}>Investor: {dist.investor?.username || dist.investor} | Net: ₹{dist.amounts?.netDistribution} | Status: {dist.status}</li>
        ))}
      </ul>
    </div>
  );
}
