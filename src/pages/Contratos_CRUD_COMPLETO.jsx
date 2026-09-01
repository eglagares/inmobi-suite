import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Pencil,
  Search,
  FileText,
  Download,
  Filter,
  Eye,
  AlertCircle,
  Check,
} from 'lucide-react';
import { contratoService } from '../services/supabaseServices';
import { useTheme } from '../context/ThemeContext';
import { useSupabase } from '../context/SupabaseContext';
import FormularioContrato from '../components/FormularioContrato';

import { useAuth } from '../context/AuthContext';

export default function Contratos() {
  const { isDarkMode, colors } = useTheme();
 const { user } = useAuth();

  // Estados
  const [loading, setLoading] = useState(true);
  const [contratos, setContratos] = useState([]);
  const [contratosFiltrados, setContratosFiltrados] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    borradores: 0,
    pendientes_firma: 0,
    firmados: 0,
    completados: 0,
  });

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Modales
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [contratoEditando, setContratoEditando] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [contratoSeleccionado, setContratoSeleccionado] = useState(null);

  // Errores y mensajes
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Cargar contratos
  useEffect(() => {
    cargarContratos();
  }, []);

  // Filtrar contratos
  useEffect(() => {
    let resultado = contratos;

    // Filtro de búsqueda
    if (searchTerm) {
      resultado = resultado.filter(c =>
        c.numero_contrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cliente?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de estado
    if (filtroEstado !== 'todos') {
      resultado = resultado.filter(c => c.estado === filtroEstado);
    }

    setContratosFiltrados(resultado);
  }, [searchTerm, filtroEstado, contratos]);

  const cargarContratos = async () => {
  setLoading(true);

  try {
    console.log("USER ID:", user?.id);

    const resultado = await contratoService.getByAgente(user?.id);

    console.log("RESULTADO getByAgente:", resultado);

    const { data, error: err } = resultado;

    if (err) throw err;

    setContratos(data || []);

    // Calcular estadísticas
    const newStats = {
      total: data?.length || 0,
      borradores: data?.filter(c => c.estado === 'borrador').length || 0,
      pendientes_firma: data?.filter(c => c.estado === 'pendiente_firma').length || 0,
      firmados: data?.filter(c => c.estado === 'firmado').length || 0,
      completados: data?.filter(c => c.estado === 'completado').length || 0,
    };

    setStats(newStats);

  } catch (err) {

    console.error("ERROR COMPLETO CARGANDO CONTRATOS:", err);

    setError(
      'Error cargando contratos: ' +
      (err?.message || JSON.stringify(err))
    );

  } finally {
    setLoading(false);
  }
};

  const handleNuevoContrato = () => {
    setContratoEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarContrato = (contrato) => {
    setContratoEditando(contrato);
    setMostrarFormulario(true);
  };

  const handleEliminarContrato = async (id) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contrato?')) return;

    try {
      const { error: err } = await contratoService.delete(id);
      if (err) throw err;

      setExito('Contrato eliminado correctamente');
      cargarContratos();

      setTimeout(() => setExito(''), 2000);
    } catch (err) {
      setError('Error eliminando contrato: ' + err.message);
    }
  };

  const handleDescargarPDF = (contrato) => {
    // TODO: Implementar generación de PDF
    alert('Descarga de PDF próximamente');
  };

  const handleVerDetalles = (contrato) => {
    setContratoSeleccionado(contrato);
    setMostrarDetalles(true);
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'borrador':
        return 'bg-gray-100 text-gray-800';
      case 'pendiente_firma':
        return 'bg-yellow-100 text-yellow-800';
      case 'firmado':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const obtenerLabelEstado = (estado) => {
    const labels = {
      borrador: 'Borrador',
      pendiente_firma: 'Pendiente Firma',
      firmado: 'Firmado',
      completado: 'Completado',
      cancelado: 'Cancelado',
    };
    return labels[estado] || estado;
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            📋 Contratos
          </h1>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            Gestiona todos tus contratos
          </p>
        </div>
        <button
          onClick={handleNuevoContrato}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all hover:scale-[1.02] active:scale-95"
          style={{ backgroundColor: colors.primary }}
        >
          <Plus size={20} />
          Nuevo Contrato
        </button>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="p-4 rounded-lg bg-red-100 text-red-700 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
      {exito && (
        <div className="p-4 rounded-lg bg-green-100 text-green-700 flex items-center gap-2">
          <Check size={20} />
          <span>{exito}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: FileText },
          { label: 'Borradores', value: stats.borradores, icon: Plus },
          { label: 'Pendiente Firma', value: stats.pendientes_firma, icon: AlertCircle },
          { label: 'Firmados', value: stats.firmados, icon: Check },
          { label: 'Completados', value: stats.completados, icon: Download },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-lg border p-4 ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} style={{ color: colors.primary }} />
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Buscar y Filtrar */}
      <div className={`rounded-lg border p-4 ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por número, título o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-white border border-gray-300'
              }`}
            />
          </div>

          <div className="relative">
            <Filter size={20} className="absolute left-3 top-3 text-gray-400" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className={`w-full px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-white border border-gray-300'
              }`}
            >
              <option value="todos">Todos los estados</option>
              <option value="borrador">Borrador</option>
              <option value="pendiente_firma">Pendiente Firma</option>
              <option value="firmado">Firmado</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Contratos */}
      <div className={`rounded-lg border overflow-hidden ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <th className={`text-left py-4 px-4 text-sm font-semibold ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Número
                </th>
                <th className={`text-left py-4 px-4 text-sm font-semibold ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Título
                </th>
                <th className={`text-left py-4 px-4 text-sm font-semibold ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Cliente
                </th>
                <th className={`text-left py-4 px-4 text-sm font-semibold ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Tipo
                </th>
                <th className={`text-left py-4 px-4 text-sm font-semibold ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Precio
                </th>
                <th className={`text-left py-4 px-4 text-sm font-semibold ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Estado
                </th>
                <th className={`text-left py-4 px-4 text-sm font-semibold ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {contratosFiltrados.length > 0 ? (
                contratosFiltrados.map((contrato) => (
                  <tr
                    key={contrato.id}
                    className={`border-b transition-colors hover:bg-opacity-50 ${
                      isDarkMode
                        ? 'border-slate-700 hover:bg-slate-700'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <td className={`py-4 px-4 text-sm font-mono ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      {contrato.numero_contrato}
                    </td>
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      {contrato.titulo}
                    </td>
                    <td className={`py-4 px-4 text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      {contrato.cliente?.nombre || 'N/A'}
                    </td>
                    <td className={`py-4 px-4 text-sm capitalize ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      {contrato.tipo}
                    </td>
                    <td className={`py-4 px-4 text-sm font-semibold ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {Number(contrato.precio_total).toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${obtenerColorEstado(contrato.estado)}`}>
                        {obtenerLabelEstado(contrato.estado)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVerDetalles(contrato)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? 'hover:bg-slate-600'
                              : 'hover:bg-gray-100'
                          }`}
                          title="Ver detalles"
                        >
                          <Eye size={18} style={{ color: colors.primary }} />
                        </button>
                        <button
                          onClick={() => handleEditarContrato(contrato)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? 'hover:bg-slate-600'
                              : 'hover:bg-gray-100'
                          }`}
                          title="Editar"
                        >
                          <Pencil size={18} className="text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDescargarPDF(contrato)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? 'hover:bg-slate-600'
                              : 'hover:bg-gray-100'
                          }`}
                          title="Descargar PDF"
                        >
                          <Download size={18} className="text-orange-500" />
                        </button>
                        <button
                          onClick={() => handleEliminarContrato(contrato.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode
                              ? 'hover:bg-slate-600'
                              : 'hover:bg-gray-100'
                          }`}
                          title="Eliminar"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={`py-8 text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    <FileText size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No hay contratos</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulario Modal */}
      {mostrarFormulario && (
        <FormularioContrato
          contratoId={contratoEditando?.id}
          onClose={() => setMostrarFormulario(false)}
          onGuardado={cargarContratos}
        />
      )}

      {/* Detalles Modal */}
      {mostrarDetalles && contratoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className={`rounded-lg shadow-2xl w-full max-w-2xl m-4 ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center p-6 border-b"
              style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Detalles del Contrato
              </h2>
              <button
                onClick={() => setMostrarDetalles(false)}
                className={`p-2 rounded-lg hover:bg-opacity-80 ${
                  isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                }`}
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Número</p>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {contratoSeleccionado.numero_contrato}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Tipo</p>
                  <p className={`font-semibold capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {contratoSeleccionado.tipo}
                  </p>
                </div>
              </div>

              <div>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Título</p>
                <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {contratoSeleccionado.titulo}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Cliente</p>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {contratoSeleccionado.cliente?.nombre}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Precio</p>
                  <p className={`font-semibold text-green-600 ${isDarkMode ? 'text-green-400' : ''}`}>
                    {Number(contratoSeleccionado.precio_total).toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Inicio</p>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(contratoSeleccionado.fecha_inicio).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Fin</p>
                  <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {contratoSeleccionado.fecha_fin ? new Date(contratoSeleccionado.fecha_fin).toLocaleDateString('es-ES') : 'N/A'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMostrarDetalles(false)}
                className="w-full mt-6 px-4 py-2 rounded-lg font-semibold text-white transition-all"
                style={{ backgroundColor: colors.primary }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
