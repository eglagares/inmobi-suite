import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password, role = 'agente') => {
    // Validación simple (en producción usar API real)
    if (email && password) {
      const newUser = {
        id: Math.random(),
        email,
        name: email.split('@')[0],
        role, // 'admin' | 'agente' | 'usuario'
        loginTime: new Date(),
      };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    
    const permissions = {
      admin: ['ver_todo', 'editar_todo', 'eliminar_todo', 'gestionar_usuarios'],
      agente: ['ver_inmuebles', 'crear_inmueble', 'editar_inmueble', 'ver_clientes', 'crear_venta'],
      usuario: ['ver_inmuebles'],
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      hasRole,
      hasPermission 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
