import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function LogoBrand({ size = 'md', showText = true }) {
  const { branding, isDarkMode } = useTheme();

  // Tamaños predefinidos
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24',
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  return (
    <div className="flex items-center gap-3">
      {/* Logo */}
      <div className={`${sizeClasses[size]} rounded-lg overflow-hidden flex-shrink-0 ${
        isDarkMode ? 'bg-slate-700' : 'bg-white'
      } flex items-center justify-center border-2 border-pink-500 shadow-sm`}>
        <img
          src={branding.logoUrl}
          alt={branding.logoAlt}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback si la imagen no carga
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '🏢';
          }}
        />
      </div>

      {/* Texto */}
      {showText && (
        <div className="min-w-0">
          <div className={`font-bold ${textSizes[size]} leading-none text-pink-600`}>
            {branding.appName}
          </div>
          {size !== 'xs' && size !== 'sm' && (
            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'} leading-none mt-0.5`}>
              {branding.tagline}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
