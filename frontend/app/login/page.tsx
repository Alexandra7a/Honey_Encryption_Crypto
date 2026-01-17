"use client";
import React, { useState } from "react";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Fake validation - replace with real auth
    if (email && password) {
      console.log("Logged in:", { email, password });
      router.replace("/template"); // Redirect to dashboard
    } else {
      alert("Please fill in both fields");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Banking App Login</h1>

      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Login
        </button>
      </form>

      {/* Sign up navigation */}
      <p style={{ marginTop: "1rem" }}>Don’t have an account?</p>
      <button
        onClick={() => router.push("/signup")}
        style={{ marginTop: "0.5rem" }}
      >
        Go to Sign Up
      </button>
    </div>
  );
};

export default LoginPage;
