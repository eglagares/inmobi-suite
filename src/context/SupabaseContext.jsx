import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const SupabaseContext = createContext();

export function SupabaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Verificar sesión al cargar
  useEffect(() => {
    checkSession();
    
    // Escuchar cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (err) {
      console.error('Error checking session:', err);
    } finally {
      setLoading(false);
    }
  };

  // Funciones de autenticación
  const signUp = async (email, password, nombre) => {
    setError('');
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // Crear perfil en tabla usuarios
      if (data.user) {
        await supabase.from('usuarios').insert({
          id: data.user.id,
          email,
          nombre,
          rol: 'usuario',
        });
      }

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const signIn = async (email, password) => {
    setError('');
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const signOut = async () => {
    setError('');
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Funciones genéricas para tablas
  const getAll = async (table) => {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const getById = async (table, id) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const insert = async (table, record) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .insert([record])
        .select();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const update = async (table, id, updates) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .update({ ...updates, updated_at: new Date() })
        .eq('id', id)
        .select();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  const deleteRecord = async (table, id) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      if (error) throw error;
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const query = async (table, filter) => {
    try {
      let query = supabase.from(table).select('*');
      
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  return (
    <SupabaseContext.Provider
      value={{
        user,
        loading,
        error,
        supabase,
        // Auth
        signUp,
        signIn,
        signOut,
        // CRUD
        getAll,
        getById,
        insert,
        update,
        deleteRecord,
        query,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase debe usarse dentro de SupabaseProvider');
  }
  return context;
}
