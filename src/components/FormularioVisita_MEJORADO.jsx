import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Check, Calendar, Clock } from 'lucide-react';
import { visitaService } from '../services/supabaseServices';
import { clienteService } from '../services/supabaseServices';
import { inmuebleService } from '../services/supabaseServices';
import { useTheme } from '../context/ThemeContext';
import { useSupabase } from '../context/SupabaseContext';

export default function FormularioVisita({ 
  visitaId = null, 
  onClose, 
  onGuardado,
  clienteIdPredeterminado = null,
  inmuebleIdPredeterminado = null,
}) {
  const { isDarkMode, colors } = useTheme();
  //const { user } = useSupabase();
  const { user: contextUser } = useSupabase();
  const user = contextUser || JSON.parse(localStorage.getItem('user') || 'null');
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [clientes, setClientes] = useState([]);
  const [inmuebles, setInmuebles] = useState([]);

  const [formData, setFormData] = useState({
    cliente_id: clienteIdPredeterminado || '',
    inmueble_id: inmuebleIdPredeterminado || '',
    fecha: '',
    hora: '',
    estado: 'confirmada',
    notas: '',
    agente_id: user?.id,
  });

  useEffect(() => {
    cargarOpciones();
  }, []);

  useEffect(() => {
    if (visitaId) {
      cargarVisita();
    }
  }, [visitaId]);

  const cargarOpciones = async () => {
    setLoading(true);
    try {
      const { data: clientesData } = await clienteService.getAll();
      const { data: inmuebleData } = await inmuebleService.getAll();
      
      setClientes(clientesData || []);
      setInmuebles(inmuebleData || []);
    } catch (err) {
      setError('Error cargando opciones: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cargarVisita = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await visitaService.getById(visitaId);
      if (err) throw err;
      
      setFormData({
        cliente_id: data.cliente_id,
        inmueble_id: data.inmueble_id,
        fecha: data.fecha,
        hora: data.hora,
        estado: data.estado,
        notas: data.notas || '',
        agente_id: data.agente_id,
      });
    } catch (err) {
      setError('Error cargando visita: ' + err.message);
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

    if (!formData.cliente_id) {
      setError('Selecciona un cliente');
      return;
    }
    if (!formData.inmueble_id) {
      setError('Selecciona un inmueble');
      return;
    }
    if (!formData.fecha) {
      setError('La fecha es requerida');
      return;
    }
    if (!formData.hora) {
      setError('La hora es requerida');
      return;
    }

    setGuardando(true);

    try {
      let resultado;

      if (visitaId) {
        resultado = await visitaService.update(visitaId, formData);
      } else {
        resultado = await visitaService.create(formData);
      }

      if (resultado.error) {
        setError('Error guardando visita: ' + resultado.error);
      } else {
        setExito(visitaId ? 'Visita actualizada correctamente' : 'Visita creada correctamente');
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
        <div className="flex justify-between items-center p-6 border-b"
          style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {visitaId ? 'Editar Visita' : 'Nueva Visita'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Fecha *
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
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
                Hora *
              </label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
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
              <option value="confirmada">Confirmada</option>
              <option value="realizada">Realizada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

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
              placeholder="Notas sobre la visita..."
              rows="3"
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-white border border-gray-300'
              }`}
            />
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
            {guardando ? 'Guardando...' : visitaId ? 'Actualizar' : 'Crear Visita'}
          </button>
        </div>
      </div>
    </div>
  );
}
