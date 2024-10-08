import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
export const authContext = createContext();

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const singup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const login = (emial, password) =>
    signInWithEmailAndPassword(auth, emial, password);

  const logout = () => signOut(auth);

  useEffect(() => {
    const onsuscribe=onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return ()=>onsuscribe()
  },[]);

  return (
    <authContext.Provider value={{ singup, login, user, logout, loading }}>
      {children}
    </authContext.Provider>
  );
}
