"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const userName = "John Doe";
  const balance = 12540.75;

  // Handle logout
  const handleLogout = () => {
    // Here you can also clear auth state or tokens if you implement auth
    router.replace("/login"); // Redirect to login page
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* LEFT SECTION */}
      <aside style={{ width: "220px", padding: "1.5rem", background: "#f4f4f4" }}>
        <h3>Bank Menu</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ cursor: "pointer", marginBottom: "0.5rem" }} onClick={() => router.push("/transactions")}>
                📄 Transactions
            </li>
            <li style={{ cursor: "pointer", marginBottom: "0.5rem" }} onClick={() => router.push("/transfers")}>
                💸 Transfers
            </li>
            <li style={{ cursor: "pointer", marginBottom: "0.5rem" }} onClick={() => router.push("/investments")}>
                📈 Investments
            </li>
            <li style={{ cursor: "pointer", marginBottom: "0.5rem" }} onClick={() => router.push("/bills")}>
                🧾 Bills & Payments
            </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <h1>Welcome, {userName}</h1>

        {/* Balance */}
        <div style={{ marginTop: "1rem", padding: "1.5rem", background: "#e6f0ff", borderRadius: "8px" }}>
          <h2>Account Balance</h2>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
            ${balance.toLocaleString()}
          </p>
          <p>Your balance reflects all completed transactions as of today.</p>
        </div>

        <p style={{ marginTop: "1.5rem" }}>
          Recent activity and account insights are shown below to help you manage your finances effectively.
        </p>
      </main>

      {/* RIGHT SECTION – Settings */}
      <aside style={{ width: "220px", padding: "1.5rem", background: "#f9f9f9", borderLeft: "1px solid #ddd" }}>
        <h3>Settings</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>👤 Profile</li>
          <li>🔒 Security</li>
          <li>🔔 Notifications</li>
          <li>🌙 Appearance</li>
          <li>
            🚪{" "}
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                color: "#0070f3",
                fontSize: "1rem",
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
}
