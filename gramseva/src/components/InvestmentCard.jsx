import React from 'react';

export default function InvestmentCard({ investment }) {
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <h3 className="font-bold text-lg mb-2">Business: {investment.business?.name || investment.business}</h3>
      <p className="mb-1">Amount: ₹{investment.amount}</p>
      <p className="mb-1">Status: {investment.status}</p>
      <p className="mb-1">Expected Return: {investment.terms?.expectedReturn}%</p>
      <p className="mb-1">Period: {investment.terms?.investmentPeriod} months</p>
      <p className="mb-1">Risk: {investment.terms?.riskLevel}</p>
    </div>
  );
}
