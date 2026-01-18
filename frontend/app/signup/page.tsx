"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreditCardValidator, images } from 'react-creditcard-validator';

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("RON");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const router = useRouter();

  // Custom expiry date validator
  function expDateValidate(month: string, year: string) {
    if (Number(year) > 2035) {
      return 'Expiry Date Year cannot be greater than 2035';
    }
    return;
  }

  const {
    getCardNumberProps,
    getCardImageProps,
    getCVCProps,
    getExpiryDateProps,
    meta: { erroredInputs }
  } = useCreditCardValidator({ expiryDateValidator: expDateValidate });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Full name validation
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Cardholder name validation
    if (!cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    // Balance validation
    if (!balance.trim()) {
      newErrors.balance = "Balance is required";
    } else if (isNaN(Number(balance)) || Number(balance) < 0) {
      newErrors.balance = "Balance must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check for credit card validation errors
    if (erroredInputs.cardNumber || erroredInputs.expiryDate || erroredInputs.cvc) {
      setGeneralError("Please fix credit card validation errors");
      return;
    }

    setGeneralError("");

    // Get card values from the form
    const cardNumberInput = document.querySelector('input[name="cardNumber"]') as HTMLInputElement;
    const expiryDateInput = document.querySelector('input[name="expiryDate"]') as HTMLInputElement;
    const cvcInput = document.querySelector('input[name="cvc"]') as HTMLInputElement;

    const signupData = {
      full_name: fullName,
      email: email,
      password: password,
      card_info: {
        name: cardholderName,
        card_number: cardNumberInput?.value.replace(/\s/g, ''),
        cvv: cvcInput?.value,
        expiration_date: expiryDateInput?.value,
        balance: parseFloat(balance),
        currency: currency
      }
    };

    console.log("Signup data:", signupData);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const result = await response.json();

      if (response.ok) {
        // Redirect to login page after successful signup
        router.push("/login");
      } else {
        setGeneralError(`Signup failed: ${result.detail || result.error}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setGeneralError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Create Account</h1>
        <p className="text-center text-gray-600 mb-6">Sign up with Honey Encryption</p>

        {/* General Error */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-2">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
              }}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.fullName ? "border-red-500" : ""
              }`}
            />
            {errors.fullName && (
              <small className="text-red-500 text-xs mt-1">{errors.fullName}</small>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <small className="text-red-500 text-xs mt-1">{errors.email}</small>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <small className="text-red-500 text-xs mt-1">{errors.password}</small>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && (
              <small className="text-red-500 text-xs mt-1">{errors.confirmPassword}</small>
            )}
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="Name on card"
              value={cardholderName}
              onChange={(e) => {
                setCardholderName(e.target.value);
                if (errors.cardholderName) setErrors((prev) => ({ ...prev, cardholderName: "" }));
              }}
              className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.cardholderName ? "border-red-500" : ""
              }`}
            />
            {errors.cardholderName && (
              <small className="text-red-500 text-xs mt-1">{errors.cardholderName}</small>
            )}
          </div>

          {/* Balance and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Initial Balance
              </label>
              <input
                type="number"
                placeholder="1000.00"
                value={balance}
                min="0"
                step="0.01"
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only up to 2 decimal places
                  if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                    setBalance(value);
                  }
                  if (errors.balance) setErrors((prev) => ({ ...prev, balance: "" }));
                }}
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.balance ? "border-red-500" : ""
                }`}
              />
              {errors.balance && (
                <small className="text-red-500 text-xs mt-1">{errors.balance}</small>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
              >
                <option value="RON">RON</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>

          {/* Card Number with Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <div className="relative">
              <input
                {...getCardNumberProps()}
                className="w-full border rounded-lg p-3 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="1234 5678 9012 3456"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg {...getCardImageProps({ images })} className="h-8 w-auto" />
              </div>
            </div>
            {erroredInputs.cardNumber && (
              <small className="text-red-500 text-xs mt-1">{erroredInputs.cardNumber}</small>
            )}
          </div>

          {/* Expiry Date and CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                {...getExpiryDateProps()}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="MM/YY"
              />
              {erroredInputs.expiryDate && (
                <small className="text-red-500 text-xs mt-1">{erroredInputs.expiryDate}</small>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                {...getCVCProps()}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="123"
              />
              {erroredInputs.cvc && (
                <small className="text-red-500 text-xs mt-1">{erroredInputs.cvc}</small>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition mt-4 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
