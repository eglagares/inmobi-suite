import React, {
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user');

    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setIsAuthenticated(true);
    }
  }, []);


const login = async (email, password, role = 'agente') => {
  if (!email || !password) return false;

  try {
    // Buscar usuario en Supabase
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      console.error(error);
      return false;
    }

    const newUser = {
      id: data.id,
      email: data.email,
      name: data.nombre,
      role: data.rol,
      telefono: data.telefono,
      avatar: data.avatar_url,
      loginTime: new Date(),
    };

    setUser(newUser);
    setIsAuthenticated(true);

    localStorage.setItem(
      'user',
      JSON.stringify(newUser)
    );

    return true;

  } catch (err) {
    console.error(err);
    return false;
  }
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
