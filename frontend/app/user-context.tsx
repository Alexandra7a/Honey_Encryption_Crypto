"use client";

import { createContext, useContext, useState } from "react";

export interface UserData {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  card_number: string;
  cvv: string;
  expiration_date: string;
  balance: number;
  currency: string;
}

type UserContextValue = {
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
