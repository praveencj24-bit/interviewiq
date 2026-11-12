import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, loginUser, registerUser } from '../api/index.js';
import { getToken, saveToken, clearToken } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(() => Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  async function login(email, password) {
    const data = await loginUser({ email, password });
    saveToken(data.token);
    setUser(data.user);
  }

  async function register(name, email, password) {
    const data = await registerUser({ name, email, password });
    saveToken(data.token);
    setUser(data.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, checking, login, register, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
