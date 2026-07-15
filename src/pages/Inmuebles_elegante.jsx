import { useEffect, useState } from 'react';
import { inmuebleService } from '../services/supabaseServices';
import { useTheme } from '../context/ThemeContext';
import { useSupabase } from '../context/SupabaseContext';
import FormularioInmueble from '../components/FormularioInmueble';
import ModalConfirmacion from '../components/ModalConfirmacion';
import { Search, MapPin, Home, DollarSign, Maximize2, Bed, Bath, Plus, Edit3, Trash2 } from 'lucide-react';

import { ChevronLeft, ChevronRight } from 'lucide-react';




export default function Inmuebles() {
  const { user } = useSupabase();
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

  //carrusel de imágenes de inmueble
  const [imagenActual, setImagenActual] = useState({});
  const siguienteImagen = (id, total) => {
    setImagenActual(prev => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % total,
    }));
  };
  const anteriorImagen = (id, total) => {
    setImagenActual(prev => ({
      ...prev,
      [id]: ((prev[id] || 0) - 1 + total) % total,
    }));
  };

  useEffect(() => {
    cargarInmuebles();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [inmuebles, busqueda, filtroTipo, filtroEstado]);

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

    if (busqueda.trim()) {
      resultado = resultado.filter(
        inmueble =>
          inmueble.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
          inmueble.ubicacion?.toLowerCase().includes(busqueda.toLowerCase()) ||
          inmueble.ciudad?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroTipo !== 'todos') {
      resultado = resultado.filter(inmueble => inmueble.tipo === filtroTipo);
    }

    if (filtroEstado !== 'todos') {
      resultado = resultado.filter(inmueble => inmueble.estado === filtroEstado);
    }

    setFiltrados(resultado);
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'disponible':
        return 'bg-emerald-500';
      case 'vendido':
        return 'bg-rose-500';
      case 'alquilado':
        return 'bg-sky-500';
      default:
        return 'bg-slate-500';
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

        <button
          onClick={abrirFormularioNuevo}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all hover:shadow-lg active:scale-95"
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
              className={`rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group ${
                isDarkMode ? 'bg-slate-800' : 'bg-white'
              }`}
            >
              {/* Imagen */}
                  
                <div className="relative h-48 bg-gray-200 overflow-hidden group">

  {inmueble.imagenes_urls?.length > 0 ? (
    <>
      <img
        src={inmueble.imagenes_urls[imagenActual[inmueble.id] || 0]}
        alt={inmueble.titulo}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {inmueble.imagenes_urls.length > 1 && (
        <>
          {/* Flecha izquierda */}
          <button
            onClick={() =>
              anteriorImagen(
                inmueble.id,
                inmueble.imagenes_urls.length
              )
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Flecha derecha */}
          <button
            onClick={() =>
              siguienteImagen(
                inmueble.id,
                inmueble.imagenes_urls.length
              )
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>

      {/* Badge tipo */}
      <div className="absolute top-3 left-3">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: colors.primary }}
        >
          {inmueble.tipo}
        </span>
      </div>

      {/* Badge estado */}
      <div className="absolute top-3 right-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${obtenerColorEstado(
            inmueble.estado
          )}`}
        >
          {obtenerTextoEstado(inmueble.estado)}
        </span>
      </div>
    </>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
      <Home size={50} className="text-gray-500 opacity-50" />
    </div>
  )}
</div>

{/* Indicadores */}
{inmueble.imagenes_urls?.length > 1 && (
  <div className="flex justify-center gap-2 py-3">
    {inmueble.imagenes_urls.map((_, i) => (
      <button
        key={i}
        onClick={() =>
          setImagenActual(prev => ({
            ...prev,
            [inmueble.id]: i,
          }))
        }
        className={`w-2.5 h-2.5 rounded-full transition-all ${
          (imagenActual[inmueble.id] || 0) === i
            ? 'bg-pink-500 scale-125'
            : 'bg-gray-400'
        }`}
      />
    ))}
  </div>
)}
              {/* Contenido */}
              <div className="p-4 space-y-3 flex-1 flex flex-col">
                {/* Título */}
                <h3 className={`font-bold text-base line-clamp-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {inmueble.titulo}
                </h3>

                {/* Precio */}
                <div className="flex items-center gap-2">
                  <DollarSign size={18} style={{ color: colors.primary }} />
                  <p className="text-lg font-bold" style={{ color: colors.primary }}>
                    ${inmueble.precio?.toLocaleString('es-ES') || '0'}
                  </p>
                </div>

                {/* Ubicación */}
                <div className="flex items-start gap-2">
                  <MapPin size={16} className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} flex-shrink-0 mt-0.5`} />
                  <p className={`text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}>
                    {inmueble.ubicacion}
                  </p>
                </div>

                {/* Detalles */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y" 
                  style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
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

                {/* Botones de acción elegantes */}
                <div className="flex gap-2 mt-auto pt-2">
                  {/* Botón Editar */}
                  <button
                    onClick={() => abrirFormularioEditar(inmueble)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium transition-all duration-200 group/edit ${
                      isDarkMode
                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <Edit3 size={16} className="group-hover/edit:scale-110 transition-transform" />
                    <span className="text-sm">Editar</span>
                  </button>

                  {/* Botón Eliminar */}
                  <button
                    onClick={() => abrirConfirmacionEliminar(inmueble)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium transition-all duration-200 group/delete border ${
                      isDarkMode
                        ? 'bg-red-950 hover:bg-red-900 border-red-800 text-red-300 hover:text-red-100'
                        : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700'
                    }`}
                  >
                    <Trash2 size={16} className="group-hover/delete:scale-110 transition-transform" />
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
