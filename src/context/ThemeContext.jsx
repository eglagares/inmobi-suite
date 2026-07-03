import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Recuperar preferencia guardada
    const saved = localStorage.getItem('inmobiSuiteDarkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Usar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Guardar preferencia cuando cambia
  useEffect(() => {
    localStorage.setItem('inmobiSuiteDarkMode', JSON.stringify(isDarkMode));
    // Aplicar clase al documento
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Paleta de colores profesional basada en el logo InMobi Suite
  // Colores primarios: Magenta (#E91E8C) y Amarillo Neón (#CDDC39)
  const colors = {
    // Colores primarios (Magenta del logo)
    primary: isDarkMode ? '#FF1493' : '#E91E8C',
    primaryLight: isDarkMode ? '#FF69B4' : '#FF1493',
    primaryDark: isDarkMode ? '#C71585' : '#BE0073',
    
    // Colores secundarios (Amarillo Neón del logo)
    secondary: isDarkMode ? '#D4FF00' : '#CDDC39',
    secondaryLight: isDarkMode ? '#FFFF00' : '#E6FF4D',
    secondaryDark: isDarkMode ? '#AFCC00' : '#B8D916',
    
    // Fondos
    bg: isDarkMode ? '#0f172a' : '#ffffff',
    bgSecondary: isDarkMode ? '#1e293b' : '#f8fafc',
    bgTertiary: isDarkMode ? '#334155' : '#f1f5f9',
    
    // Texto
    text: isDarkMode ? '#f1f5f9' : '#1e293b',
    textSecondary: isDarkMode ? '#cbd5e1' : '#64748b',
    textTertiary: isDarkMode ? '#94a3b8' : '#94a3b8',
    
    // Bordes
    border: isDarkMode ? '#334155' : '#e2e8f0',
    borderLight: isDarkMode ? '#475569' : '#f1f5f9',
    
    // Estados
    success: isDarkMode ? '#10b981' : '#059669',
    warning: isDarkMode ? '#f59e0b' : '#d97706',
    danger: isDarkMode ? '#ef4444' : '#dc2626',
    info: isDarkMode ? '#06b6d4' : '#0891b2',
    
    // Gradientes (usando magenta y amarillo)
    gradient: isDarkMode 
      ? 'from-fuchsia-900 to-pink-700'
      : 'from-pink-500 to-rose-400',
  };

  // Branding
  const branding = {
    appName: 'InMobi Suite',
    tagline: 'CRM Inmobiliario Profesional',
    version: '1.0.0',
    logo: '🏢', // Por defecto emoji, pero se puede reemplazar con imagen
    logoUrl: '/logoInMobi.png', // Ruta a tu logo real
    logoAlt: 'InMobi Suite Logo',
    
    // Información del logo
    logoColors: {
      primary: '#E91E8C',    // Magenta
      secondary: '#CDDC39',  // Amarillo neón
    },
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      colors,
      branding 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
