import { useEffect, useState } from 'react';
import { inmuebleService } from '../services/supabaseServices';
import { useTheme } from '../context/ThemeContext';

//import { useSupabase } from '../context/SupabaseContext';
import { useAuth } from '../context/AuthContext';

import FormularioInmueble from '../components/FormularioInmueble';
import ModalConfirmacion from '../components/ModalConfirmacion';
import { Search, MapPin, Home, DollarSign, Maximize2, Bed, Bath, Plus, Edit, Trash2 } from 'lucide-react';

export default function Inmuebles() {
//const { user } = useSupabase();
const { user } = useAuth();



  const [inmuebles, setInmuebles] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const { isDarkMode, colors } = useTheme();

  // Estado para modales
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [inmuebleEditar, setInmuebleEditar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [inmuebleEliminar, setInmuebleEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    cargarInmuebles();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [inmuebles, busqueda, filtroTipo, filtroEstado]);


console.log("Usuario Auth:", user);

  const cargarInmuebles = async () => {
    setLoading(true);
    try {
      const { data, error } = await inmuebleService.getAll();
      
      if (error) {
        console.error('Error cargando inmuebles:', error);
        setInmuebles([]);
      } else {
        setInmuebles(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setInmuebles([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = inmuebles;

    // Filtro de búsqueda
    if (busqueda.trim()) {
      resultado = resultado.filter(
        inmueble =>
          inmueble.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
          inmueble.ubicacion?.toLowerCase().includes(busqueda.toLowerCase()) ||
          inmueble.ciudad?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    // Filtro de tipo
    if (filtroTipo !== 'todos') {
      resultado = resultado.filter(inmueble => inmueble.tipo === filtroTipo);
    }

    // Filtro de estado
    if (filtroEstado !== 'todos') {
      resultado = resultado.filter(inmueble => inmueble.estado === filtroEstado);
    }

    setFiltrados(resultado);
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'disponible':
        return 'bg-green-500';
      case 'vendido':
        return 'bg-red-500';
      case 'alquilado':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const obtenerTextoEstado = (estado) => {
    switch (estado) {
      case 'disponible':
        return 'Disponible';
      case 'vendido':
        return 'Vendido';
      case 'alquilado':
        return 'Alquilado';
      default:
        return estado;
    }
  };

  // Funciones de CRUD
  const abrirFormularioNuevo = () => {
    setInmuebleEditar(null);
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (inmueble) => {
    setInmuebleEditar(inmueble);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setInmuebleEditar(null);
  };

  const abrirConfirmacionEliminar = (inmueble) => {
    setInmuebleEliminar(inmueble);
    setMostrarConfirmacion(true);
  };

  const cerrarConfirmacion = () => {
    setMostrarConfirmacion(false);
    setInmuebleEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!inmuebleEliminar) return;

    setEliminando(true);
    try {
      const { success, error } = await inmuebleService.delete(inmuebleEliminar.id);
      
      if (success) {
        cargarInmuebles();
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

  const handleInmuebleGuardado = () => {
    cargarInmuebles();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            Cargando inmuebles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón nuevo */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Inmuebles
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Total: <strong>{filtrados.length}</strong> de <strong>{inmuebles.length}</strong>
          </p>
        </div>

        {/* Botón Crear */}
        <button
          onClick={abrirFormularioNuevo}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all hover:shadow-lg"
          style={{ backgroundColor: colors.primary }}
        >
          <Plus size={20} />
          Nuevo Inmueble
        </button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className={`rounded-lg shadow-sm p-6 space-y-4 ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por título, ubicación o ciudad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400'
                : 'bg-gray-100 border border-gray-300 placeholder-gray-500'
            }`}
          />
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Tipo de Inmueble
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-gray-100 border border-gray-300'
              }`}
            >
              <option value="todos">Todos los tipos</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="oficina">Oficina</option>
              <option value="local">Local Comercial</option>
              <option value="terreno">Terreno</option>
            </select>
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
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-gray-100 border border-gray-300'
              }`}
            >
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="vendido">Vendido</option>
              <option value="alquilado">Alquilado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Inmuebles */}
      {filtrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map(inmueble => (
            <div
              key={inmueble.id}
              className={`rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 flex flex-col ${
                isDarkMode ? 'bg-slate-800' : 'bg-white'
              }`}
            >
              {/* Imagen desde Supabase Storage */}
              <div className="relative h-48 bg-gray-200 overflow-hidden group">
                {inmueble.imagenes_urls?.[0] ? (
                  <img
                    src={inmueble.imagenes_urls[0]}
                    alt={inmueble.titulo}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                    <Home size={48} className="text-gray-500 opacity-50" />
                  </div>
                )}

                {/* Overlay con estado */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>

                {/* Badge de estado */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    obtenerColorEstado(inmueble.estado)
                  }`}>
                    {obtenerTextoEstado(inmueble.estado)}
                  </span>
                </div>

                {/* Badge de tipo */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: colors.primary }}>
                    {inmueble.tipo}
                  </span>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-4 space-y-3 flex-1 flex flex-col">
                {/* Título */}
                <h3 className={`font-bold text-lg line-clamp-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {inmueble.titulo}
                </h3>

                {/* Precio */}
                <div className="flex items-center gap-2">
                  <DollarSign size={20} style={{ color: colors.primary }} />
                  <p className="text-lg font-bold" style={{ color: colors.primary }}>
                    ${inmueble.precio?.toLocaleString('es-ES') || '0'}
                  </p>
                </div>

                {/* Ubicación */}
                <div className="flex items-start gap-2">
                  <MapPin size={16} className={isDarkMode ? 'text-slate-400 mt-1' : 'text-gray-600 mt-1'} />
                  <p className={`text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    {inmueble.ubicacion}
                  </p>
                </div>

                {/* Detalles */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y" 
                  style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
                  {/* Área */}
                  {inmueble.area && (
                    <div className="text-center">
                      <Maximize2 size={16} className="mx-auto mb-1" style={{ color: colors.secondary }} />
                      <p className={`text-xs font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        {inmueble.area} m²
                      </p>
                    </div>
                  )}

                  {/* Dormitorios */}
                  {inmueble.dormitorios && (
                    <div className="text-center">
                      <Bed size={16} className="mx-auto mb-1" style={{ color: colors.secondary }} />
                      <p className={`text-xs font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        {inmueble.dormitorios}
                      </p>
                    </div>
                  )}

                  {/* Baños */}
                  {inmueble.banos && (
                    <div className="text-center">
                      <Bath size={16} className="mx-auto mb-1" style={{ color: colors.secondary }} />
                      <p className={`text-xs font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-gray-700'
                      }`}>
                        {inmueble.banos}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button
                    onClick={() => abrirFormularioEditar(inmueble)}
                    className="flex items-center justify-center gap-1 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => abrirConfirmacionEliminar(inmueble)}
                    className="flex items-center justify-center gap-1 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Sin resultados */
        <div className={`text-center p-12 rounded-lg ${
          isDarkMode ? 'bg-slate-800' : 'bg-gray-100'
        }`}>
          <Home size={48} className="mx-auto mb-4 opacity-50" />
          <p className={`text-lg font-semibold mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            No se encontraron inmuebles
          </p>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            Intenta ajustar tus filtros o búsqueda
          </p>
        </div>
      )}

      {/* Estadísticas */}
      {inmuebles.length > 0 && (
        <div className={`rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-4 ${
          isDarkMode ? 'bg-slate-800' : 'bg-gray-50'
        }`}>
          <div className="text-center">
            <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {inmuebles.filter(i => i.estado === 'disponible').length}
            </p>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Disponibles</p>
          </div>
          <div className="text-center">
            <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {inmuebles.filter(i => i.estado === 'vendido').length}
            </p>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Vendidos</p>
          </div>
          <div className="text-center">
            <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {inmuebles.filter(i => i.estado === 'alquilado').length}
            </p>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Alquilados</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      {mostrarFormulario && (
        <FormularioInmueble
          inmuebleId={inmuebleEditar?.id}
          onClose={cerrarFormulario}
          onGuardado={handleInmuebleGuardado}
          agenteId={user?.id}
        />
      )}

      {/* Modal de confirmación */}
      {mostrarConfirmacion && inmuebleEliminar && (
        <ModalConfirmacion
          titulo="Eliminar Inmueble"
          mensaje={`¿Estás seguro de que deseas eliminar "${inmuebleEliminar.titulo}"? Esta acción no se puede deshacer.`}
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
