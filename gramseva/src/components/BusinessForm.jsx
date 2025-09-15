import React, { useState } from 'react';
import { businessAPI } from '../services/api';

const initialState = {
  name: '',
  description: '',
  sector: '',
  fundingGoal: '',
  longitude: '',
  latitude: '',
};

export default function BusinessForm({ business, onSuccess }) {
  const [form, setForm] = useState(business ? {
    ...business,
    longitude: business.location?.coordinates?.[0] || '',
    latitude: business.location?.coordinates?.[1] || '',
  } : initialState);
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
        name: form.name,
        description: form.description,
        sector: form.sector,
        fundingGoal: Number(form.fundingGoal),
        location: {
          type: 'Point',
          coordinates: [Number(form.longitude), Number(form.latitude)],
        },
      };
      if (business && business._id) {
        await businessAPI.updateBusiness(business._id, data);
        setSuccess('Business updated!');
      } else {
        await businessAPI.createBusiness(data);
        setSuccess('Business created!');
        setForm(initialState);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to save business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">{business ? 'Edit' : 'Create'} Business</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="block w-full mb-2 border rounded px-2 py-1" required />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="block w-full mb-2 border rounded px-2 py-1" required />
      <select name="sector" value={form.sector} onChange={handleChange} className="block w-full mb-2 border rounded px-2 py-1" required>
        <option value="">Select Sector</option>
        <option value="agriculture">Agriculture</option>
        <option value="technology">Technology</option>
        <option value="manufacturing">Manufacturing</option>
        <option value="retail">Retail</option>
        <option value="services">Services</option>
        <option value="healthcare">Healthcare</option>
        <option value="education">Education</option>
        <option value="finance">Finance</option>
        <option value="real_estate">Real Estate</option>
        <option value="energy">Energy</option>
        <option value="transportation">Transportation</option>
        <option value="food_beverage">Food & Beverage</option>
        <option value="other">Other</option>
      </select>
      <input name="fundingGoal" type="number" value={form.fundingGoal} onChange={handleChange} placeholder="Funding Goal (₹)" className="block w-full mb-2 border rounded px-2 py-1" required />
      <input name="longitude" type="number" value={form.longitude} onChange={handleChange} placeholder="Longitude" className="block w-full mb-2 border rounded px-2 py-1" required />
      <input name="latitude" type="number" value={form.latitude} onChange={handleChange} placeholder="Latitude" className="block w-full mb-2 border rounded px-2 py-1" required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Saving...' : (business ? 'Update' : 'Create')}</button>
    </form>
  );
}
