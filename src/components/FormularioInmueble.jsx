import { useState, useEffect } from 'react';
import { X, Upload, Trash2, Check, AlertCircle } from 'lucide-react';
import { inmuebleService } from '../services/supabaseServices';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';

export default function FormularioInmueble({ 
  inmuebleId = null, 
  onClose, 
  onGuardado,
  agenteId 
}) {
  const { isDarkMode, colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'apartamento',
    precio: '',
    area: '',
    dormitorios: '',
    banos: '',
    ubicacion: '',
    ciudad: '',
    estado: 'disponible',
    imagenes_urls: [],
    caracteristicas: [],
    agente_id: agenteId,
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (inmuebleId) {
      cargarInmueble();
    }
  }, [inmuebleId]);

  const cargarInmueble = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await inmuebleService.getById(inmuebleId);
      if (err) throw err;
      
      setFormData({
        titulo: data.titulo || '',
        descripcion: data.descripcion || '',
        tipo: data.tipo || 'apartamento',
        precio: data.precio || '',
        area: data.area || '',
        dormitorios: data.dormitorios || '',
        banos: data.banos || '',
        ubicacion: data.ubicacion || '',
        ciudad: data.ciudad || '',
        estado: data.estado || 'disponible',
        imagenes_urls: data.imagenes_urls || [],
        caracteristicas: data.caracteristicas || [],
        agente_id: data.agente_id,
      });
    } catch (err) {
      setError('Error cargando inmueble: ' + err.message);
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

  const handleUploadImagen = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe ser mayor a 5MB');
      return;
    }

    setSubiendo(true);
    setError('');

    try {
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${file.name}`;
      
      // Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('Inmuebles public')
        .upload(`${fileName}`, file);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from('Inmuebles public')
        .getPublicUrl(`${fileName}`);

      //const publicUrl = publicUrlData.publicUrl;
      const publicUrl = publicUrlData?.publicUrl;

      if (!publicUrl) {
        setError("No se pudo obtener la URL pública");
        return;
      }
      // Añadir URL al estado
  setFormData(prev => {
  const nuevo = {
    ...prev,
    imagenes_urls: [...prev.imagenes_urls, publicUrl],
  };

  console.log("Después de subir:", nuevo);

  return nuevo;
});

      setExito('Imagen subida correctamente');
      setTimeout(() => setExito(''), 2000);
    } catch (err) {
      setError('Error subiendo imagen: ' + err.message);
    } finally {
      setSubiendo(false);
    }
  };

  const eliminarImagen = (index) => {
    setFormData(prev => ({
      ...prev,
      imagenes_urls: prev.imagenes_urls.filter((_, i) => i !== index),
    }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    // Validación básica
    if (!formData.titulo.trim()) {
      setError('El título es requerido');
      return;
    }
    if (!formData.precio || formData.precio <= 0) {
      setError('El precio es requerido y debe ser mayor a 0');
      return;
    }
    if (!formData.ubicacion.trim()) {
      setError('La ubicación es requerida');
      return;
    }

    setGuardando(true);

    try {
      //const datosParaGuardar = {
       // ...formData,
        //precio: parseFloat(formData.precio),
        //area: formData.area ? parseInt(formData.area) : null,
        //dormitorios: formData.dormitorios ? parseInt(formData.dormitorios) : null,
       // banos: formData.banos ? parseInt(formData.banos) : null,
     // };
const datosParaGuardar = {
  titulo: formData.titulo,
  descripcion: formData.descripcion,
  tipo: formData.tipo,
  precio: parseFloat(formData.precio),
  area: formData.area ? parseInt(formData.area) : null,
  dormitorios: formData.dormitorios ? parseInt(formData.dormitorios) : null,
  banos: formData.banos ? parseInt(formData.banos) : null,
  ubicacion: formData.ubicacion,
  ciudad: formData.ciudad,
  estado: formData.estado,
  imagenes_urls: formData.imagenes_urls,
  caracteristicas: formData.caracteristicas,
  agente_id: formData.agente_id,
};
      let resultado;

      if (inmuebleId) {
        // Editar
        resultado = await inmuebleService.update(inmuebleId, datosParaGuardar);
      } else {
        // Crear
        resultado = await inmuebleService.create(datosParaGuardar);
      }

      if (resultado.error) {
        setError('Error guardando inmueble: ' + resultado.error);
      } else {
        setExito(inmuebleId ? 'Inmueble actualizado correctamente' : 'Inmueble creado correctamente');
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
            {inmuebleId ? 'Editar Inmueble' : 'Nuevo Inmueble'}
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

          {/* Fila 1: Título y Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Título *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Ej: Casa moderna con piscina"
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
                Tipo *
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
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="oficina">Oficina</option>
                <option value="local">Local Comercial</option>
                <option value="terreno">Terreno</option>
              </select>
            </div>
          </div>

          {/* Fila 2: Precio y Estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Precio *
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                placeholder="Ej: 250000"
                min="0"
                step="1000"
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
                <option value="disponible">Disponible</option>
                <option value="vendido">Vendido</option>
                <option value="alquilado">Alquilado</option>
              </select>
            </div>
          </div>

          {/* Fila 3: Ubicación y Ciudad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Ubicación (Dirección) *
              </label>
              <input
                type="text"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleInputChange}
                placeholder="Ej: Calle Principal 123"
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

          {/* Fila 4: Área, Dormitorios, Baños */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Área (m²)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="Ej: 120"
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
                Dormitorios
              </label>
              <input
                type="number"
                name="dormitorios"
                value={formData.dormitorios}
                onChange={handleInputChange}
                placeholder="Ej: 3"
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
                Baños
              </label>
              <input
                type="number"
                name="banos"
                value={formData.banos}
                onChange={handleInputChange}
                placeholder="Ej: 2"
                min="0"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white'
                    : 'bg-white border border-gray-300'
                }`}
              />
            </div>
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
              placeholder="Describe las características del inmueble..."
              rows="3"
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white'
                  : 'bg-white border border-gray-300'
              }`}
            />
          </div>

          {/* Imágenes */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              Imágenes
            </label>

            {/* Input de archivo */}
            <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:opacity-80 ${
              isDarkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-300 hover:bg-gray-50'
            }`}>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImagen}
                disabled={subiendo}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer block">
                <Upload size={24} className="mx-auto mb-2" />
                <p className="font-semibold">Sube una imagen</p>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  PNG, JPG, GIF (máx 5MB)
                </p>
              </label>
            </div>

            {subiendo && (
              <p className="mt-2 text-sm text-yellow-600">Subiendo imagen...</p>
            )}

            {/* Imágenes subidas */}
            {formData.imagenes_urls.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className={`text-sm font-semibold ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Imágenes subidas ({formData.imagenes_urls.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {formData.imagenes_urls.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`Imagen ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => eliminarImagen(idx)}
                        className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity"
                      >
                        <Trash2 size={20} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            className="px-6 py-2 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: colors.primary }}
          >
            {guardando ? 'Guardando...' : inmuebleId ? 'Actualizar' : 'Crear Inmueble'}
          </button>
        </div>
      </div>
    </div>
  );
}
