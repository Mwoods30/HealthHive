import { createContext } from 'react';

const AuthContext = createContext({
  role: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export default AuthContext;
