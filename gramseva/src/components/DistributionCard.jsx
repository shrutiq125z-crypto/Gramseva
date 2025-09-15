import React from 'react';

export default function DistributionCard({ distribution }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <h3 className="font-bold text-lg mb-2">Business: {distribution.business?.name || distribution.business}</h3>
      <p className="mb-1">Period: Q{distribution.period?.quarter} {distribution.period?.year}</p>
      <p className="mb-1">Net Distribution: ₹{distribution.amounts?.netDistribution}</p>
      <p className="mb-1">Status: {distribution.status}</p>
    </div>
  );
}
