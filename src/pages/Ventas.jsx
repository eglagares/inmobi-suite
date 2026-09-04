import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil, Search, Filter, Check } from 'lucide-react';
import { ventaService } from '../services/supabaseServices';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import FormularioVenta from '../components/FormularioVenta';

export default function Ventas() {
  const { isDarkMode, colors } = useTheme();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [ventas, setVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ventaEditando, setVentaEditando] = useState(null);
  
  const [stats, setStats] = useState({
    total: 0,
    ventas: 0,
    alquileres: 0,
    completadas: 0,
    valor_total: 0,
    comisiones: 0,
  });

  // Cargar ventas
  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    setLoading(true);
    try {
      const resultado = await ventaService.getByAgente(user?.id);
      setVentas(resultado.data || []);

      // Estadísticas
      const stats = await ventaService.getStats(user?.id);
      setStats(stats.data || {});
    } catch (err) {
      console.error('Error cargando:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar ventas
  const ventasFiltradas = ventas.filter(v => {
    const filtroSearch = v.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        v.numero_operacion.toLowerCase().includes(searchTerm.toLowerCase());
    const filtroTipoOk = filtroTipo === 'todos' || v.tipo === filtroTipo;
    const filtroEstadoOk = filtroEstado === 'todos' || v.estado === filtroEstado;
    return filtroSearch && filtroTipoOk && filtroEstadoOk;
  });

  // Editar
  const handleEditar = (venta) => {
    setVentaEditando(venta.id);
    setMostrarFormulario(true);
  };

  // Eliminar
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta venta?')) return;
    try {
      await ventaService.delete(id);
      cargarVentas();
    } catch (err) {
      console.error('Error eliminando:', err);
    }
  };

  // Cambiar estado
  const handleCambiarEstado = async (id, nuevoEstado) => {
    try {
      await ventaService.cambiarEstado(id, nuevoEstado);
      cargarVentas();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // RENDERIZAR
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      
      {/* HEADER */}
      <div className={`p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-b`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            📊 Ventas y Alquileres
          </h1>
          <button
            onClick={() => {
              setVentaEditando(null);
              setMostrarFormulario(true);
            }}
            className="px-4 py-2 rounded font-semibold text-white flex items-center gap-2"
            style={{ backgroundColor: colors.primary }}
          >
            <Plus size={20} />
            Nueva Venta/Alquiler
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className={`p-4 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Total</p>
            <p className="text-2xl font-bold">{stats.total || 0}</p>
          </div>
          <div className={`p-4 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Ventas</p>
            <p className="text-2xl font-bold">{stats.ventas || 0}</p>
          </div>
          <div className={`p-4 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Alquileres</p>
            <p className="text-2xl font-bold">{stats.alquileres || 0}</p>
          </div>
          <div className={`p-4 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Completadas</p>
            <p className="text-2xl font-bold">{stats.completadas || 0}</p>
          </div>
          <div className={`p-4 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Comisiones</p>
            <p className="text-2xl font-bold">€{(stats.comisiones_totales || 0).toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* FILTROS Y BÚSQUEDA */}
      <div className={`p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} border-b`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Buscar
            </label>
            <div className="flex items-center gap-2">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`flex-1 px-4 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Tipo
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className={`w-full px-4 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="todos">Todos</option>
              <option value="venta">🏠 Ventas</option>
              <option value="alquiler">🔑 Alquileres</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className={`w-full px-4 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="todos">Todos</option>
              <option value="pendiente">⏳ Pendiente</option>
              <option value="completada">✅ Completada</option>
              <option value="cancelada">❌ Cancelada</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFiltroTipo('todos');
                setFiltroEstado('todos');
              }}
              className={`w-full px-4 py-2 rounded font-semibold ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* TABLA */}
      <div className={`p-6`}>
        {loading ? (
          <p className={isDarkMode ? 'text-white' : 'text-gray-900'}>Cargando...</p>
        ) : ventasFiltradas.length === 0 ? (
          <p className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            No hay ventas
          </p>
        ) : (
          <div className={`rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} overflow-x-auto`}>
            <table className="w-full">
              <thead>
                <tr className={isDarkMode ? 'border-b border-slate-700 bg-slate-700' : 'border-b border-gray-200 bg-gray-50'}>
                  <th className={`px-6 py-3 text-left font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Número</th>
                  <th className={`px-6 py-3 text-left font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Título</th>
                  <th className={`px-6 py-3 text-left font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Tipo</th>
                  <th className={`px-6 py-3 text-left font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Precio</th>
                  <th className={`px-6 py-3 text-left font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Estado</th>
                  <th className={`px-6 py-3 text-center font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map(venta => (
                  <tr key={venta.id} className={`border-b ${isDarkMode ? 'border-slate-700 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <td className={`px-6 py-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{venta.numero_operacion}</td>
                    <td className={`px-6 py-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{venta.titulo}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        venta.tipo === 'venta' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {venta.tipo === 'venta' ? '🏠 Venta' : '🔑 Alquiler'}
                      </span>
                    </td>
                    <td className={`px-6 py-3 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      €{venta.precio_total.toFixed(2)}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        venta.estado === 'completada' 
                          ? 'bg-green-100 text-green-800' 
                          : venta.estado === 'cancelada'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {venta.estado === 'completada' ? '✅ Completada' : venta.estado === 'cancelada' ? '❌ Cancelada' : '⏳ Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleEditar(venta)}
                        className="p-2 rounded hover:bg-blue-100 text-blue-600"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleEliminar(venta.id)}
                        className="p-2 rounded hover:bg-red-100 text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FORMULARIO MODAL */}
      {mostrarFormulario && (
        <FormularioVenta
          ventaId={ventaEditando}
          onClose={() => {
            setMostrarFormulario(false);
            setVentaEditando(null);
          }}
          onGuardado={cargarVentas}
        />
      )}
    </div>
  );
}