import React, { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, MapPin } from 'lucide-react';

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState('');

  const clientes = [
    {
      id: 1,
      nombre: 'Juan García',
      email: 'juan@email.com',
      telefono: '+34 666 555 444',
      tipo: 'Comprador',
      ubicacion: 'Madrid',
      estado: 'Activo',
      inmuebleInteres: 'Apartamento Centro'
    },
    {
      id: 2,
      nombre: 'María López',
      email: 'maria@email.com',
      telefono: '+34 666 555 445',
      tipo: 'Vendedor',
      ubicacion: 'Barcelona',
      estado: 'Activo',
      inmuebleInteres: 'Casa Colonial'
    },
    {
      id: 3,
      nombre: 'Carlos Rodríguez',
      email: 'carlos@email.com',
      telefono: '+34 666 555 446',
      tipo: 'Inquilino',
      ubicacion: 'Valencia',
      estado: 'Inactivo',
      inmuebleInteres: 'Oficina Comercial'
    },
  ];

  const filteredClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">Gestión de compradores, vendedores e inquilinos</p>
        </div>
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
          <Plus size={18} />
          Nuevo Cliente
        </button>
      </div>

      {/* Búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Cliente</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Contacto</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tipo</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Ubicación</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Estado</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-900">{cliente.nombre}</p>
                      <p className="text-xs text-gray-500">{cliente.inmuebleInteres}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} />
                        {cliente.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} />
                        {cliente.telefono}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {cliente.tipo}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin size={16} />
                      {cliente.ubicacion}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cliente.estado === 'Activo'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {cliente.estado}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredClientes.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-2">No se encontraron clientes</p>
          <p className="text-gray-500 text-sm">Intenta con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}
