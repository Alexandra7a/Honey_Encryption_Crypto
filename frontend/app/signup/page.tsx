"use client";

import { useState } from "react";
import { useCreditCardValidator, images } from 'react-creditcard-validator';

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      alert("Please fix credit card validation errors");
      return;
    }

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
        expiration_date: expiryDateInput?.value
      }
    };

    console.log("Signup data:", signupData);

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
        alert("Signup successful!");
        // Reset form or redirect
      } else {
        alert(`Signup failed: ${result.detail || result.error}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Create Account</h1>
        <p className="text-center text-gray-600 mb-6">Sign up with Honey Encryption</p>

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
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {errors.cardholderName && (
              <small className="text-red-500 text-xs mt-1">{errors.cardholderName}</small>
            )}
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
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition mt-4 shadow-md"
          >
            Create Account
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
