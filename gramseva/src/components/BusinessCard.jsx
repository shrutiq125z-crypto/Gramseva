import React from 'react';
import { Link } from 'react-router-dom';

export default function BusinessCard({ business }) {
  // Calculate funding progress
  const progress = business.fundingGoal > 0 ? Math.round((business.raisedAmount / business.fundingGoal) * 100) : 0;
  return (
    <div className="bg-white border rounded-xl shadow hover:shadow-xl transition flex flex-col overflow-hidden">
      {/* Image or placeholder */}
      <div className="h-32 w-full bg-gradient-to-r from-blue-200 to-blue-400 flex items-center justify-center">
        <img
          src={business.imageUrl || 'https://via.placeholder.com/300x100?text=Business'}
          alt={business.name}
          className="object-cover h-full w-full"
          onError={e => { e.target.src = 'https://via.placeholder.com/300x100?text=Business'; }}
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-800 truncate" title={business.name}>{business.name}</h3>
          <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 ml-2">{business.sector}</span>
        </div>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{business.description?.slice(0, 80) || 'No description.'}</p>
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Funding</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>₹{business.raisedAmount}</span>
            <span>Goal: ₹{business.fundingGoal}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className={`text-xs font-semibold px-2 py-1 rounded ${business.status === 'open' ? 'bg-green-100 text-green-700' : business.status === 'funded' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'}`}>{business.status}</span>
          <Link
            to={`/business/${business.id || business._id}`}
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
