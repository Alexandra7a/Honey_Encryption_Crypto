"use client";

const transactions = [
  { date: "2026-01-17", description: "Starbucks Coffee", type: "debit", amount: 24.99 },
  { date: "2026-01-16", description: "Amazon Purchase", type: "debit", amount: 89.99 },
  { date: "2026-01-15", description: "Salary", type: "credit", amount: 7480 },
  { date: "2026-01-15", description: "Uber Ride", type: "debit", amount: 15.6 },
  { date: "2026-01-14", description: "Electric Bill", type: "debit", amount: 500},
  { date: "2026-01-14", description: "Freelance Payment", type: "credit", amount: 700 },
  { date: "2026-01-13", description: "Grocery Store", type: "debit", amount: 150.75 },
  { date: "2026-01-12", description: "Spotify Subscription", type: "debit", amount: 39.99 },
  { date: "2026-01-11", description: "Dividend Payment", type: "credit", amount: 120 },
  { date: "2026-01-10", description: "Gym Membership", type: "debit", amount: 120 },
  { date: "2025-12-30", description: "Christmas Gifts", type: "debit", amount: 550.5 },
  { date: "2025-12-28", description: "Netflix Subscription", type: "debit", amount: 59.99 },
  { date: "2025-12-25", description: "Salary", type: "credit", amount: 7480 },
  { date: "2025-12-20", description: "Dinner at Olive Garden", type: "debit", amount: 150.75 },
  { date: "2025-12-15", description: "Electric Bill", type: "debit", amount: 550 },
  { date: "2025-12-12", description: "Freelance Payment", type: "credit", amount: 700 },
  { date: "2025-11-30", description: "Amazon Purchase", type: "debit", amount: 72.45 },
  { date: "2025-11-25", description: "Salary", type: "credit", amount: 7480 },
  { date: "2025-11-22", description: "Grocery Store", type: "debit", amount: 102.75 },
  { date: "2025-11-20", description: "Car Maintenance", type: "debit", amount: 2500 },
  { date: "2025-11-15", description: "Freelance Payment", type: "credit", amount: 700 },
  { date: "2025-11-12", description: "Gym Membership", type: "debit", amount: 120 },
];

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-[#f4f0e1] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Your recent account activity
          </p>
        </div>

        <div className="overflow-x-auto shadow-md rounded-xl">
          <table className="w-full border-collapse bg-[#fffdf7] rounded-xl">
            <thead className="bg-[#f4ecd4] border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-800">
                  Date
                </th>
                <th className="text-left px-6 py-3 font-semibold text-gray-800">
                  Description
                </th>
                <th className="text-right px-6 py-3 font-semibold text-gray-800">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 hover:bg-[#faf7ef] transition"
                >
                  <td className="px-6 py-4 text-gray-700">{t.date}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {t.description}
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${
                      t.type === "debit"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {t.type === "debit" ? "-" : "+"}
                    {t.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })} RON
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
