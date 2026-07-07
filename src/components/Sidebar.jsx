import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Building2, Users, Calendar, FileText, TrendingUp, BarChart3, Menu, X, LogOut, Sparkles, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LogoBrand from './LogoBrand';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout, user } = useAuth();
  const { isDarkMode, colors } = useTheme();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home, color: colors.primary },
    { path: '/inmuebles', label: 'Inmuebles', icon: Building2, color: colors.secondary },
    { path: '/clientes', label: 'Clientes', icon: Users, color: '#059669' },
    { path: '/visitas', label: 'Agenda de Visitas', icon: Calendar, color: '#f59e0b' },
    { path: '/contratos', label: 'Contratos', icon: FileText, color: colors.danger },
    { path: '/ventas', label: 'Ventas y Alquileres', icon: TrendingUp, color: colors.info },
    { path: '/estadisticas', label: 'Estadísticas', icon: BarChart3, color: '#8b5cf6' },
  ];

  const aiMenuItems = [
    { path: '/ia', label: 'Herramientas IA', icon: Sparkles, color: colors.primary },
    { path: '/ia-settings', label: 'Configuración IA', icon: Settings, color: '#6b7280' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 flex flex-col shadow-sm border-r ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Header con LogoBrand */}
      <div className={`h-16 border-b flex items-center justify-between px-4 ${
        isDarkMode
          ? 'border-slate-700'
          : 'border-gray-200'
      }`}>
        {isOpen && (
          <LogoBrand size="sm" showText={true} />
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode
              ? 'hover:bg-slate-700 text-slate-400'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? isDarkMode
                      ? 'bg-pink-900 bg-opacity-40 text-pink-300'
                      : 'bg-pink-50 text-pink-700'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              title={!isOpen ? item.label : ''}
            >
              {({ isActive }) => (
                <>
                  <div className="flex-shrink-0">
                    <Icon
                      size={20}
                      style={{
                        color: isActive ? item.color : 'currentColor',
                      }}
                    />
                  </div>
                  {isOpen && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left">
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      )}
                    </>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Separador */}
        <div className={`my-3 ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`} style={{ borderTop: '1px solid currentColor' }} />

        {/* Menú de IA */}
        {isOpen && (
          <div className={`px-4 py-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            <p className="text-xs font-semibold uppercase tracking-wide">IA</p>
          </div>
        )}
        {aiMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? isDarkMode
                      ? 'bg-purple-900 bg-opacity-40 text-purple-300'
                      : 'bg-purple-50 text-purple-700'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-slate-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
              title={!isOpen ? item.label : ''}
            >
              {({ isActive }) => (
                <>
                  <div className="flex-shrink-0">
                    <Icon
                      size={20}
                      style={{
                        color: isActive ? item.color : 'currentColor',
                      }}
                    />
                  </div>
                  {isOpen && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left">
                        {item.label}
                      </span>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      )}
                    </>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Divider */}
      <div className={`mx-3 border-t ${
        isDarkMode ? 'border-slate-700' : 'border-gray-200'
      }`} />

      {/* User Profile */}
      {isOpen && user && (
        <div className={`border-t p-4 ${
          isDarkMode ? 'border-slate-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0" style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user.name}
              </p>
              <p className={`text-xs truncate capitalize ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                {user.role}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isDarkMode
                ? 'text-slate-300 hover:bg-slate-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}

