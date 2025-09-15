import React from 'react';
import DistributionList from './DistributionList';

export default function DistributionDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Distribution Dashboard</h2>
      <DistributionList />
    </div>
  );
}
