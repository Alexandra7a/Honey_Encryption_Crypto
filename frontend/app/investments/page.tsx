"use client";

const investments = [
  { name: "Tech Stocks", value: 5400, change: 120 },
  { name: "Bonds", value: 2500, change: -20 },
  { name: "Crypto", value: 1200, change: 85 },
  { name: "Mutual Funds", value: 3200, change: 45 },
];

export default function InvestmentsPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Investments Portfolio</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th style={{ padding: "0.75rem", textAlign: "left" }}>Investment</th>
            <th style={{ padding: "0.75rem", textAlign: "right" }}>Value ($)</th>
            <th style={{ padding: "0.75rem", textAlign: "right" }}>Change ($)</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #e0e0e0" }}>
              <td style={{ padding: "0.75rem" }}>{inv.name}</td>
              <td style={{ padding: "0.75rem", textAlign: "right" }}>{inv.value.toLocaleString()}</td>
              <td
                style={{
                  padding: "0.75rem",
                  textAlign: "right",
                  color: inv.change >= 0 ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {inv.change >= 0 ? `+${inv.change}` : inv.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
