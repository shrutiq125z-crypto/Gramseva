import React from 'react';

export default function PerformanceChart({ performance }) {
  if (!performance || performance.length === 0) return <div>No performance data.</div>;
  // Find max value for scaling
  const max = Math.max(...performance.map(p => Math.max(p.revenue, p.expenses, p.profit)));
  return (
    <div className="w-full">
      <h3 className="font-bold mb-2">Performance Chart</h3>
      <div className="flex gap-2 items-end h-48">
        {performance.map((p, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="flex gap-1">
              <div style={{ height: `${(p.revenue / max) * 100}%` }} className="w-4 bg-green-400" title={`Revenue: ₹${p.revenue}`}></div>
              <div style={{ height: `${(p.expenses / max) * 100}%` }} className="w-4 bg-red-400" title={`Expenses: ₹${p.expenses}`}></div>
              <div style={{ height: `${(p.profit / max) * 100}%` }} className="w-4 bg-blue-400" title={`Profit: ₹${p.profit}`}></div>
            </div>
            <div className="text-xs mt-1">Q{p.period?.quarter} {p.period?.year}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2 text-xs">
        <span className="flex items-center"><span className="w-3 h-3 bg-green-400 inline-block mr-1"></span>Revenue</span>
        <span className="flex items-center"><span className="w-3 h-3 bg-red-400 inline-block mr-1"></span>Expenses</span>
        <span className="flex items-center"><span className="w-3 h-3 bg-blue-400 inline-block mr-1"></span>Profit</span>
      </div>
    </div>
  );
}
