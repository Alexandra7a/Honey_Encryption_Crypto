"use client";

import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const signupData = {
      name,
      email,
      password,
      message,
      cardNumber,
      cvv,
      expirationDate,
    };

    console.log("Signup data:", signupData);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Message */}
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Card Number */}
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />

        {/* CvV */}
        <input
          type="text"
          placeholder="CvV"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          required
        />

        {/* Expiration Date */}
        <input
          type="month"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          required
        />

        <button type="submit" style={{ marginTop: "1rem" }}>
          Create Account
        </button>
      </form>
    </div>
  );
}
