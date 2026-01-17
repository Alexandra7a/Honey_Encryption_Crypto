"use client";

const transactions = [
  { date: "2026-01-17", description: "Starbucks Coffee", type: "debit", amount: 5.25 },
  { date: "2026-01-15", description: "Salary", type: "credit", amount: 2500 },
  { date: "2026-01-14", description: "Electric Bill", type: "debit", amount: 120.5 },
  { date: "2026-01-13", description: "Grocery Store", type: "debit", amount: 89.75 },
  { date: "2026-01-12", description: "Freelance Payment", type: "credit", amount: 450 },
];

export default function TransactionsPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Transactions</h1>
      <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Date</th>
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Description</th>
            <th style={{ padding: "0.75rem", textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #e0e0e0" }}>
              <td style={{ padding: "0.75rem" }}>{t.date}</td>
              <td style={{ padding: "0.75rem" }}>{t.description}</td>
              <td
                style={{
                  padding: "0.75rem",
                  textAlign: "right",
                  color: t.type === "debit" ? "red" : "green",
                  fontWeight: "bold",
                }}
              >
                {t.type === "debit" ? "-" : "+"}${t.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
