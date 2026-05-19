"use client";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  User,
} from "firebase/auth";
import { redirect } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import { auth } from "@/app/lib/db";

const AuthContext = createContext({});

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authenticate = async (
    _currentState: unknown,
    formData: FormData,
  ): Promise<string | undefined> => {
    const email = formData.get("email");
    const password = formData.get("password");
    if (!email || !password) {
      return "Missing email or password.";
    }
    try {
      await signInWithEmailAndPassword(
        auth,
        email as string,
        password as string,
      );
      redirect("/admin");
    } catch (error) {
      return "Something went wrong.";
    }
  };

  const signOut = async () => fbSignOut(auth);

  return (
    <AuthContext.Provider value={{ user, authenticate, signOut }}>
      {loading ? <span>Loading...</span> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext<any>(AuthContext);
