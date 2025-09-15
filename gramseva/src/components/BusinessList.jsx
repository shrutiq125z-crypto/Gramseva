import React, { useEffect, useState } from 'react';
import { businessAPI } from '../services/api';
import BusinessCard from './BusinessCard';

export default function BusinessList() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Example filter state
  const [sector, setSector] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true);
      try {
        const params = {};
        if (sector) params.sector = sector;
        if (search) params.search = search;
        const data = await businessAPI.getAllBusinesses(params);
        setBusinesses(data.businesses || []);
        setError(null);
      } catch (err) {
        setError('Failed to load businesses');
      } finally {
        setLoading(false);
      }
    }
    fetchBusinesses();
  }, [sector, search]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Businesses</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <select value={sector} onChange={e => setSector(e.target.value)} className="border rounded px-2 py-1">
          <option value="">All Sectors</option>
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
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {businesses.map(biz => <BusinessCard key={biz.id || biz._id} business={biz} />)}
      </div>
    </div>
  );
}
