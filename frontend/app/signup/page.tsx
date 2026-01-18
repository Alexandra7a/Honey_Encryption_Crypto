"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Card type detection
const detectCardType = (number: string) => {
  const cleaned = number.replace(/\s/g, '');
  
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  
  return 'unknown';
};

// Luhn algorithm for card validation
const luhnCheck = (cardNumber: string) => {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d+$/.test(cleaned)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Format card number with spaces
const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\s/g, '');
  const cardType = detectCardType(cleaned);
  
  // American Express: 4-6-5 format
  if (cardType === 'amex') {
    const match = cleaned.match(/(\d{0,4})(\d{0,6})(\d{0,5})/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
  }
  
  // Others: 4-4-4-4 format
  const match = cleaned.match(/(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})/);
  if (match) {
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
  }
  
  return cleaned;
};

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("RON");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const router = useRouter();

  const cardType = detectCardType(cardNumber);

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    
    if (!cleaned) return "Card number is required";
    if (cleaned.length < 13 || cleaned.length > 19) return "Invalid card number length";
    if (!luhnCheck(cleaned)) return "Invalid card number";
    
    return "";
  };

  const validateExpiryDate = (expiry: string) => {
    if (!expiry) return "Expiry date is required";
    
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return "Invalid format (MM/YY)";
    
    const month = parseInt(match[1]);
    const year = parseInt(match[2]) + 2000;
    
    if (month < 1 || month > 12) return "Invalid month";
    if (year > 2035) return "Expiry year cannot be greater than 2035";
    
    const now = new Date();
    const expDate = new Date(year, month - 1);
    
    if (expDate < now) return "Card has expired";
    
    return "";
  };

  const validateCVV = (cvvValue: string, cardType: string) => {
    if (!cvvValue) return "CVV is required";
    
    const expectedLength = cardType === 'amex' ? 4 : 3;
    
    if (cvvValue.length !== expectedLength) {
      return cardType === 'amex' 
        ? "American Express requires 4-digit CVV"
        : "CVV must be 3 digits";
    }
    
    if (!/^\d+$/.test(cvvValue)) return "CVV must contain only digits";
    
    return "";
  };

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

    // Card number validation
    const cardError = validateCardNumber(cardNumber);
    if (cardError) newErrors.cardNumber = cardError;

    // Expiry date validation
    const expiryError = validateExpiryDate(expiryDate);
    if (expiryError) newErrors.expiryDate = expiryError;

    // CVV validation
    const cvvError = validateCVV(cvv, cardType);
    if (cvvError) newErrors.cvv = cvvError;

    // Balance validation
    if (!balance.trim()) {
      newErrors.balance = "Balance is required";
    } else if (isNaN(Number(balance)) || Number(balance) < 0) {
      newErrors.balance = "Balance must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (!/^\d*$/.test(value)) return;
    if (value.length > 19) return;
    
    const formatted = formatCardNumber(value);
    setCardNumber(formatted);
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: "" }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    if (value.length > 5) value = value.slice(0, 5);
    
    setExpiryDate(value);
    if (errors.expiryDate) setErrors((prev) => ({ ...prev, expiryDate: "" }));
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const maxLength = cardType === 'amex' ? 4 : 3;
    
    if (value.length <= maxLength) {
      setCvv(value);
      if (errors.cvv) setErrors((prev) => ({ ...prev, cvv: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const signupData = {
      full_name: fullName,
      email: email,
      password: password,
      card_info: {
        name: cardholderName,
        card_number: cardNumber.replace(/\s/g, ''),
        cvv: cvv,
        expiration_date: expiryDate,
        balance: parseFloat(balance),
        currency: currency
      }
    };

    console.log("Signup data:", signupData);
    setIsLoading(true);
    setGeneralError("");

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Card brand icon component
  const CardIcon = () => {
    const iconClass = "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400";
    
    switch (cardType) {
      case 'visa':
        return <span className={iconClass + " font-bold text-blue-600"}>VISA</span>;
      case 'mastercard':
        return <span className={iconClass + " font-bold text-red-600"}>MC</span>;
      case 'amex':
        return <span className={iconClass + " font-bold text-blue-800"}>AMEX</span>;
      case 'discover':
        return <span className={iconClass + " font-bold text-orange-600"}>DISC</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Create Account</h1>
        <p className="text-center text-gray-600 mb-6">Sign up with Honey Encryption</p>

        {generalError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4">
            {generalError}
          </div>
        )}

        <div className="flex flex-col gap-4" onKeyPress={handleKeyPress}>
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

          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                className={`w-full border rounded-lg p-3 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.cardNumber ? "border-red-500" : ""
                }`}
              />
              <CardIcon />
            </div>
            {errors.cardNumber && (
              <small className="text-red-500 text-xs mt-1">{errors.cardNumber}</small>
            )}
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryChange}
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.expiryDate ? "border-red-500" : ""
                }`}
              />
              {errors.expiryDate && (
                <small className="text-red-500 text-xs mt-1">{errors.expiryDate}</small>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVV {cardType === 'amex' && <span className="text-xs text-gray-500">(4 digits)</span>}
              </label>
              <input
                type="text"
                placeholder={cardType === 'amex' ? "1234" : "123"}
                value={cvv}
                onChange={handleCVVChange}
                maxLength={cardType === 'amex' ? 4 : 3}
                className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.cvv ? "border-red-500" : ""
                }`}
              />
              {errors.cvv && (
                <small className="text-red-500 text-xs mt-1">{errors.cvv}</small>
              )}
            </div>
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
                max="10000000000"
                onChange={(e) => {
                  const value = e.target.value;
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

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition mt-4 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

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