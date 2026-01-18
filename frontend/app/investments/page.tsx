"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const investments = [
  { name: "Tech Stocks", type: "Equities", value: 5400, change: 120, allocation: 35 },
  { name: "Bonds", type: "Fixed Income", value: 2500, change: -20, allocation: 16 },
  { name: "Crypto", type: "Digital Assets", value: 1200, change: 85, allocation: 8 },
  { name: "Mutual Funds", type: "Funds", value: 3200, change: 45, allocation: 21 },
  { name: "Index ETF", type: "ETF", value: 3100, change: 60, allocation: 20 },
];

export default function InvestmentsPage() {
  const totalValue = investments.reduce((sum, i) => sum + i.value, 0);
  const totalChange = investments.reduce((sum, i) => sum + i.change, 0);

  return (
    <div className="min-h-screen bg-[#f4f0e1] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Investment Portfolio</h1>
        <p className="text-slate-600 mb-6">Overview of your current assets and performance</p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#fffdf7] rounded-2xl border border-gray-200  shadow-sm hover:shadow-md  hover:bg-[#faf7ef] p-5">
            <p className="text-sm text-slate-500">Total Portfolio Value</p>
            <p className="text-2xl font-semibold">${totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-[#fffdf7] rounded-2xl border border-gray-200  shadow-sm hover:shadow-md  hover:bg-[#faf7ef] p-5">
            <p className="text-sm text-slate-500">Total Daily Change</p>
            <p className={`text-2xl font-semibold ${totalChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {totalChange >= 0 ? "+" : ""}${totalChange}
            </p>
          </div>
        </div>

        <div className="bg-[#fffdf7] rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-[#f4ecd4] border-b border-gray-200">
              <tr>
                <th className="p-4 text-left">Asset</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-right">Value ($)</th>
                <th className="p-4 text-right">Change</th>
                <th className="p-4 text-right">Allocation</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv, index: number) => (
                <tr key={index} className="border-b last:border-none  hover:bg-[#faf7ef] transition">
                  <td className="p-4 font-medium">{inv.name}</td>
                  <td className="p-4 text-slate-600">{inv.type}</td>
                  <td className="p-4 text-right">{inv.value.toLocaleString()}</td>
                  <td
                    className={`p-4 text-right font-semibold flex items-center justify-end gap-1 ${
                      inv.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {inv.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {inv.change >= 0 ? "+" : ""}${inv.change}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 bg-blue-600"
                          style={{ width: `${inv.allocation}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600">{inv.allocation}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
