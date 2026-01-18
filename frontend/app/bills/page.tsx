"use client";

import { useState } from "react";

const initialBills = [
  { name: "Electricity", due: "2026-01-20", amount: 750, status: "Pending", category: "Utilities" },
  { name: "Water", due: "2026-01-22", amount: 450, status: "Paid", category: "Utilities" },
  { name: "Internet", due: "2026-01-25", amount: 100, status: "Pending", category: "Utilities" },
  { name: "Credit Card", due: "2026-01-30", amount: 1500, status: "Pending", category: "Finance" },
  { name: "Rent", due: "2026-02-01", amount: 3000, status: "Pending", category: "Housing" },
  { name: "Car Insurance", due: "2026-02-05", amount: 2000, status: "Paid", category: "Insurance" },
  { name: "Streaming Service", due: "2026-02-08", amount: 49.99, status: "Pending", category: "Subscriptions" },
  { name: "Mobile Phone", due: "2026-02-10", amount: 85, status: "Pending", category: "Utilities" },
];

export default function BillsPage() {
  const [bills, setBills] = useState(initialBills);

  const payBill = (index: number) => {
    const updated = [...bills];
    updated[index].status = "Paid";
    setBills(updated);
  };

  const totalDue = bills
    .filter((b) => b.status === "Pending")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="min-h-screen bg-[#f4f0e1] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Bills & Payments</h1>
        <p className="text-slate-600 mb-6">Track upcoming bills and manage payments</p>

        <div className="bg-[#fffdf7] rounded-2xl border border-gray-200 shadow-sm hover:shadow-md  hover:bg-[#faf7ef] p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Total Pending Amount</p>
            <p className="text-2xl font-semibold text-red-600">{totalDue.toFixed(2)} RON</p>
          </div>
          <div className="text-sm text-slate-400">Updated in real-time</div>
        </div>

        <div className="overflow-x-auto bg-[#fffdf7] rounded-2xl border border-gray-200">
          <table className="w-full border-collapse">
            <thead className="bg-[#f4ecd4] border-b border-gray-200">
              <tr>
                <th className="p-4 text-left">Bill</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-center">Due Date</th>
                <th className="p-4 text-right">Amount (RON)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, i: number) => (
                <tr key={i} className="border-b last:border-none hover:bg-[#faf7ef] transition">
                  <td className="p-4 font-medium">{bill.name}</td>
                  <td className="p-4 text-slate-600">{bill.category}</td>
                  <td className="p-4 text-center">{bill.due}</td>
                  <td className="p-4 text-right">{bill.amount.toFixed(2)}</td>
                  <td
                    className={`p-4 text-center font-semibold ${
                      bill.status === "Paid" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {bill.status}
                  </td>
                  <td className="p-4 text-center">
                    {bill.status === "Pending" ? (
                      <button
                        className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-700 transition"
                        onClick={() => payBill(i)}
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
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
