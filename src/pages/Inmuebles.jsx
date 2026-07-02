import React, { useState } from 'react';
import { Building2, Plus, Search, Filter, MapPin, Bed, Bath, Ruler } from 'lucide-react';

export default function Inmuebles() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const inmuebles = [
    {
      id: 1,
      nombre: 'Apartamento Moderno Centro',
      precio: '$250,000',
      tipo: 'Apartamento',
      ubicacion: 'Centro, Zona A',
      dormitorios: 3,
      baños: 2,
      area: '120m²',
      estado: 'Activo',
      imagen: 'https://via.placeholder.com/300x200?text=Apartamento'
    },
    {
      id: 2,
      nombre: 'Casa Colonial Zona Norte',
      precio: '$380,000',
      tipo: 'Casa',
      ubicacion: 'Zona Norte',
      dormitorios: 4,
      baños: 3,
      area: '250m²',
      estado: 'Vendido',
      imagen: 'https://via.placeholder.com/300x200?text=Casa'
    },
    {
      id: 3,
      nombre: 'Oficina Comercial Piso 5',
      precio: '$150,000',
      tipo: 'Oficina',
      ubicacion: 'Centro Comercial',
      dormitorios: 0,
      baños: 1,
      area: '85m²',
      estado: 'Activo',
      imagen: 'https://via.placeholder.com/300x200?text=Oficina'
    },
  ];

  const filteredInmuebles = inmuebles.filter(i =>
    i.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inmuebles</h1>
          <p className="text-gray-600 mt-1">Gestión de propiedades inmobiliarias</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo Inmueble
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            Filtros
          </button>
        </div>
      </div>

      {/* Grid de inmuebles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInmuebles.map((inmueble) => (
          <div
            key={inmueble.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
          >
            {/* Imagen */}
            <div className="relative overflow-hidden bg-gray-200 h-48">
              <img
                src={inmueble.imagen}
                alt={inmueble.nombre}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  inmueble.estado === 'Activo'
                    ? 'bg-green-100 text-green-700'
                    : inmueble.estado === 'Vendido'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {inmueble.estado}
                </span>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{inmueble.tipo}</p>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {inmueble.nombre}
              </h3>

              {/* Ubicación */}
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                <MapPin size={16} />
                {inmueble.ubicacion}
              </div>

              {/* Características */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {inmueble.dormitorios > 0 && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <Bed size={16} className="mx-auto text-gray-600 mb-1" />
                    <p className="text-xs text-gray-600">{inmueble.dormitorios}</p>
                  </div>
                )}
                {inmueble.baños > 0 && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <Bath size={16} className="mx-auto text-gray-600 mb-1" />
                    <p className="text-xs text-gray-600">{inmueble.baños}</p>
                  </div>
                )}
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Ruler size={16} className="mx-auto text-gray-600 mb-1" />
                  <p className="text-xs text-gray-600">{inmueble.area}</p>
                </div>
              </div>

              {/* Precio */}
              <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {inmueble.precio}
                </span>
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredInmuebles.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-2">No se encontraron inmuebles</p>
          <p className="text-gray-500 text-sm">Intenta con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}
