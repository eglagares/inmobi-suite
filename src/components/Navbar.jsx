import React from 'react';
import { Menu, Bell, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onMenuClick }) {
  const { isDarkMode, toggleDarkMode, branding } = useTheme();

  return (
    <div className={`h-16 flex items-center justify-between px-6 shadow-sm border-b ${
      isDarkMode
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-gray-200'
    }`}>
      {/* Left side - Menu button */}
      <button
        onClick={onMenuClick}
        className={`p-2 rounded-lg transition-colors lg:hidden ${
          isDarkMode
            ? 'hover:bg-slate-700 text-slate-400'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        <Menu size={20} />
      </button>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-auto hidden sm:block">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isDarkMode ? 'text-slate-500' : 'text-gray-400'
          }`} size={18} />
          <input
            type="text"
            placeholder="Buscar inmuebles, clientes..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm ${
              isDarkMode
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-4">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDarkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        {/* Notifications */}
        <button className={`p-2 rounded-lg transition-colors relative ${
          isDarkMode
            ? 'hover:bg-slate-700 text-slate-400'
            : 'hover:bg-gray-100 text-gray-600'
        }`}>
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* App name - visible en móvil cuando sidebar está cerrado */}
        <div className="hidden sm:block text-right">
          <p className={`text-xs font-semibold ${
            isDarkMode ? 'text-slate-300' : 'text-gray-600'
          }`}>
            {branding.appName}
          </p>
          <p className={`text-xs ${
            isDarkMode ? 'text-slate-500' : 'text-gray-500'
          }`}>
            {branding.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
