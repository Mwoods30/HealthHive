import React, { useMemo, useState } from 'react';
import AuthContext from './authContext';
import { isRoleValid } from './roleRoutes';

const STORAGE_KEY = 'healthhive_role';

function getInitialRole() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isRoleValid(stored) ? stored : null;
}

export default function AuthProvider({ children }) {
  const [role, setRole] = useState(getInitialRole);

  const login = (nextRole) => {
    if (!isRoleValid(nextRole)) {
      return false;
    }

    setRole(nextRole);
    window.localStorage.setItem(STORAGE_KEY, nextRole);
    return true;
  };

  const logout = () => {
    setRole(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      role,
      isAuthenticated: Boolean(role),
      login,
      logout,
    }),
    [role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
