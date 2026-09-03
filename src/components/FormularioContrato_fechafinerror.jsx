import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Check, Calendar, DollarSign } from 'lucide-react';
import { contratoService } from '../services/supabaseServices';
import { inmuebleService } from '../services/supabaseServices';
import { clienteService } from '../services/supabaseServices';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function FormularioContrato({
  contratoId = null,
  onClose,
  onGuardado,
}) {
  const { isDarkMode, colors } = useTheme();
  const { user } = useAuth();

  // ESTADO SIMPLE Y DIRECTO
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
  });

  const [inmuebles, setInmuebles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [erroresValidacion, setErroresValidacion] = useState({});

  // CARGAR DATOS AL MONTAR
  useEffect(() => {
    const cargar = async () => {
      try {
        const [resInmuebles, resClientes] = await Promise.all([
          inmuebleService.getAll(),
          clienteService.getAll(),
        ]);

        setInmuebles(resInmuebles.data || []);
        setClientes(resClientes.data || []);
      } catch (err) {
        console.error('Error cargando:', err);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  // CARGAR CONTRATO SI ES EDICIÓN
  useEffect(() => {
    if (contratoId) {
      const cargar = async () => {
        try {
          const res = await contratoService.getById(contratoId);
          if (res.data) {
            setFormData(res.data);
          }
        } catch (err) {
          setError('Error cargando contrato: ' + err.message);
        }
      };
      cargar();
    }
  }, [contratoId]);

  // HANDLE CAMBIO DE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error de este campo
    if (erroresValidacion[name]) {
      setErroresValidacion(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    setError('');
  };

  // CALCULAR COMISIÓN
  useEffect(() => {
    if (formData.precio_total && formData.comision_porcentaje) {
      const comision = (parseFloat(formData.precio_total) * parseFloat(formData.comision_porcentaje)) / 100;
      setFormData(prev => ({
        ...prev,
        comision_monto: comision || 0,
      }));
    }
  }, [formData.precio_total, formData.comision_porcentaje]);

  // VALIDACIÓN MEJORADA ✅
  const validar = () => {
    const errores = {};

    if (!formData.inmueble_id) {
      errores.inmueble_id = 'Selecciona un inmueble';
    }
    if (!formData.cliente_id) {
      errores.cliente_id = 'Selecciona un cliente';
    }
    if (!formData.titulo || formData.titulo.trim() === '') {
      errores.titulo = 'El título es requerido';
    }
    if (!formData.precio_total || parseFloat(formData.precio_total) <= 0) {
      errores.precio_total = 'Ingresa un precio válido (> 0)';
    }
    if (!formData.fecha_inicio) {
      errores.fecha_inicio = 'La fecha de inicio es requerida';
    }
    if (formData.fecha_fin && formData.fecha_inicio) {
      if (new Date(formData.fecha_fin) < new Date(formData.fecha_inicio)) {
        errores.fecha_fin = 'La fecha de fin debe ser posterior a la de inicio';
      }
    }

    setErroresValidacion(errores);
    return Object.keys(errores).length === 0;
  };

  // GUARDAR ✅ SIN DELAY
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // VALIDAR
    if (!validar()) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setGuardando(true);

    try {
      const datos = {
        ...formData,
        agente_id: user?.id,
      };

      let res;
      if (contratoId) {
        res = await contratoService.update(contratoId, datos);
      } else {
        res = await contratoService.create(datos);
      }

      if (res.error) {
        setError('❌ Error: ' + res.error);
        setGuardando(false);
      } else {
        setExito('✅ ' + (contratoId ? 'Actualizado' : 'Creado'));
        // ✅ Cerrar INMEDIATAMENTE sin delay
        if (onGuardado) onGuardado();
        if (onClose) onClose();
      }
    } catch (err) {
      setError('❌ Error: ' + err.message);
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`rounded-lg shadow-xl w-full max-w-3xl my-8 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b" style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {contratoId ? '✏️ Editar Contrato' : '📋 Nuevo Contrato'}
          </h2>
          <button onClick={onClose} className={`p-2 rounded ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* MENSAJES */}
          {error && <div className="p-3 rounded bg-red-100 text-red-700 text-sm flex items-center gap-2"><AlertCircle size={18} /> {error}</div>}
          {exito && <div className="p-3 rounded bg-green-100 text-green-700 text-sm flex items-center gap-2"><Check size={18} /> {exito}</div>}

          {/* FILA 1: INMUEBLE Y CLIENTE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Inmueble *
              </label>
              <select
                name="inmueble_id"
                value={formData.inmueble_id}
                onChange={handleChange}
                disabled={loading || guardando}
                className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                  erroresValidacion.inmueble_id ? 'border-red-500' : ''
                } ${
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="">{loading ? 'Cargando...' : 'Selecciona inmueble'}</option>
                {inmuebles.map(i => (
                  <option key={i.id} value={i.id}>{i.titulo}</option>
                ))}
              </select>
              {erroresValidacion.inmueble_id && <p className="text-xs text-red-500 mt-1">❌ {erroresValidacion.inmueble_id}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Cliente *
              </label>
              <select
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleChange}
                disabled={loading || guardando}
                className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                  erroresValidacion.cliente_id ? 'border-red-500' : ''
                } ${
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'
                }`}
              >
                <option value="">{loading ? 'Cargando...' : 'Selecciona cliente'}</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {erroresValidacion.cliente_id && <p className="text-xs text-red-500 mt-1">❌ {erroresValidacion.cliente_id}</p>}
            </div>
          </div>

          {/* FILA 2: TIPO Y NÚMERO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Tipo *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="compraventa">Compraventa</option>
                <option value="alquiler">Alquiler</option>
                <option value="arrendamiento">Arrendamiento</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Número
              </label>
              <input
                type="text"
                name="numero_contrato"
                value={formData.numero_contrato}
                onChange={handleChange}
                placeholder="Auto si vacío"
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
              />
            </div>
          </div>

          {/* TÍTULO */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Título *
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ej: Contrato de compraventa..."
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                erroresValidacion.titulo ? 'border-red-500' : ''
              } ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
            />
            {erroresValidacion.titulo && <p className="text-xs text-red-500 mt-1">❌ {erroresValidacion.titulo}</p>}
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Descripción..."
              rows="2"
              className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>

          {/* FECHAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Fecha Inicio *
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                  erroresValidacion.fecha_inicio ? 'border-red-500' : ''
                } ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
              />
              {erroresValidacion.fecha_inicio && <p className="text-xs text-red-500 mt-1">❌ {erroresValidacion.fecha_inicio}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Fecha Fin
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                  erroresValidacion.fecha_fin ? 'border-red-500' : ''
                } ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
              />
              {erroresValidacion.fecha_fin && <p className="text-xs text-red-500 mt-1">❌ {erroresValidacion.fecha_fin}</p>}
            </div>
          </div>

          {/* PRECIO Y COMISIÓN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Precio (€) *
              </label>
              <input
                type="number"
                name="precio_total"
                value={formData.precio_total}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 ${
                  erroresValidacion.precio_total ? 'border-red-500' : ''
                } ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
              />
              {erroresValidacion.precio_total && <p className="text-xs text-red-500 mt-1">❌ {erroresValidacion.precio_total}</p>}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Comisión (%)
              </label>
              <input
                type="number"
                name="comision_porcentaje"
                value={formData.comision_porcentaje}
                onChange={handleChange}
                placeholder="2"
                step="0.1"
                min="0"
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Comisión (€)
              </label>
              <input
                type="number"
                value={(formData.comision_monto || 0).toFixed(2)}
                disabled
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-green-400' : 'bg-gray-50 border-gray-300 text-green-600'}`}
              />
            </div>
          </div>

          {/* ESTADO */}
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
            >
              <option value="borrador">Borrador</option>
              <option value="pendiente_firma">Pendiente Firma</option>
              <option value="firmado">Firmado</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {/* NOTAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Notas
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                placeholder="Notas..."
                rows="2"
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                Condiciones Especiales
              </label>
              <textarea
                name="condiciones_especiales"
                value={formData.condiciones_especiales}
                onChange={handleChange}
                placeholder="Condiciones..."
                rows="2"
                className={`w-full px-3 py-2 rounded border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'}`}
              />
            </div>
          </div>
        </form>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-6 border-t" style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
          <button
            onClick={onClose}
            disabled={guardando}
            className={`px-6 py-2 rounded font-semibold ${
              isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            } disabled:opacity-50`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={guardando || loading}
            className="px-6 py-2 rounded font-semibold text-white disabled:opacity-50 flex items-center gap-2"
            style={{ backgroundColor: colors.primary }}
          >
            <Save size={18} />
            {guardando ? '🔄 Guardando...' : contratoId ? '📝 Actualizar' : '✅ Crear'}
          </button>
        </div>
      </div>
    </div>
  );
}
