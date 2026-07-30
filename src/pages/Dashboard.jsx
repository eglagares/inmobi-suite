import React, { useEffect, useState } from 'react';
import { Building2, Users, Calendar, TrendingUp, Heart, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/supabaseServices';
import DashboardMap from '../components/DashboardMap';
import { inmuebleService } from '../services/supabaseServices';




export default function Dashboard() {
  const { user } = useAuth();

  const [mapaInmuebles, setMapaInmuebles] = useState([]);

  const [totales, setTotales] = useState({
    inmuebles: 0,
    clientes: 0,
    visitas: 0,
    disponibles: 0
  });

  useEffect(() => {
    cargarDashboard();
  }, []);

  async function cargarDashboard() {
  const mapa = await inmuebleService.getMapa();

  if (!mapa.error) {
      setMapaInmuebles(mapa.data);
  }
  const [totalesRes, inmueblesRes] = await Promise.all([
    dashboardService.getTotales(),
    dashboardService.getInmueblesRecientes()
  ]);

  if (!totalesRes.error) {
    setTotales(totalesRes.data);
  }

  if (!inmueblesRes.error) {
    setRecentProperties(inmueblesRes.data);
  }
}

  const stats = [
  {
    label: 'Inmuebles',
    value: totales.inmuebles,
    icon: Building2,
    color: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  {
    label: 'Clientes',
    value: totales.clientes,
    icon: Users,
    color: 'bg-green-100',
    iconColor: 'text-green-600'
  },
  {
    label: 'Visitas',
    value: totales.visitas,
    icon: Calendar,
    color: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    label: 'Disponibles',
    value: totales.disponibles,
    icon: Building2,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600'
  }
];

  const [recentProperties, setRecentProperties] = useState([]);



  const recentVisits = [
    { id: 1, property: 'Apartamento Centro', client: 'Juan García', date: '15 Dic, 14:00', status: 'Confirmada' },
    { id: 2, property: 'Casa Zona Norte', client: 'María López', date: '15 Dic, 16:00', status: 'Pendiente' },
    { id: 3, property: 'Oficina Comercial', client: 'Carlos Rodríguez', date: '16 Dic, 10:00', status: 'Confirmada' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {user?.name || 'Usuario'}
          </h1>
          <p className="text-gray-600">
            Resumen de tu actividad inmobiliaria
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className={`${stat.iconColor}`} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Properties */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Inmuebles Recientes</h2>
          <div className="space-y-4">
           {recentProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">

                   <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200">

                    {property.imagenes_urls?.length > 0 ? (

                      <img
                        src={property.imagenes_urls[0]}
                        alt={property.titulo}
                        className="w-full h-full object-cover"
                      />

                    ) : (

                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <Building2 className="text-white" size={20} />
                      </div>

                    )}

                  </div>

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {property.titulo}
                      </p>

                      <p className="text-xs text-gray-500">
                      {property.dormitorios ?? '-'} dormitorios
                      </p>
                    </div>

                  </div>

                  <div className="text-right">

                    <p className="font-semibold text-gray-900">
                    {Number(property.precio).toLocaleString('es-ES', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })} €
                    </p>

                    <p
                      className={`text-xs px-2 py-1 rounded inline-block ${
                        property.estado === 'disponible'
                          ? 'bg-green-100 text-green-700'
                          : property.estado === 'vendido'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                     {property.estado
                          ? property.estado.charAt(0).toUpperCase() + property.estado.slice(1)
                          : ''}
                    </p>

                  </div>

                </div>
              ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Building2 size={18} />
              Nuevo Inmueble
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Users size={18} />
              Nuevo Cliente
            </button>
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Calendar size={18} />
              Agendar Visita
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
              <TrendingUp size={18} />
              Nueva Venta
            </button>
          </div>
        </div>
      </div>
<DashboardMap inmuebles={mapaInmuebles} />
      {/* Recent Visits */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Próximas Visitas</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Inmueble</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cliente</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Fecha y Hora</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentVisits.map((visit) => (
                <tr key={visit.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{visit.property}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{visit.client}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{visit.date}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      visit.status === 'Confirmada' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {visit.status}
                    </span>
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
