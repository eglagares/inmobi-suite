import React, { useState } from 'react';
import { Home, Search, Heart, Building2, MessageSquare, TrendingUp, Settings, LogOut, Menu, X } from 'lucide-react';

export default function SidebarInmobiliario() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: '#2563eb' },
    { id: 'search', label: 'Buscar Propiedades', icon: Search, color: '#7c3aed' },
    { id: 'favorites', label: 'Favoritos', icon: Heart, color: '#dc2626' },
    { id: 'my-properties', label: 'Mis Propiedades', icon: Building2, color: '#059669' },
    { id: 'messages', label: 'Mensajes', icon: MessageSquare, color: '#f59e0b' },
    { id: 'analytics', label: 'Reportes', icon: TrendingUp, color: '#06b6d4' },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'logout', label: 'Cerrar Sesión', icon: LogOut },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
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
              <span className="font-bold text-gray-900 text-lg">InmoApp</span>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title={!isOpen ? item.label : ''}
              >
                <div className="flex-shrink-0">
                  <Icon
                    size={20}
                    style={{
                      color: isActive ? item.color : 'currentColor',
                    }}
                  />
                </div>
                {isOpen && (
                  <span className="text-sm font-medium flex-1 text-left">
                    {item.label}
                  </span>
                )}
                {isOpen && isActive && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-3 border-t border-gray-200" />

        {/* Bottom Menu */}
        <nav className="px-3 py-4 space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-700 hover:bg-gray-50`}
                title={!isOpen ? item.label : ''}
              >
                <div className="flex-shrink-0">
                  <Icon size={20} />
                </div>
                {isOpen && (
                  <span className="text-sm font-medium flex-1 text-left">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        {isOpen && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                JD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Juan Díaz
                </p>
                <p className="text-xs text-gray-500 truncate">
                  juan@inmobiliario.com
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido a InmoApp
          </h1>
          <p className="text-gray-600 mb-8">
            Selecciona una opción del menú para comenzar
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Search className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Propiedades</p>
                  <p className="text-2xl font-bold text-gray-900">1,247</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="text-red-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Favoritos</p>
                  <p className="text-2xl font-bold text-gray-900">48</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mensajes</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Características principales
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Búsqueda Avanzada</h3>
                    <p className="text-sm text-gray-600">
                      Encuentra propiedades con filtros personalizados por ubicación, precio y características.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Favoritos</h3>
                    <p className="text-sm text-gray-600">
                      Guarda tus propiedades favoritas para acceder fácilmente en cualquier momento.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="text-green-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Gestión de Propiedades</h3>
                    <p className="text-sm text-gray-600">
                      Administra fácilmente todas tus propiedades en un solo lugar.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Mensajería</h3>
                    <p className="text-sm text-gray-600">
                      Comunícate directamente con vendedores y compradores interesados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
