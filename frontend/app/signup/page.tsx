"use client";

import { useState } from "react";

const categories = {
  Compliment: ["Great service", "Excellent support", "User friendly"],
  Complaint: ["Slow response", "Bug in app", "Poor service"],
  Suggestion: ["Add dark mode", "Improve UI", "More payment options"],
};

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const signupData = { name, email, password, category, message, cardNumber, cvv, expirationDate };
    console.log("Signup data:", signupData);
    alert("Signup complete! Check console for data.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Category selection */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setMessage(""); // reset message when category changes
            }}
            required
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {Object.keys(categories).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Message selection dependent on category */}
          {category && (
            <select
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Message</option>
              {categories[category].map((msg) => (
                <option key={msg} value={msg}>{msg}</option>
              ))}
            </select>
          )}

          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="CVV"
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="month"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white rounded p-2 font-semibold hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
