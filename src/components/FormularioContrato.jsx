import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Check, Calendar, FileText, DollarSign } from 'lucide-react';
import { contratoService } from '../services/supabaseServices';
import { inmuebleService } from '../services/supabaseServices';
import { clienteService } from '../services/supabaseServices';
import { useTheme } from '../context/ThemeContext';
import { useSupabase } from '../context/SupabaseContext';

export default function FormularioContrato({
  contratoId = null,
  onClose,
  onGuardado,
}) {
  const { isDarkMode, colors } = useTheme();
  const { user: contextUser } = useSupabase();
  const user = contextUser || JSON.parse(localStorage.getItem('user') || 'null');

  // Estados
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [inmuebles, setInmuebles] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Datos del formulario
  const [formData, setFormData] = useState({
    inmueble_id: '',
    cliente_id: '',
    tipo: 'compraventa',
    numero_contrato: '',
    titulo: '',
    descripcion: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: '',
    precio_total: '',
    comision_porcentaje: 2,
    estado: 'borrador',
    notas: '',
    condiciones_especiales: '',
    agente_id: user?.id,
  });

  // Cargar opciones al abrir
  useEffect(() => {
    cargarOpciones();
  }, []);

  // Cargar contrato si es edición
  useEffect(() => {
    if (contratoId) {
      cargarContrato();
    }
  }, [contratoId]);

  // Calcular comisión automáticamente
  useEffect(() => {
    if (formData.precio_total && formData.comision_porcentaje) {
      const comision = (parseFloat(formData.precio_total) * parseFloat(formData.comision_porcentaje)) / 100;
      setFormData(prev => ({
        ...prev,
        comision_monto: comision,
      }));
    }
  }, [formData.precio_total, formData.comision_porcentaje]);

  const cargarOpciones = async () => {
    setLoading(true);
    try {
      const [inmuebesRes, clientesRes] = await Promise.all([
        inmuebleService.getAll(),
        clienteService.getAll(),
      ]);

      if (!inmuebesRes.error) {
        setInmuebles(inmuebesRes.data || []);
      }
      if (!clientesRes.error) {
        setClientes(clientesRes.data || []);
      }
    } catch (err) {
      setError('Error cargando opciones: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarContrato = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await contratoService.getById(contratoId);
      if (err) throw err;

      setFormData({
        inmueble_id: data.inmueble_id,
        cliente_id: data.cliente_id,
        tipo: data.tipo,
        numero_contrato: data.numero_contrato,
        titulo: data.titulo,
        descripcion: data.descripcion || '',
        fecha_inicio: data.fecha_inicio,
        fecha_fin: data.fecha_fin || '',
        precio_total: data.precio_total,
        comision_porcentaje: data.comision_porcentaje || 2,
        comision_monto: data.comision_monto || 0,
        estado: data.estado,
        notas: data.notas || '',
        condiciones_especiales: data.condiciones_especiales || '',
        agente_id: data.agente_id,
      });
    } catch (err) {
      setError('Error cargando contrato: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validaciones
    if (!formData.inmueble_id) {
      setError('Selecciona un inmueble');
      return;
    }
    if (!formData.cliente_id) {
      setError('Selecciona un cliente');
      return;
    }
    if (!formData.titulo) {
      setError('El título es requerido');
      return;
    }
    if (!formData.precio_total || parseFloat(formData.precio_total) <= 0) {
      setError('Ingresa un precio total válido');
      return;
    }
    if (!formData.fecha_inicio) {
      setError('La fecha de inicio es requerida');
      return;
    }

    setGuardando(true);

    try {
      let resultado;

      if (contratoId) {
        resultado = await contratoService.update(contratoId, formData);
      } else {
        resultado = await contratoService.create(formData);
      }

      if (resultado.error) {
        setError('Error guardando contrato: ' + resultado.error);
      } else {
        setExito(contratoId ? 'Contrato actualizado correctamente' : 'Contrato creado correctamente');
        setTimeout(() => {
          if (onGuardado) onGuardado();
          if (onClose) onClose();
        }, 1500);
      }
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`rounded-lg p-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primary }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className={`rounded-lg shadow-2xl w-full max-w-4xl m-4 ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center p-6 border-b"
          style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {contratoId ? 'Editar Contrato' : 'Nuevo Contrato'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-opacity-80 ${
              isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleGuardar} className="p-6 space-y-6">
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

          {/* Selects principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Inmueble *
              </label>
              <select
                name="inmueble_id"
                value={formData.inmueble_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              >
                <option value="">Selecciona un inmueble</option>
                {inmuebles.map(inmueble => (
                  <option key={inmueble.id} value={inmueble.id}>
                    {inmueble.titulo} - {inmueble.ubicacion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Cliente *
              </label>
              <select
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              >
                <option value="">Selecciona un cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} ({cliente.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tipo y Número */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Tipo de Contrato *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              >
                <option value="compraventa">Compraventa</option>
                <option value="alquiler">Alquiler</option>
                <option value="arrendamiento">Arrendamiento</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Número de Contrato
              </label>
              <input
                type="text"
                name="numero_contrato"
                value={formData.numero_contrato}
                onChange={handleInputChange}
                placeholder="Ej: CONT-2024-001"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Si dejas vacío, se generará automáticamente
              </p>
            </div>
          </div>

          {/* Título */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Título del Contrato *
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              placeholder="Ej: Contrato de compraventa del inmueble..."
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-white border border-gray-300'
              }`}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción del contrato..."
              rows="3"
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-white border border-gray-300'
              }`}
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Fecha de Inicio *
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-slate-700 border border-slate-600 text-white'
                      : 'bg-white border border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Fecha de Fin
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="fecha_fin"
                  value={formData.fecha_fin}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-slate-700 border border-slate-600 text-white'
                      : 'bg-white border border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Precio y Comisión */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Precio Total *
              </label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="precio_total"
                  value={formData.precio_total}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? 'bg-slate-700 border border-slate-600 text-white'
                      : 'bg-white border border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Comisión (%)
              </label>
              <input
                type="number"
                name="comision_porcentaje"
                value={formData.comision_porcentaje}
                onChange={handleInputChange}
                placeholder="0"
                step="0.1"
                min="0"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Comisión (€)
              </label>
              <input
                type="number"
                value={formData.comision_monto || 0}
                disabled
                className={`w-full px-4 py-2 rounded-lg ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-slate-400'
                    : 'bg-gray-100 border border-gray-300 text-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-white border border-gray-300'
              }`}
            >
              <option value="borrador">Borrador</option>
              <option value="pendiente_firma">Pendiente de Firma</option>
              <option value="firmado">Firmado</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {/* Notas y Condiciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Notas
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleInputChange}
                placeholder="Notas sobre el contrato..."
                rows="3"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Condiciones Especiales
              </label>
              <textarea
                name="condiciones_especiales"
                value={formData.condiciones_especiales}
                onChange={handleInputChange}
                placeholder="Condiciones especiales del contrato..."
                rows="3"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              />
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-3 p-6 border-t"
          style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
          <button
            onClick={onClose}
            disabled={guardando}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              isDarkMode
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            } disabled:opacity-50`}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="px-6 py-2 rounded-lg font-semibold text-white transition-all disabled:opacity-50 flex items-center gap-2"
            style={{ backgroundColor: colors.primary }}
          >
            <Save size={18} />
            {guardando ? 'Guardando...' : contratoId ? 'Actualizar' : 'Crear Contrato'}
          </button>
        </div>
      </div>
    </div>
  );
}
