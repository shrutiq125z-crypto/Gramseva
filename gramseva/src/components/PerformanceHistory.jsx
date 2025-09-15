import React from 'react';

export default function PerformanceHistory({ performance }) {
  if (!performance || performance.length === 0) return <div>No performance history.</div>;
  return (
    <div className="overflow-x-auto">
      <h3 className="font-bold mb-2">Performance History</h3>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Year</th>
            <th className="border px-2 py-1">Quarter</th>
            <th className="border px-2 py-1">Revenue</th>
            <th className="border px-2 py-1">Expenses</th>
            <th className="border px-2 py-1">Profit</th>
            <th className="border px-2 py-1">Loss</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {performance.map((p, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{p.period?.year}</td>
              <td className="border px-2 py-1">{p.period?.quarter}</td>
              <td className="border px-2 py-1">₹{p.revenue}</td>
              <td className="border px-2 py-1">₹{p.expenses}</td>
              <td className="border px-2 py-1">₹{p.profit}</td>
              <td className="border px-2 py-1">₹{p.loss}</td>
              <td className="border px-2 py-1">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
