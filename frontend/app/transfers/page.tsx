"use client";
import { useState } from "react";

export default function TransfersPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`$${amount} transferred to ${recipient}`);
    setRecipient("");
    setAmount("");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Transfer Money</h1>
      <form onSubmit={handleTransfer} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Recipient Name"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
          style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={{ padding: "0.75rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Send Money
        </button>
      </form>

      <div style={{ marginTop: "2rem", padding: "1rem", background: "#f9f9f9", borderRadius: "8px" }}>
        <h3>Recent Transfers</h3>
        <ul>
          <li>💸 $150 to Alice – 2026-01-14</li>
          <li>💸 $200 to Bob – 2026-01-12</li>
          <li>💸 $50 to Charlie – 2026-01-10</li>
        </ul>
      </div>
    </div>
  );
}
