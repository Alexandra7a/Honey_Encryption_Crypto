"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../user-context";

export default function SettingsPage() {
  const router = useRouter();
  const { userData } = useUser();
  
  const [user, setUser] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    cardNumber: "",
    expirationDate: "",
    balance: "",
    currency: "",
  });

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(user);

  useEffect(() => {
    if (!userData) {
      router.replace("/login");
      return;
    }

    // Populate user data from context
    const fullName = `${userData.first_name || ""} ${userData.middle_name ? userData.middle_name + " " : ""}${userData.last_name || ""}`.trim();
    setUser({
      firstName: userData.first_name || "",
      middleName: userData.middle_name || "",
      lastName: userData.last_name || "",
      email: userData.email || "",
      cardNumber: userData.card_number || "",
      expirationDate: userData.expiration_date || "",
      balance: userData.balance?.toString() || "0",
      currency: userData.currency || "RON",
    });
    setEditData({
      firstName: userData.first_name || "",
      middleName: userData.middle_name || "",
      lastName: userData.last_name || "",
      email: userData.email || "",
      cardNumber: userData.card_number || "",
      expirationDate: userData.expiration_date || "",
      balance: userData.balance?.toString() || "0",
      currency: userData.currency || "RON",
    });
  }, [userData, router]);

  const handleSave = () => {
    setUser(editData);
    setEditing(false);
    // TODO: Add API call to update user data on backend
  };

  const mask = (value: string) => "•".repeat(value.length);

  return (
    <div className="min-h-screen p-6 bg-slate-50 text-slate-900">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <button
            onClick={() => router.push("/template")}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">First Name</p>
              {editing ? (
                <input 
                  className="border p-2 rounded w-full" 
                  value={editData.firstName} 
                  onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} 
                />
              ) : (
                <p className="font-medium">{user.firstName}</p>
              )}
            </div>

            <div>
              <p className="text-slate-500">Middle Name</p>
              {editing ? (
                <input 
                  className="border p-2 rounded w-full" 
                  value={editData.middleName} 
                  onChange={(e) => setEditData({ ...editData, middleName: e.target.value })} 
                  placeholder="Optional"
                />
              ) : (
                <p className="font-medium">{user.middleName || "—"}</p>
              )}
            </div>

            <div>
              <p className="text-slate-500">Last Name</p>
              {editing ? (
                <input 
                  className="border p-2 rounded w-full" 
                  value={editData.lastName} 
                  onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} 
                />
              ) : (
                <p className="font-medium">{user.lastName}</p>
              )}
            </div>

            <div>
              <p className="text-slate-500">Email Address</p>
              {editing ? (
                <input 
                  className="border p-2 rounded w-full" 
                  value={editData.email} 
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })} 
                />
              ) : (
                <p className="font-medium">{user.email}</p>
              )}
            </div>

            <div>
              <p className="text-slate-500">Card Number</p>
              <p className="font-medium">{mask(user.cardNumber)}</p>
            </div>

            <div>
              <p className="text-slate-500">Expiration Date</p>
              <p className="font-medium tracking-widest">•• / ••</p>
            </div>

            <div>
              <p className="text-slate-500">Balance</p>
              <p className="font-medium">
                {parseFloat(user.balance).toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })} {user.currency}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Currency</p>
              <p className="font-medium">{user.currency}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            {editing ? (
              <>
                <button className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700" onClick={handleSave}>Save</button>
                <button className="px-4 py-2 rounded-lg bg-gray-300 text-black text-sm font-semibold hover:bg-gray-400" onClick={() => setEditing(false)}>Cancel</button>
              </>
            ) : (
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700" onClick={() => setEditing(true)}>Edit Information</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}