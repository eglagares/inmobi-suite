import React, { useState } from 'react';
import { FileText, Plus, Search, Download, Eye } from 'lucide-react';

export default function Contratos() {
  const [searchTerm, setSearchTerm] = useState('');

  const contratos = [
    {
      id: 1,
      numero: 'CTR-2024-001',
      propiedad: 'Apartamento Moderno Centro',
      tipo: 'Compraventa',
      cliente: 'Juan García',
      precio: '$250,000',
      fecha: '01 Dic 2024',
      estado: 'Firmado',
      fechaFirma: '05 Dic 2024'
    },
    {
      id: 2,
      numero: 'CTR-2024-002',
      propiedad: 'Casa Colonial Zona Norte',
      tipo: 'Alquiler',
      cliente: 'María López',
      precio: '$2,500/mes',
      fecha: '10 Dic 2024',
      estado: 'Pendiente',
      fechaFirma: '-'
    },
    {
      id: 3,
      numero: 'CTR-2024-003',
      propiedad: 'Oficina Comercial Piso 5',
      tipo: 'Compraventa',
      cliente: 'Carlos Rodríguez',
      precio: '$150,000',
      fecha: '12 Dic 2024',
      estado: 'Borrador',
      fechaFirma: '-'
    },
  ];

  const filteredContratos = contratos.filter(c =>
    c.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.propiedad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contratos</h1>
          <p className="text-gray-600 mt-1">Gestión de contratos de compraventa y alquiler</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
          <Plus size={18} />
          Nuevo Contrato
        </button>
      </div>

      {/* Búsqueda */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por número, propiedad o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabla de contratos */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Contrato</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Tipo</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Propiedad</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Cliente</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Precio</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Estado</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredContratos.map((contrato) => (
                <tr key={contrato.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-900">{contrato.numero}</p>
                      <p className="text-xs text-gray-500">{contrato.fecha}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {contrato.tipo}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-900">{contrato.propiedad}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-900">{contrato.cliente}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900">{contrato.precio}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      contrato.estado === 'Firmado'
                        ? 'bg-green-100 text-green-700'
                        : contrato.estado === 'Pendiente'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {contrato.estado}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700" title="Ver">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700" title="Descargar">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredContratos.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 mb-2">No se encontraron contratos</p>
          <p className="text-gray-500 text-sm">Intenta con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}
