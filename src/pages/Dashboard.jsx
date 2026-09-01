import React, { useEffect, useState } from 'react';
import { Building2, Users, Calendar, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService, inmuebleService, visitaService } from '../services/supabaseServices';
import DashboardMap from '../components/DashboardMap';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode, colors } = useTheme();

  // Estados
  const [loading, setLoading] = useState(true);
  const [mapaInmuebles, setMapaInmuebles] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [proximasVisitas, setProximasVisitas] = useState([]);
  const [totales, setTotales] = useState({
    inmuebles: 0,
    clientes: 0,
    visitas: 0,
    disponibles: 0
  });

  // Cargar datos del dashboard
  useEffect(() => {
    cargarDashboard();
    // Recargar cada 30 segundos para datos en tiempo real
    const interval = setInterval(cargarDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  async function cargarDashboard() {
    setLoading(true);
    try {
      const [mapaRes, totalesRes, inmueblesRes, visitasRes] = await Promise.all([
        inmuebleService.getMapa(),
        dashboardService.getTotales(),
        dashboardService.getInmueblesRecientes(),
        visitaService.getProximas(user?.id)
      ]);

      if (!mapaRes.error && mapaRes.data) {
        setMapaInmuebles(mapaRes.data);
      }

      if (!totalesRes.error && totalesRes.data) {
        setTotales(totalesRes.data);
      }

      if (!inmueblesRes.error && inmueblesRes.data) {
        setRecentProperties(inmueblesRes.data.slice(0, 5));
      }

      if (!visitasRes.error && visitasRes.data) {
        // Ordenar por fecha y hora
        const visitasOrdenadas = visitasRes.data.sort((a, b) => {
          const dateA = new Date(`${a.fecha}T${a.hora}`);
          const dateB = new Date(`${b.fecha}T${b.hora}`);
          return dateA - dateB;
        });
        setProximasVisitas(visitasOrdenadas.slice(0, 5));
      }
    } catch (err) {
      console.error('Error cargando dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  // Estadísticas
  const stats = [
    {
      label: 'Inmuebles',
      value: totales.inmuebles,
      icon: Building2,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
      action: () => navigate('/inmuebles')
    },
    {
      label: 'Clientes',
      value: totales.clientes,
      icon: Users,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
      action: () => navigate('/clientes')
    },
    {
      label: 'Visitas',
      value: totales.visitas,
      icon: Calendar,
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
      action: () => navigate('/visitas')
    },
    {
      label: 'Disponibles',
      value: totales.disponibles,
      icon: Building2,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
      action: () => navigate('/inmuebles')
    }
  ];

  // Acciones rápidas
  const accionesRapidas = [
    {
      label: 'Nuevo Inmueble',
      icon: Building2,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => navigate('/inmuebles', { state: { crearNuevo: true } })
    },
    {
      label: 'Nuevo Cliente',
      icon: Users,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => navigate('/clientes', { state: { crearNuevo: true } })
    },
    {
      label: 'Agendar Visita',
      icon: Calendar,
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => navigate('/visitas', { state: { crearNuevo: true } })
    },
    {
      label: 'Nueva Venta',
      icon: TrendingUp,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => navigate('/ventas', { state: { crearNuevo: true } })
    }
  ];

  // Formatear fecha y hora
  const formatearFechaHora = (fecha, hora) => {
    try {
      const date = new Date(`${fecha}T${hora}`);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return `${fecha} ${hora}`;
    }
  };

  const abrirInmueble = (id) => {
    navigate('/inmuebles', {
      state: { editarId: id }
    });
  };

  if (loading && mapaInmuebles.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Bienvenido, {user?.nombre || user?.name || 'Usuario'}
          </h1>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            Resumen de tu actividad inmobiliaria
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize" 
            style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
            {user?.rol || user?.role}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              onClick={stat.action}
              className={`rounded-lg border p-6 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
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
        <div className={`lg:col-span-2 rounded-lg border p-6 shadow-sm ${
          isDarkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Inmuebles Recientes
            </h2>
            <button
              onClick={() => navigate('/inmuebles')}
              className="flex items-center gap-1 text-sm"
              style={{ color: colors.primary }}
            >
              Ver todo <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {recentProperties.length > 0 ? (
              recentProperties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => abrirInmueble(property.id)}
                  className={`flex items-center justify-between p-4 rounded-lg hover:shadow-md transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-slate-700 hover:bg-slate-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {property.imagenes_urls?.length > 0 ? (
                        <img
                          src={property.imagenes_urls[0]}
                          alt={property.titulo}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <Building2 className="text-white" size={20} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {property.titulo}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        {property.dormitorios ?? '-'} dormitorios • {property.area ?? '-'} m²
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {Number(property.precio).toLocaleString('es-ES', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      })} €
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded inline-block mt-1 ${
                        property.estado === 'disponible'
                          ? 'bg-green-100 text-green-700'
                          : property.estado === 'vendido'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {property.estado?.charAt(0).toUpperCase() + property.estado?.slice(1) || 'N/A'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                <Building2 size={32} className="mx-auto mb-2 opacity-50" />
                <p>No hay inmuebles recientes</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`rounded-lg border p-6 shadow-sm ${
          isDarkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Acciones Rápidas
          </h2>
          <div className="space-y-3">
            {accionesRapidas.map((accion) => {
              const Icon = accion.icon;
              return (
                <button
                  key={accion.label}
                  onClick={accion.action}
                  className={`w-full ${accion.color} text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95`}
                >
                  <Plus size={18} />
                  {accion.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map */}
      {mapaInmuebles.length > 0 && <DashboardMap inmuebles={mapaInmuebles} />}

      {/* Próximas Visitas */}
      <div className={`rounded-lg border p-6 shadow-sm ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Próximas Visitas
          </h2>
          <button
            onClick={() => navigate('/visitas')}
            className="flex items-center gap-1 text-sm"
            style={{ color: colors.primary }}
          >
            Ver todas <ArrowRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Inmueble
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Cliente
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Fecha y Hora
                </th>
                <th className={`text-left py-3 px-4 text-sm font-semibold ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {proximasVisitas.length > 0 ? (
                proximasVisitas.map((visit) => (
                  <tr
                    key={visit.id}
                    className={`border-b transition-colors hover:bg-opacity-50 ${
                      isDarkMode
                        ? 'border-slate-700 hover:bg-slate-700'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                      {visit.inmueble?.titulo || 'N/A'}
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-900'}`}>
                      {visit.cliente?.nombre || 'N/A'}
                    </td>
                    <td className={`py-3 px-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      {formatearFechaHora(visit.fecha, visit.hora)}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          visit.estado === 'confirmada'
                            ? 'bg-green-100 text-green-700'
                            : visit.estado === 'realizada'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {visit.estado?.charAt(0).toUpperCase() + visit.estado?.slice(1) || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={`py-8 text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No hay próximas visitas</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
