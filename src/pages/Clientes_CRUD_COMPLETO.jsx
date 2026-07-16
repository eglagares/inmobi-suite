import { useEffect, useState } from 'react';
import { clienteService } from '../services/supabaseServices';
import { useTheme } from '../context/ThemeContext';
import { useSupabase } from '../context/SupabaseContext';
import FormularioCliente from '../components/FormularioCliente';
import ModalConfirmacion from '../components/ModalConfirmacion';
import { Search, Mail, Phone, DollarSign, MapPin, Plus, Edit3, Trash2, Users } from 'lucide-react';


import { useAuth } from '../context/AuthContext';


export default function Clientes() {
  //const { user } = useSupabase();
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const { isDarkMode, colors } = useTheme();

  // Estado para modales
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [clienteEliminar, setClienteEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [clientes, busqueda, filtroTipo, filtroEstado]);

  const cargarClientes = async () => {
    setLoading(true);
    try {
      const { data, error } = await clienteService.getAll();
      
      if (error) {
        console.error('Error cargando clientes:', error);
        setClientes([]);
      } else {
        setClientes(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let resultado = clientes;

    if (busqueda.trim()) {
      resultado = resultado.filter(
        cliente =>
          cliente.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
          cliente.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
          cliente.ciudad?.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (filtroTipo !== 'todos') {
      resultado = resultado.filter(cliente => cliente.tipo_cliente === filtroTipo);
    }

    if (filtroEstado !== 'todos') {
      resultado = resultado.filter(cliente => cliente.estado === filtroEstado);
    }

    setFiltrados(resultado);
  };

  const obtenerColorTipo = (tipo) => {
    switch (tipo) {
      case 'comprador':
        return 'bg-blue-500';
      case 'vendedor':
        return 'bg-purple-500';
      case 'arrendatario':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const obtenerTextoTipo = (tipo) => {
    switch (tipo) {
      case 'comprador':
        return 'Comprador';
      case 'vendedor':
        return 'Vendedor';
      case 'arrendatario':
        return 'Arrendatario';
      default:
        return tipo;
    }
  };

  const obtenerColorEstado = (estado) => {
    return estado === 'activo' ? 'text-green-600' : 'text-red-600';
  };

  const abrirFormularioNuevo = () => {
    setClienteEditar(null);
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (cliente) => {
    setClienteEditar(cliente);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setClienteEditar(null);
  };

  const abrirConfirmacionEliminar = (cliente) => {
    setClienteEliminar(cliente);
    setMostrarConfirmacion(true);
  };

  const cerrarConfirmacion = () => {
    setMostrarConfirmacion(false);
    setClienteEliminar(null);
  };

  const confirmarEliminar = async () => {
    if (!clienteEliminar) return;

    setEliminando(true);
    try {
      const { success, error } = await clienteService.delete(clienteEliminar.id);
      
      if (success) {
        cargarClientes();
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

  const handleClienteGuardado = () => {
    cargarClientes();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            Cargando clientes...
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
            Clientes
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Total: <strong>{filtrados.length}</strong> de <strong>{clientes.length}</strong>
          </p>
        </div>

        <button
          onClick={abrirFormularioNuevo}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-all hover:shadow-lg active:scale-95"
          style={{ backgroundColor: colors.primary }}
        >
          <Plus size={20} />
          Nuevo Cliente
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
            placeholder="Buscar por nombre, email o ciudad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-white'
                : 'bg-gray-100 border border-gray-300'
            }`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Tipo de Cliente
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-gray-100 border border-gray-300'
              }`}
            >
              <option value="todos">Todos los tipos</option>
              <option value="comprador">Comprador</option>
              <option value="vendedor">Vendedor</option>
              <option value="arrendatario">Arrendatario</option>
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
              className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-gray-100 border border-gray-300'
              }`}
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Clientes */}
      {filtrados.length > 0 ? (
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
                    Nombre
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    Email
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    Teléfono
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    Tipo
                  </th>
                  <th className={`px-6 py-3 text-left text-sm font-semibold ${
                    isDarkMode ? 'text-slate-200' : 'text-gray-700'
                  }`}>
                    Presupuesto
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
                {filtrados.map((cliente, index) => (
                  <tr
                    key={cliente.id}
                    className={`border-b transition-colors ${
                      isDarkMode
                        ? 'border-slate-700 hover:bg-slate-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <td className={`px-6 py-4 text-sm font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {cliente.nombre}
                    </td>
                    <td className={`px-6 py-4 text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className={isDarkMode ? 'text-slate-400' : 'text-gray-400'} />
                        {cliente.email}
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      {cliente.telefono ? (
                        <div className="flex items-center gap-2">
                          <Phone size={16} className={isDarkMode ? 'text-slate-400' : 'text-gray-400'} />
                          {cliente.telefono}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                        obtenerColorTipo(cliente.tipo_cliente)
                      }`}>
                        {obtenerTextoTipo(cliente.tipo_cliente)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-600'
                    }`}>
                      {cliente.presupuesto_min || cliente.presupuesto_max ? (
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} style={{ color: colors.primary }} />
                          {cliente.presupuesto_min ? `${(cliente.presupuesto_min / 1000).toFixed(0)}K` : '-'}
                          {' - '}
                          {cliente.presupuesto_max ? `${(cliente.presupuesto_max / 1000).toFixed(0)}K` : '-'}
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-semibold ${obtenerColorEstado(cliente.estado)}`}>
                        {cliente.estado === 'activo' ? '✓ Activo' : '✗ Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => abrirFormularioEditar(cliente)}
                          className="p-2 rounded-lg transition-all hover:bg-opacity-80"
                          style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                          title="Editar"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => abrirConfirmacionEliminar(cliente)}
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
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p className={`text-lg font-semibold mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            No se encontraron clientes
          </p>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            Crea un nuevo cliente para empezar
          </p>
        </div>
      )}

      {/* Estadísticas */}
      {clientes.length > 0 && (
        <div className={`rounded-lg shadow-sm p-6 grid grid-cols-1 md:grid-cols-4 gap-4 ${
          isDarkMode ? 'bg-slate-800' : 'bg-gray-50'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {clientes.length}
            </p>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Total</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {clientes.filter(c => c.tipo_cliente === 'comprador').length}
            </p>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Compradores</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {clientes.filter(c => c.tipo_cliente === 'vendedor').length}
            </p>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Vendedores</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {clientes.filter(c => c.estado === 'activo').length}
            </p>
            <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Activos</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      {mostrarFormulario && (
        <FormularioCliente
          clienteId={clienteEditar?.id}
          agenteId={user?.id}
          onClose={cerrarFormulario}
          onGuardado={handleClienteGuardado}
        />
      )}

      {/* Modal de confirmación */}
      {mostrarConfirmacion && clienteEliminar && (
        <ModalConfirmacion
          titulo="Eliminar Cliente"
          mensaje={`¿Estás seguro de que deseas eliminar a "${clienteEliminar.nombre}"? Esta acción no se puede deshacer.`}
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
