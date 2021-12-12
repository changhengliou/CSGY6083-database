import { createContext, useContext } from 'react';

const AuthContext = createContext({
  user: null,
  signIn: () => {},
  signOut: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
