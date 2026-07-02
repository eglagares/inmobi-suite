import React from 'react';
import { BarChart3, TrendingUp, Users, Building2 } from 'lucide-react';

export default function Estadisticas() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Estadísticas y Análisis</h1>
        <p className="text-gray-600 mt-1">Reportes y análisis de tu negocio inmobiliario</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Ingresos Este Mes</h3>
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">$45,230</p>
          <p className="text-xs text-green-600 mt-2">+12% vs mes anterior</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Propiedades Vendidas</h3>
            <div className="bg-blue-100 p-2 rounded-lg">
              <Building2 className="text-blue-600" size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-xs text-gray-600 mt-2">Este trimestre</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Clientes Nuevos</h3>
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users className="text-purple-600" size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">28</p>
          <p className="text-xs text-gray-600 mt-2">Este mes</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Tasa Conversión</h3>
            <div className="bg-orange-100 p-2 rounded-lg">
              <BarChart3 className="text-orange-600" size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">34%</p>
          <p className="text-xs text-green-600 mt-2">+5% vs mes anterior</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por mes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ventas por Mes</h2>
          <div className="space-y-4">
            {[
              { mes: 'Enero', value: 65, total: '$120K' },
              { mes: 'Febrero', value: 78, total: '$145K' },
              { mes: 'Marzo', value: 89, total: '$165K' },
              { mes: 'Abril', value: 92, total: '$172K' },
              { mes: 'Mayo', value: 85, total: '$158K' },
              { mes: 'Junio', value: 95, total: '$180K' },
            ].map((item) => (
              <div key={item.mes}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.mes}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${item.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tipos de transacciones */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Tipos de Transacciones</h2>
          <div className="space-y-4">
            {[
              { tipo: 'Compraventas', cantidad: 42, porcentaje: 65, color: 'bg-blue-500' },
              { tipo: 'Alquileres', cantidad: 18, porcentaje: 28, color: 'bg-green-500' },
              { tipo: 'Arriendos', cantidad: 7, porcentaje: 7, color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.tipo}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.tipo}</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{item.cantidad}</p>
                    <p className="text-xs text-gray-600">{item.porcentaje}%</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`${item.color} h-3 rounded-full`}
                    style={{ width: `${item.porcentaje}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desempeño de agentes */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Desempeño de Agentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Agente</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Transacciones</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Volumen</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Comisiones</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Desempeño</th>
              </tr>
            </thead>
            <tbody>
              {[
                { nombre: 'Carlos Agente', transacciones: 12, volumen: '$450K', comisiones: '$13,500', desempeño: 95 },
                { nombre: 'Laura Agente', transacciones: 9, volumen: '$320K', comisiones: '$9,600', desempeño: 87 },
                { nombre: 'María Agente', transacciones: 8, volumen: '$280K', comisiones: '$8,400', desempeño: 82 },
                { nombre: 'Juan Agente', transacciones: 10, volumen: '$380K', comisiones: '$11,400', desempeño: 90 },
              ].map((agente) => (
                <tr key={agente.nombre} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-semibold text-gray-900">{agente.nombre}</td>
                  <td className="py-4 px-4 text-gray-900">{agente.transacciones}</td>
                  <td className="py-4 px-4 text-gray-900">{agente.volumen}</td>
                  <td className="py-4 px-4 font-semibold text-green-600">{agente.comisiones}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${agente.desempeño}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{agente.desempeño}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
