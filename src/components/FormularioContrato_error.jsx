import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Check, Calendar, FileText, DollarSign } from 'lucide-react';
import { contratoService } from '../services/supabaseServices';
import { inmuebleService } from '../services/supabaseServices';
import { clienteService } from '../services/supabaseServices';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // ← ARREGLADO: Usar useAuth

export default function FormularioContrato({
  contratoId = null,
  onClose,
  onGuardado,
}) {
  const { isDarkMode, colors } = useTheme();
  const { user } = useAuth(); // ← ARREGLADO: Usar useAuth en lugar de useSupabase

  // Estados principales
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Datos de opciones (siempre inicializados como arrays)
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

  // ARREGLADO: Usar useEffect solo una vez para cargar opciones
  useEffect(() => {
    cargarOpciones();
  }, []);

  // ARREGLADO: useEffect separado para cargar contrato si es edición
  useEffect(() => {
    if (contratoId && loading === false) {
      cargarContrato();
    }
  }, [contratoId]);

  // ARREGLADO: Calcular comisión cuando cambia precio o porcentaje
  useEffect(() => {
    if (formData.precio_total && formData.comision_porcentaje) {
      const comision = (parseFloat(formData.precio_total) * parseFloat(formData.comision_porcentaje)) / 100;
      setFormData(prev => ({
        ...prev,
        comision_monto: isNaN(comision) ? 0 : comision,
      }));
    }
  }, [formData.precio_total, formData.comision_porcentaje]);

  // ARREGLADO: Mejorada función cargarOpciones
  const cargarOpciones = async () => {
    try {
      setLoading(true);
      
      const [inmuebesRes, clientesRes] = await Promise.all([
        inmuebleService.getAll(),
        clienteService.getAll(),
      ]);

      // Asegurar que siempre son arrays
      if (!inmuebesRes.error && inmuebesRes.data) {
        setInmuebles(inmuebesRes.data);
      } else {
        setInmuebles([]);
      }

      if (!clientesRes.error && clientesRes.data) {
        setClientes(clientesRes.data);
      } else {
        setClientes([]);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error cargando opciones:', err);
      setInmuebles([]);
      setClientes([]);
      setError('Error cargando inmuebles o clientes: ' + err.message);
      setLoading(false);
    }
  };

  // ARREGLADO: Mejorada función cargarContrato
  const cargarContrato = async () => {
    try {
      const { data, error: err } = await contratoService.getById(contratoId);
      if (err) throw err;

      setFormData({
        inmueble_id: data.inmueble_id || '',
        cliente_id: data.cliente_id || '',
        tipo: data.tipo || 'compraventa',
        numero_contrato: data.numero_contrato || '',
        titulo: data.titulo || '',
        descripcion: data.descripcion || '',
        fecha_inicio: data.fecha_inicio || new Date().toISOString().split('T')[0],
        fecha_fin: data.fecha_fin || '',
        precio_total: data.precio_total || '',
        comision_porcentaje: data.comision_porcentaje || 2,
        comision_monto: data.comision_monto || 0,
        estado: data.estado || 'borrador',
        notas: data.notas || '',
        condiciones_especiales: data.condiciones_especiales || '',
        agente_id: data.agente_id,
      });
    } catch (err) {
      console.error('Error cargando contrato:', err);
      setError('Error cargando contrato: ' + err.message);
    }
  };

  // ARREGLADO: handleInputChange
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validar tipos de datos
    let finalValue = value;
    if (name === 'precio_total' || name === 'comision_porcentaje') {
      finalValue = value === '' ? '' : parseFloat(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));

    // Limpiar error cuando el usuario empieza a escribir
    if (error) {
      setError('');
    }
  };

  // ARREGLADO: handleGuardar mejorado
  const handleGuardar = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validaciones
    if (!formData.inmueble_id) {
      setError('❌ Selecciona un inmueble');
      return;
    }
    if (!formData.cliente_id) {
      setError('❌ Selecciona un cliente');
      return;
    }
    if (!formData.titulo || formData.titulo.trim() === '') {
      setError('❌ El título es requerido');
      return;
    }
    if (!formData.precio_total || parseFloat(formData.precio_total) <= 0) {
      setError('❌ Ingresa un precio total válido (> 0)');
      return;
    }
    if (!formData.fecha_inicio) {
      setError('❌ La fecha de inicio es requerida');
      return;
    }

    setGuardando(true);

    try {
      let resultado;

      const datosAGuardar = {
        ...formData,
        agente_id: user?.id, // Asegurar que tiene el ID correcto
      };

      if (contratoId) {
        resultado = await contratoService.update(contratoId, datosAGuardar);
      } else {
        resultado = await contratoService.create(datosAGuardar);
      }

      if (resultado.error) {
        setError('❌ Error guardando contrato: ' + resultado.error);
      } else {
        setExito('✅ ' + (contratoId ? 'Contrato actualizado' : 'Contrato creado') + ' correctamente');
        
        // Esperar antes de cerrar para que vea el mensaje de éxito
        setTimeout(() => {
          if (onGuardado) onGuardado();
          if (onClose) onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error guardando:', err);
      setError('❌ Error: ' + err.message);
    } finally {
      setGuardando(false);
    }
  };

  // ARREGLADO: Modal mejorado
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className={`rounded-lg shadow-2xl w-full max-w-4xl my-4 ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b"
          style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {contratoId ? '✏️ Editar Contrato' : '📋 Nuevo Contrato'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
              isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleGuardar} className="p-6 space-y-6">
          {/* Mensajes de error y éxito */}
          {error && (
            <div className="p-4 rounded-lg bg-red-100 text-red-700 flex items-start gap-3 animate-pulse">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {exito && (
            <div className="p-4 rounded-lg bg-green-100 text-green-700 flex items-start gap-3">
              <Check size={20} className="flex-shrink-0 mt-0.5" />
              <span>{exito}</span>
            </div>
          )}

          {/* ARREGLADO: Indicador de carga visible */}
          {loading && (
            <div className="p-4 rounded-lg bg-blue-100 text-blue-700 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
              <span>Cargando inmuebles y clientes...</span>
            </div>
          )}

          {/* Selects principales - ARREGLADO: Siempre visibles pero deshabilitados si está cargando */}
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
                disabled={loading || guardando}
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  loading || guardando ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white disabled:bg-slate-600'
                    : 'bg-white border border-gray-300 disabled:bg-gray-100'
                }`}
              >
                <option value="">
                  {loading ? 'Cargando inmuebles...' : 'Selecciona un inmueble'}
                </option>
                {inmuebles.map(inmueble => (
                  <option key={inmueble.id} value={inmueble.id}>
                    {inmueble.titulo} - {inmueble.ubicacion}
                  </option>
                ))}
              </select>
              {inmuebles.length === 0 && !loading && (
                <p className="text-xs text-red-500 mt-1">No hay inmuebles disponibles</p>
              )}
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
                disabled={loading || guardando}
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  loading || guardando ? 'opacity-60 cursor-not-allowed' : ''
                } ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white disabled:bg-slate-600'
                    : 'bg-white border border-gray-300 disabled:bg-gray-100'
                }`}
              >
                <option value="">
                  {loading ? 'Cargando clientes...' : 'Selecciona un cliente'}
                </option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} ({cliente.email})
                  </option>
                ))}
              </select>
              {clientes.length === 0 && !loading && (
                <p className="text-xs text-red-500 mt-1">No hay clientes disponibles</p>
              )}
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
                disabled={guardando}
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
                disabled={guardando}
                placeholder="Auto si vacío"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              />
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Se generará automáticamente si dejas vacío
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
              disabled={guardando}
              placeholder="Ej: Contrato de compraventa..."
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
              disabled={guardando}
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
                  disabled={guardando}
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
                  disabled={guardando}
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
                Precio Total (€) *
              </label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  name="precio_total"
                  value={formData.precio_total}
                  onChange={handleInputChange}
                  disabled={guardando}
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
                disabled={guardando}
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
                value={formData.comision_monto?.toFixed(2) || '0.00'}
                disabled
                className={`w-full px-4 py-2 rounded-lg font-semibold ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-green-400'
                    : 'bg-gray-50 border border-gray-300 text-green-600'
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
              disabled={guardando}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-white border border-gray-300'
              }`}
            >
              <option value="borrador">📝 Borrador</option>
              <option value="pendiente_firma">⏳ Pendiente Firma</option>
              <option value="firmado">✅ Firmado</option>
              <option value="completado">🎉 Completado</option>
              <option value="cancelado">❌ Cancelado</option>
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
                disabled={guardando}
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
                disabled={guardando}
                placeholder="Condiciones especiales..."
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

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t"
          style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
          <button
            onClick={onClose}
            disabled={guardando}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              isDarkMode
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando || loading}
            className="px-6 py-2 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-[1.02] active:scale-95"
            style={{ backgroundColor: colors.primary }}
          >
            <Save size={18} />
            {guardando ? '🔄 Guardando...' : contratoId ? '📝 Actualizar' : '✅ Crear Contrato'}
          </button>
        </div>
      </div>
    </div>
  );
}
