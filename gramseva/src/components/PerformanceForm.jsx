import React, { useState } from 'react';
import { performanceAPI } from '../services/api';

const initialState = {
  year: '',
  quarter: '',
  revenue: '',
  expenses: '',
  notes: '',
};

export default function PerformanceForm({ businessId, onSuccess }) {
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
        period: {
          year: Number(form.year),
          quarter: Number(form.quarter),
        },
        revenue: Number(form.revenue),
        expenses: Number(form.expenses),
        notes: form.notes,
      };
      await performanceAPI.submitPerformance(data);
      setSuccess('Performance report submitted!');
      setForm(initialState);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to submit performance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Submit Performance Report</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <input name="year" type="number" value={form.year} onChange={handleChange} placeholder="Year" className="block w-full mb-2 border rounded px-2 py-1" required />
      <input name="quarter" type="number" value={form.quarter} onChange={handleChange} placeholder="Quarter (1-4)" className="block w-full mb-2 border rounded px-2 py-1" required min="1" max="4" />
      <input name="revenue" type="number" value={form.revenue} onChange={handleChange} placeholder="Revenue (₹)" className="block w-full mb-2 border rounded px-2 py-1" required />
      <input name="expenses" type="number" value={form.expenses} onChange={handleChange} placeholder="Expenses (₹)" className="block w-full mb-2 border rounded px-2 py-1" required />
      <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="block w-full mb-2 border rounded px-2 py-1" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
    </form>
  );
}
