import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [callback, setCallback] = useState(() => {});

  useEffect(() => {
    const cookie = document.cookie.split(";");
    const user = cookie.find(el => el.startsWith("user="));
    if (user) {
      setUser(user.split("=")[1]);
    }
  }, []);

  useEffect(() => {
    if (typeof callback === 'function')
      callback();
  }, [callback]);

  const signIn = (newUser, callback) => {
    document.cookie = `user=${newUser};`;
    setUser(newUser);
    setCallback(callback);
  };

  const signOut = () => {
    setUser(null);
  };

  const value = { user, signIn, signOut };

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  );
}

export default AuthProvider;
