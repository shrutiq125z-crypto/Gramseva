import React, { useState } from 'react';
import { investmentAPI } from '../services/api';

const initialState = {
  amount: '',
  expectedReturn: '',
  investmentPeriod: '',
  riskLevel: 'medium',
};

export default function InvestmentForm({ businessId, onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = {
        business: businessId,
        amount: Number(form.amount),
        terms: {
          expectedReturn: Number(form.expectedReturn),
          investmentPeriod: Number(form.investmentPeriod),
          riskLevel: form.riskLevel,
        },
      };
      await investmentAPI.createInvestment(data);
      setSuccess('Investment created!');
      setForm(initialState);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to create investment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Invest in Business</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount (₹)" className="block w-full mb-2 border rounded px-2 py-1" required />
      <input name="expectedReturn" type="number" value={form.expectedReturn} onChange={handleChange} placeholder="Expected Return (%)" className="block w-full mb-2 border rounded px-2 py-1" required />
      <input name="investmentPeriod" type="number" value={form.investmentPeriod} onChange={handleChange} placeholder="Period (months)" className="block w-full mb-2 border rounded px-2 py-1" required />
      <select name="riskLevel" value={form.riskLevel} onChange={handleChange} className="block w-full mb-2 border rounded px-2 py-1">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Investing...' : 'Invest'}</button>
    </form>
  );
}
