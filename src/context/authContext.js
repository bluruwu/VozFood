import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword, // Función de Firebase para registrar usuarios
  signInWithEmailAndPassword, // Función de Firebase para iniciar sesión
  onAuthStateChanged, // Función de Firebase para monitorear el estado de autenticación
  signOut, // Función de Firebase para cerrar sesión
} from "firebase/auth";
import { auth } from "../firebase"; // Importa la instancia de autenticación de Firebase

// Creación del contexto de autenticación
export const authContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(authContext); // Obtiene el contexto de autenticación
  if (!context) throw new Error("There is no Auth provider"); // Verifica si el contexto está disponible
  return context; // Devuelve el contexto si está disponible
};

// Componente proveedor de autenticación
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Estado para almacenar el usuario autenticado
  const [loading, setLoading] = useState(true); // Estado para controlar el estado de carga

  // Función para registrar usuarios
  const signup = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password); // Llama a Firebase para crear un nuevo usuario

  // Función para iniciar sesión
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password); // Llama a Firebase para iniciar sesión

  // Función para cerrar sesión
  const logout = () => signOut(auth); // Llama a Firebase para cerrar sesión

  // Efecto para monitorear el estado de autenticación
  useEffect(() => {
    // Suscribe al estado de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Actualiza el estado del usuario si hay cambios en la autenticación
      setLoading(false); // Desactiva el estado de carga cuando se obtiene el usuario
    });
    
    return () => unsubscribe(); // Se desuscribe al desmontar el componente para evitar fugas de memoria
  }, []);

  return (
    // Proveedor del contexto de autenticación
    <authContext.Provider value={{ signup, login, user, logout, loading }}>
      {children} {/* Renderiza los hijos del componente dentro del contexto */}
    </authContext.Provider>
  );
}
