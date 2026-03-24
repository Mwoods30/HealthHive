import React, { useCallback, useMemo, useState } from 'react';
import AuthContext from './authContext';
import { isRoleValid } from './roleRoutes';

const ROLE_KEY = 'healthhive_role';

function getStoredRole() {
  const stored = window.localStorage.getItem(ROLE_KEY);
  return isRoleValid(stored) ? stored : null;
}

export default function AuthProvider({ children }) {
  const [role, setRole] = useState(getStoredRole);

  const login = useCallback((nextRole) => {
    if (!isRoleValid(nextRole)) return false;
    setRole(nextRole);
    window.localStorage.setItem(ROLE_KEY, nextRole);
    return true;
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    window.localStorage.removeItem(ROLE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      role,
      isAuthenticated: Boolean(role),
      login,
      logout,
    }),
    [role, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
