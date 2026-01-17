"use client";

const bills = [
  { name: "Electricity", due: "2026-01-20", amount: 120.5, status: "Pending" },
  { name: "Water", due: "2026-01-22", amount: 45.75, status: "Paid" },
  { name: "Internet", due: "2026-01-25", amount: 60, status: "Pending" },
  { name: "Credit Card", due: "2026-01-30", amount: 350, status: "Pending" },
];

export default function BillsPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Bills & Payments</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Bill</th>
            <th style={{ padding: "0.75rem", textAlign: "center" }}>Due Date</th>
            <th style={{ padding: "0.75rem", textAlign: "right" }}>Amount ($)</th>
            <th style={{ padding: "0.75rem", textAlign: "center" }}>Status</th>
            <th style={{ padding: "0.75rem", textAlign: "center" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {bills.map((bill, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #e0e0e0" }}>
              <td style={{ padding: "0.75rem" }}>{bill.name}</td>
              <td style={{ padding: "0.75rem", textAlign: "center" }}>{bill.due}</td>
              <td style={{ padding: "0.75rem", textAlign: "right" }}>{bill.amount.toFixed(2)}</td>
              <td
                style={{
                  padding: "0.75rem",
                  textAlign: "center",
                  color: bill.status === "Paid" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {bill.status}
              </td>
              <td style={{ padding: "0.75rem", textAlign: "center" }}>
                {bill.status === "Pending" ? (
                  <button
                    style={{
                      padding: "0.4rem 0.8rem",
                      background: "#0070f3",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() => alert(`Paid ${bill.name} successfully!`)}
                  >
                    Pay Now
                  </button>
                ) : (
                  <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
