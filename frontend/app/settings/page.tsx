"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  // Fake user data
  const user = {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "mypassword123",
    cardNumber: "1234 5678 9012 3456",
    ccv: "123",
    expirationDate: "12/26",
  };

  // Mask sensitive info
  const mask = (value: string, visible = false) => {
    if (visible) return value;
    return value.replace(/./g, "•");
  };

  // Example notifications
  const notifications = [
    "New login from Chrome on Windows",
    "Monthly statement available",
    "Payment reminder: Electricity bill",
    "Promotional offers",
  ];

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "700px",
        margin: "auto",
        background: darkMode ? "#1c1c1c" : "#fff",
        color: darkMode ? "#f0f0f0" : "#000",
        borderRadius: "8px",
        boxShadow: "0 0 15px rgba(0,0,0,0.1)",
      }}
    >
      <h1>Account Settings</h1>

      {/* Personal Info */}
      <section style={{ marginTop: "1.5rem" }}>
        <h2>Personal Information</h2>
        <div style={{ display: "grid", gap: "1rem", marginTop: "0.5rem" }}>
          <div>
            <strong>Name:</strong> {user.name}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Password:</strong> {mask(user.password)}
          </div>
          <div>
            <strong>Card Number:</strong> {mask(user.cardNumber)}
          </div>
          <div>
            <strong>CCV:</strong> {mask(user.ccv)}
          </div>
          <div>
            <strong>Expiration Date:</strong> {mask(user.expirationDate)}
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Notifications</h2>
        <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
          {notifications.map((note, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>
              🔔 {note}
            </li>
          ))}
        </ul>
      </section>

      {/* Appearance */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Appearance</h2>
        <div style={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}>
          <label htmlFor="darkMode" style={{ marginRight: "0.5rem" }}>Dark Mode</label>
          <input
            id="darkMode"
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
        </div>
      </section>
    </div>
  );
}
