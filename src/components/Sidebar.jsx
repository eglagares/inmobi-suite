import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Building2, Users, Calendar, FileText, TrendingUp, BarChart3, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home, color: '#2563eb' },
    { path: '/inmuebles', label: 'Inmuebles', icon: Building2, color: '#7c3aed' },
    { path: '/clientes', label: 'Clientes', icon: Users, color: '#059669' },
    { path: '/visitas', label: 'Agenda de Visitas', icon: Calendar, color: '#f59e0b' },
    { path: '/contratos', label: 'Contratos', icon: FileText, color: '#dc2626' },
    { path: '/ventas', label: 'Ventas y Alquileres', icon: TrendingUp, color: '#06b6d4' },
    { path: '/estadisticas', label: 'Estadísticas', icon: BarChart3, color: '#8b5cf6' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-sm`}
    >
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4">
        {isOpen && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">InMobi Suite</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700'
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
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
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
      <div className="mx-3 border-t border-gray-200" />

      {/* User Profile */}
      {isOpen && user && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {user.role}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
}
