"use client";

const transactions = [
  // Current year 2026
  { date: "2026-01-17", description: "Starbucks Coffee", type: "debit", amount: 5.25 },
  { date: "2026-01-16", description: "Amazon Purchase", type: "debit", amount: 89.99 },
  { date: "2026-01-15", description: "Salary", type: "credit", amount: 2500 },
  { date: "2026-01-15", description: "Uber Ride", type: "debit", amount: 15.6 },
  { date: "2026-01-14", description: "Electric Bill", type: "debit", amount: 120.5 },
  { date: "2026-01-14", description: "Freelance Payment", type: "credit", amount: 450 },
  { date: "2026-01-13", description: "Grocery Store", type: "debit", amount: 89.75 },
  { date: "2026-01-12", description: "Spotify Subscription", type: "debit", amount: 9.99 },
  { date: "2026-01-11", description: "Dividend Payment", type: "credit", amount: 120 },
  { date: "2026-01-10", description: "Gym Membership", type: "debit", amount: 45 },
  
  // Last year 2025
  { date: "2025-12-30", description: "Christmas Gifts", type: "debit", amount: 320.5 },
  { date: "2025-12-28", description: "Netflix Subscription", type: "debit", amount: 14.99 },
  { date: "2025-12-25", description: "Salary", type: "credit", amount: 2450 },
  { date: "2025-12-20", description: "Dinner at Olive Garden", type: "debit", amount: 58.3 },
  { date: "2025-12-15", description: "Electric Bill", type: "debit", amount: 115.2 },
  { date: "2025-12-12", description: "Freelance Payment", type: "credit", amount: 500 },
  { date: "2025-11-30", description: "Amazon Purchase", type: "debit", amount: 72.45 },
  { date: "2025-11-25", description: "Salary", type: "credit", amount: 2450 },
  { date: "2025-11-22", description: "Grocery Store", type: "debit", amount: 102.75 },
  { date: "2025-11-20", description: "Car Maintenance", type: "debit", amount: 350 },
  { date: "2025-11-15", description: "Freelance Payment", type: "credit", amount: 400 },
  { date: "2025-11-12", description: "Gym Membership", type: "debit", amount: 45 },
];

export default function TransactionsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-700">Date</th>
              <th className="text-left px-6 py-3 font-medium text-gray-700">Description</th>
              <th className="text-right px-6 py-3 font-medium text-gray-700">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 text-gray-700">{t.date}</td>
                <td className="px-6 py-4 text-gray-700">{t.description}</td>
                <td
                  className={`px-6 py-4 text-right font-semibold ${
                    t.type === "debit" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {t.type === "debit" ? "-" : "+"}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
