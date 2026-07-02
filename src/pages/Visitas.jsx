import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, User, Phone } from 'lucide-react';

export default function Visitas() {
  const [viewType, setViewType] = useState('lista'); // 'lista' o 'calendario'

  const visitas = [
    {
      id: 1,
      propiedad: 'Apartamento Moderno Centro',
      cliente: 'Juan García',
      fecha: '15 Dic 2024',
      hora: '14:00',
      duracion: '1 hora',
      estado: 'Confirmada',
      telefono: '+34 666 555 444',
      notas: 'Cliente muy interesado'
    },
    {
      id: 2,
      propiedad: 'Casa Colonial Zona Norte',
      cliente: 'María López',
      fecha: '15 Dic 2024',
      hora: '16:00',
      duracion: '1.5 horas',
      estado: 'Pendiente',
      telefono: '+34 666 555 445',
      notas: 'Necesita confirmación'
    },
    {
      id: 3,
      propiedad: 'Oficina Comercial Piso 5',
      cliente: 'Carlos Rodríguez',
      fecha: '16 Dic 2024',
      hora: '10:00',
      duracion: '1 hora',
      estado: 'Confirmada',
      telefono: '+34 666 555 446',
      notas: 'Visita con arquitecto'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agenda de Visitas</h1>
          <p className="text-gray-600 mt-1">Gestión de citas y visitas a propiedades</p>
        </div>
        <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
          <Plus size={18} />
          Nueva Visita
        </button>
      </div>

      {/* Vista */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setViewType('lista')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewType === 'lista'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Lista
          </button>
          <button
            onClick={() => setViewType('calendario')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              viewType === 'calendario'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Calendario
          </button>
        </div>
      </div>

      {/* Vista de lista */}
      {viewType === 'lista' && (
        <div className="space-y-4">
          {visitas.map((visita) => (
            <div
              key={visita.id}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Información principal */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">PROPIEDAD</p>
                  <p className="font-semibold text-gray-900">{visita.propiedad}</p>
                </div>

                {/* Cliente */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">CLIENTE</p>
                  <div className="flex items-center gap-1">
                    <User size={16} className="text-gray-600" />
                    <span className="font-semibold text-gray-900">{visita.cliente}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <Phone size={14} />
                    {visita.telefono}
                  </div>
                </div>

                {/* Fecha y hora */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">FECHA Y HORA</p>
                  <div className="flex items-center gap-1 mb-2">
                    <Calendar size={16} className="text-gray-600" />
                    <span className="font-semibold text-gray-900">{visita.fecha}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-gray-600" />
                    <span className="text-gray-900">{visita.hora} ({visita.duracion})</span>
                  </div>
                </div>

                {/* Estado */}
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ESTADO</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      visita.estado === 'Confirmada'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {visita.estado}
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm text-right">
                    Editar
                  </button>
                </div>
              </div>

              {/* Notas */}
              {visita.notas && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">NOTAS</p>
                  <p className="text-gray-700">{visita.notas}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Vista de calendario */}
      {viewType === 'calendario' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm text-center">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-2">Vista de calendario</p>
          <p className="text-gray-500 text-sm">Esta funcionalidad estará disponible pronto</p>
        </div>
      )}
    </div>
  );
}
