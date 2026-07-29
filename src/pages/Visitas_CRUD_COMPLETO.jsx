import { useEffect, useState } from 'react';
import { visitaService } from '../services/supabaseServices';
import { useTheme } from '../context/ThemeContext';
import { useSupabase } from '../context/SupabaseContext';
import FormularioVisita from '../components/FormularioVisita_MEJORADO';
import ModalConfirmacion from '../components/ModalConfirmacion';
import { Search, Calendar, Plus, Edit3, Trash2, MapPin, Users } from 'lucide-react';

export default function Visitas() {
  const { user } = useSupabase();
  const [visitas, setVisitas] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const { isDarkMode, colors } = useTheme();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [visitaEditar, setVisitaEditar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [visitaEliminar, setVisitaEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    cargarVisitas();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [visitas, busqueda, filtroEstado]);

  const cargarVisitas = async () => {
    setLoading(true);
    try {
      const { data, error } = await visitaService.getAll();
      
      if (error) {
        console.error('Error cargando visitas:', error);
        setVisitas([]);
      } else {
        setVisitas(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setVisitas([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = visitas;

    if (busqueda.trim()) {
      resultado = resultado.filter(
        visita =>
          visita.cliente?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
          visita.inmueble?.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
          visita.inmueble?.ubicacion?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroEstado !== 'todos') {
      resultado = resultado.filter(visita => visita.estado === filtroEstado);
    }

    setFiltradas(resultado);
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'confirmada':
        return 'bg-blue-500';
      case 'realizada':
        return 'bg-green-500';
      case 'cancelada':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const obtenerTextoEstado = (estado) => {
    switch (estado) {
      case 'confirmada':
        return 'Confirmada';
      case 'realizada':
        return 'Realizada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return estado;
    }
  };

  const abrirFormularioNuevo = () => {
    setVisitaEditar(null);
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (visita) => {
    setVisitaEditar(visita);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setVisitaEditar(null);
  };

  const abrirConfirmacionEliminar = (visita) => {
    setVisitaEliminar(visita);
    setMostrarConfirmacion(true);
  };

  const cerrarConfirmacion = () => {
    setMostrarConfirmacion(false);
    setVisitaEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!visitaEliminar) return;

    setEliminando(true);
    try {
      const { success, error } = await visitaService.delete(visitaEliminar.id);
      
      if (success) {
        cargarVisitas();
        cerrarConfirmacion();
      } else {
        console.error('Error eliminando:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setEliminando(false);
    }
  };

  const handleVisitaGuardada = () => {
    cargarVisitas();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            Cargando visitas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Visitas
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Total: <strong>{filtradas.length}</strong> de <strong>{visitas.length}</strong>
          </p>
        </div>

        <button
          onClick={abrirFormularioNuevo}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all hover:shadow-lg active:scale-95"
          style={{ backgroundColor: colors.primary }}
        >
          <Plus size={20} />
          Nueva Visita
        </button>
      </div>

      {/* Filtros */}
      <div className={`rounded-lg shadow-sm p-6 space-y-4 ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por cliente, inmueble o ubicación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-white'
                : 'bg-gray-100 border border-gray-300'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Estado
          </label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-white'
                : 'bg-gray-100 border border-gray-300'
            }`}
          >
            <option value="todos">Todos los estados</option>
            <option value="confirmada">Confirmada</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Tabla de Visitas */}
      {filtradas.length > 0 ? (
        <div className={`rounded-lg shadow-sm overflow-hidden ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    Cliente
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    Inmueble
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    Fecha
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    Hora
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    Estado
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((visita) => (
                  <tr
                    key={visita.id}
                    className={`border-b transition-colors ${
                      isDarkMode
                        ? 'border-slate-700 hover:bg-slate-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <td className={`px-6 py-4 text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Users size={16} className={isDarkMode ? 'text-slate-400' : 'text-gray-400'} />
                        <div>
                          <p className="font-semibold">{visita.cliente?.nombre}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            {visita.cliente?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className={`${isDarkMode ? 'text-slate-400' : 'text-gray-400'} flex-shrink-0 mt-0.5`} />
                        <div>
                          <p className="font-semibold">{visita.inmueble?.titulo}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                            {visita.inmueble?.ubicacion}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} style={{ color: colors.primary }} />
                        {new Date(visita.fecha).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      {visita.hora}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        obtenerColorEstado(visita.estado)
                      }`}>
                        {obtenerTextoEstado(visita.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirFormularioEditar(visita)}
                          className="p-2 rounded-lg transition-all hover:bg-opacity-80"
                          style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                          title="Editar"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => abrirConfirmacionEliminar(visita)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`text-center p-12 rounded-lg ${
          isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
        }`}>
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p className={`text-lg font-semibold mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            No se encontraron visitas
          </p>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            Crea una nueva visita para empezar
          </p>
        </div>
      )}

      {/* Estadísticas */}
      {visitas.length > 0 && (
        <div className={`rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-4 gap-4 ${
          isDarkMode ? 'bg-slate-800' : 'bg-gray-50'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {visitas.length}
            </p>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Total</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {visitas.filter(v => v.estado === 'confirmada').length}
            </p>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Confirmadas</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {visitas.filter(v => v.estado === 'realizada').length}
            </p>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Realizadas</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {visitas.filter(v => v.estado === 'cancelada').length}
            </p>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Canceladas</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      {mostrarFormulario && (
        <FormularioVisita
          visitaId={visitaEditar?.id}
          onClose={cerrarFormulario}
          onGuardado={handleVisitaGuardada}
        />
      )}

      {/* Modal de confirmación */}
      {mostrarConfirmacion && visitaEliminar && (
        <ModalConfirmacion
          titulo="Eliminar Visita"
          mensaje={`¿Estás seguro de que deseas eliminar esta visita de ${visitaEliminar.cliente?.nombre} al inmueble ${visitaEliminar.inmueble?.titulo}?`}
          textoBotonConfirmar="Eliminar"
          textoBotonCancelar="Cancelar"
          tipo="danger"
          onConfirmar={confirmarEliminar}
          onCancelar={cerrarConfirmacion}
          cargando={eliminando}
        />
      )}
    </div>
  );
}
