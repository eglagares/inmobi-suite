import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AIProvider }  from './context/AIContext';  
import { SupabaseProvider } from './context/SupabaseContext';
// Páginas de IA
import AIHub from './pages/AIHub';
import AISettings from './pages/AISettings';


// Páginas
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inmuebles from './pages/Inmuebles_CRUD_COMPLETO';
import Clientes from './pages/Clientes';
import Visitas from './pages/Visitas';
import Contratos from './pages/Contratos';
import Ventas from './pages/Ventas';
import Estadisticas from './pages/Estadisticas';



// Layout
import MainLayout from './components/MainLayout';

// Componente protegido
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="inmuebles" element={<Inmuebles />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="visitas" element={<Visitas />} />
        <Route path="contratos" element={<Contratos />} />
        <Route path="ventas" element={<Ventas />} />
        <Route path="estadisticas" element={<Estadisticas />} />
        
        {/* Rutas de IA */}
        <Route path="ia" element={<AIHub />} />
        <Route path="ia-settings" element={<AISettings />} />
      </Route>

      {/* Redireccionar rutas desconocidas */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AIProvider>
            <SupabaseProvider>
              <AppContent />
            </SupabaseProvider>
          </AIProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}