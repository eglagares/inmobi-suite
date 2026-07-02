import React, { useState } from 'react';
import { TrendingUp, Plus, Search, DollarSign, Calendar } from 'lucide-react';

export default function Ventas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');

  const ventas = [
    {
      id: 1,
      propiedad: 'Apartamento Moderno Centro',
      tipo: 'Compraventa',
      cliente: 'Juan García',
      precio: '$250,000',
      comision: '$7,500',
      fecha: '05 Dic 2024',
      estado: 'Completada',
      agente: 'Carlos Agente'
    },
    {
      id: 2,
      propiedad: 'Casa Colonial Zona Norte',
      tipo: 'Alquiler',
      cliente: 'María López',
      precio: '$2,500/mes',
      comision: '$250',
      fecha: '10 Dic 2024',
      estado: 'En Proceso',
      agente: 'Laura Agente'
    },
    {
      id: 3,
      propiedad: 'Oficina Comercial Piso 5',
      tipo: 'Compraventa',
      cliente: 'Carlos Rodríguez',
      precio: '$150,000',
      comision: '$4,500',
      fecha: '12 Dic 2024',
      estado: 'Pendiente',
      agente: 'Carlos Agente'
    },
  ];

  const filteredVentas = ventas.filter(v => {
    const matchSearch = v.propiedad.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        v.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterType === 'todos' || v.tipo === filterType;
    return matchSearch && matchFilter;
  });

  const totalVentas = ventas.reduce((sum, v) => {
    const price = parseInt(v.precio.replace(/[^0-9]/g, ''));
    return sum + price;
  }, 0);

  const totalComisiones = ventas.reduce((sum, v) => {
    const comision = parseInt(v.comision.replace(/[^0-9]/g, ''));
    return sum + comision;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ventas y Alquileres</h1>
          <p className="text-gray-600 mt-1">Gestión de transacciones inmobiliarias</p>
        </div>
        <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
          <Plus size={18} />
          Nueva Venta
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Transacciones</p>
              <p className="text-3xl font-bold text-gray-900">{ventas.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Volumen Total</p>
              <p className="text-3xl font-bold text-gray-900">${(totalVentas / 1000000).toFixed(2)}M</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Comisiones Generadas</p>
              <p className="text-3xl font-bold text-gray-900">${(totalComisiones / 1000).toFixed(1)}K</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por propiedad o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterType('todos')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterType === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('Compraventa')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterType === 'Compraventa'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Compraventas
          </button>
          <button
            onClick={() => setFilterType('Alquiler')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              filterType === 'Alquiler'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Alquileres
          </button>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Propiedad</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tipo</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Cliente</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Precio</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Comisión</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Fecha</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredVentas.map((venta) => (
                <tr key={venta.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900">{venta.propiedad}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {venta.tipo}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-900">{venta.cliente}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900">{venta.precio}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-green-600">{venta.comision}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar size={16} />
                      {venta.fecha}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      venta.estado === 'Completada'
                        ? 'bg-green-100 text-green-700'
                        : venta.estado === 'En Proceso'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {venta.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredVentas.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <TrendingUp className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-2">No se encontraron ventas</p>
          <p className="text-gray-500 text-sm">Intenta con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}
