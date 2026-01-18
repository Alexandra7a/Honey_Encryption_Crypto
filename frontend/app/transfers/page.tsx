"use client";
import { useState } from "react";

export default function TransfersPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState([
    { recipient: "Alice Johnson", amount: 150.25, date: "2026-01-14" },
    { recipient: "Bob Smith", amount: 200, date: "2026-01-12" },
    { recipient: "Charlie Brown", amount: 50.5, date: "2026-01-10" },
    { recipient: "Diana Prince", amount: 320.75, date: "2025-12-28" },
    { recipient: "Ethan Hunt", amount: 500, date: "2025-12-20" },
    { recipient: "Fiona Gallagher", amount: 75.3, date: "2025-11-30" },
    { recipient: "George Michael", amount: 120, date: "2025-11-25" },
    { recipient: "Hannah Baker", amount: 60, date: "2025-11-20" },
    { recipient: "Ian Malcolm", amount: 420, date: "2025-11-15" },
    { recipient: "Jessica Jones", amount: 89.99, date: "2025-11-12" },
    { recipient: "Kevin Hart", amount: 250, date: "2025-10-28" },
    { recipient: "Laura Palmer", amount: 130.45, date: "2025-10-22" },
    { recipient: "Michael Scott", amount: 300, date: "2025-10-18" },
    { recipient: "Nancy Drew", amount: 95.5, date: "2025-09-30" },
    { recipient: "Oscar Wilde", amount: 175, date: "2025-09-15" },
    { recipient: "Pam Beesly", amount: 210, date: "2025-09-10" },
  ]);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransfer = {
      recipient,
      amount: parseFloat(amount),
      date: new Date().toISOString().split("T")[0],
    };
    setHistory([newTransfer, ...history]);
    alert(`$${amount} transferred to ${recipient}`);
    setRecipient("");
    setAmount("");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Transfer Money</h1>

      {/* Transfer Form */}
      <form
        onSubmit={handleTransfer}
        className="bg-white shadow-md rounded-2xl p-6 flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Recipient Name"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Send Money
        </button>
      </form>

      {/* Recent Transfers */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Transfers</h2>
        <ul className="flex flex-col gap-3">
          {history.map((t, idx) => (
            <li
              key={idx}
              className="flex justify-between bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
            >
              <div>
                <span className="font-medium">{t.recipient}</span>
                <p className="text-gray-500 text-sm">{t.date}</p>
              </div>
              <div className="font-semibold text-green-600">
                ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
