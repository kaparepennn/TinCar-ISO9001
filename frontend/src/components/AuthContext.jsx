import { createContext, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const tokenLS = localStorage.getItem('token');
  const userLS = JSON.parse(localStorage.getItem('user'));
  const [token,setToken] = useState(tokenLS || null);
  const [user,setUser] = useState(userLS || null);

  const login = async (username, password) => {
    const resp = await api.login(username, password);
    setToken(resp.token);
    setUser(resp.user);
    localStorage.setItem('token',resp.token);
    localStorage.setItem('user', JSON.stringify(resp.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}