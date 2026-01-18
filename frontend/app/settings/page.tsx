"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    password: "mypassword123",
    cardNumber: "1234 5678 9012 3456",
    ccv: "123",
    expirationDate: "12/26",
  });

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(user);

  const handleSave = () => {
    setUser(editData);
    setEditing(false);
  };

  const mask = (value: string) => "•".repeat(value.length);

  return (
    <div className="min-h-screen p-6 bg-slate-50 text-slate-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Full Name</p>
              {editing ? (
                <input className="border p-1 rounded w-full" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
              ) : (
                <p className="font-medium">{user.name}</p>
              )}
            </div>

            <div>
              <p className="text-slate-500">Email Address</p>
              {editing ? (
                <input className="border p-1 rounded w-full" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
              ) : (
                <p className="font-medium">{user.email}</p>
              )}
            </div>

            <div>
              <p className="text-slate-500">Password</p>
              {editing ? (
                <input type="password" className="border p-1 rounded w-full" value={editData.password} onChange={(e) => setEditData({ ...editData, password: e.target.value })} />
              ) : (
                <p className="font-medium tracking-widest">{mask(user.password)}</p>
              )}
            </div>

            <div>
              <p className="text-slate-500">Card Number</p>
              {editing ? (
                <input className="border p-1 rounded w-full" value={editData.cardNumber} onChange={(e) => setEditData({ ...editData, cardNumber: e.target.value })} />
              ) : (
                <p className="font-medium">{mask(user.cardNumber)}</p>
              )}
            </div>

            <div>
              <p className="text-slate-500">CVV</p>
              {editing ? (
                <input type="password" className="border p-1 rounded w-full" value={editData.ccv} onChange={(e) => setEditData({ ...editData, ccv: e.target.value })} />
              ) : (
                <p className="font-medium tracking-widest">•••</p>
              )}
            </div>

            <div>
              <p className="text-slate-500">Expiration Date</p>
              {editing ? (
                <input className="border p-1 rounded w-full" value={editData.expirationDate} onChange={(e) => setEditData({ ...editData, expirationDate: e.target.value })} placeholder="MM/YY" />
              ) : (
                <p className="font-medium tracking-widest">•• / ••</p>
              )}
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