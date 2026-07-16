import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Check, Phone, Mail } from 'lucide-react';
import { clienteService } from '../services/supabaseServices';
import { useTheme } from '../context/ThemeContext';
import { useSupabase } from '../context/SupabaseContext';

export default function FormularioCliente({ 
  clienteId = null, 
  agenteId,
  onClose, 
  onGuardado
}) {


  const { isDarkMode, colors } = useTheme();
  const { user } = useSupabase();
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipo_cliente: 'comprador', // comprador, vendedor, arrendatario
    presupuesto_min: '',
    presupuesto_max: '',
    tipo_propiedad: '', // apartamento, casa, oficina, etc
    ciudad: '',
    estado: 'activo', // activo, inactivo
    fuente: '', // referencia, portal, anuncio, etc
    notas: '',
    agente_id: agenteId,
  });


  //por si agenteId llega después del primer render
  useEffect(() => {
    if (agenteId) {
      setFormData(prev => ({
        ...prev,
        agente_id: agenteId,
      }));
    }
  }, [agenteId]);

  // Cargar datos si es edición
  useEffect(() => {
    if (clienteId) {
      cargarCliente();
    }
  }, [clienteId]);

  const cargarCliente = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await clienteService.getById(clienteId);
      if (err) throw err;
      
      setFormData({
        nombre: data.nombre || '',
        email: data.email || '',
        telefono: data.telefono || '',
        tipo_cliente: data.tipo_cliente || 'comprador',
        presupuesto_min: data.presupuesto_min || '',
        presupuesto_max: data.presupuesto_max || '',
        tipo_propiedad: data.tipo_propiedad || '',
        ciudad: data.ciudad || '',
        estado: data.estado || 'activo',
        fuente: data.fuente || '',
        notas: data.notas || '',
        agente_id: data.agente_id,
      });
    } catch (err) {
      setError('Error cargando cliente: ' + err.message);
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

    // Validación básica
    if (!formData.nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    if (!formData.email.trim()) {
      setError('El email es requerido');
      return;
    }
    if (!formData.email.includes('@')) {
      setError('Email no válido');
      return;
    }

    setGuardando(true);

    try {
      const datosParaGuardar = {
        ...formData,
        presupuesto_min: formData.presupuesto_min ? parseFloat(formData.presupuesto_min) : null,
        presupuesto_max: formData.presupuesto_max ? parseFloat(formData.presupuesto_max) : null,
      };

      let resultado;

      if (clienteId) {
        // Editar
        resultado = await clienteService.update(clienteId, datosParaGuardar);
      } else {
        // Crear
        resultado = await clienteService.create(datosParaGuardar);
      }

      if (resultado.error) {
        setError('Error guardando cliente: ' + resultado.error);
      } else {
        setExito(clienteId ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" 
            style={{ borderColor: colors.primary }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className={`rounded-lg shadow-2xl w-full max-w-2xl m-4 ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b"
          style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {clienteId ? 'Editar Cliente' : 'Nuevo Cliente'}
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

        {/* Contenido */}
        <form onSubmit={handleGuardar} className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Alertas */}
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

          {/* Fila 1: Nombre y Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Juan García"
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
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="juan@email.com"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Fila 2: Teléfono y Tipo de Cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="Ej: +34 123 456 789"
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
                Tipo de Cliente
              </label>
              <select
                name="tipo_cliente"
                value={formData.tipo_cliente}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              >
                <option value="comprador">Comprador</option>
                <option value="vendedor">Vendedor</option>
                <option value="arrendatario">Arrendatario</option>
              </select>
            </div>
          </div>

          {/* Fila 3: Presupuesto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Presupuesto Mínimo
              </label>
              <input
                type="number"
                name="presupuesto_min"
                value={formData.presupuesto_min}
                onChange={handleInputChange}
                placeholder="Ej: 200000"
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
                Presupuesto Máximo
              </label>
              <input
                type="number"
                name="presupuesto_max"
                value={formData.presupuesto_max}
                onChange={handleInputChange}
                placeholder="Ej: 500000"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Fila 4: Tipo Propiedad y Ciudad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Tipo de Propiedad
              </label>
              <input
                type="text"
                name="tipo_propiedad"
                value={formData.tipo_propiedad}
                onChange={handleInputChange}
                placeholder="Ej: Apartamento, Casa"
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
                Ciudad
              </label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                placeholder="Ej: Madrid"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Fila 5: Estado y Fuente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Fuente
              </label>
              <input
                type="text"
                name="fuente"
                value={formData.fuente}
                onChange={handleInputChange}
                placeholder="Ej: Portal, Referencia, Anuncio"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              />
            </div>
          </div>

          {/* Notas */}
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
              placeholder="Información adicional sobre el cliente..."
              rows="3"
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-white border border-gray-300'
              }`}
            />
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
            {guardando ? 'Guardando...' : clienteId ? 'Actualizar' : 'Crear Cliente'}
          </button>
        </div>
      </div>
    </div>
  );
}
