import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ModalConfirmacion({
  titulo = 'Confirmar acción',
  mensaje = '¿Estás seguro de que deseas continuar?',
  textoBotonConfirmar = 'Confirmar',
  textoBotonCancelar = 'Cancelar',
  tipo = 'warning', // warning, danger, info
  onConfirmar,
  onCancelar,
  cargando = false,
}) {
  const { isDarkMode, colors } = useTheme();

  const obtenerColorPorTipo = () => {
    switch (tipo) {
      case 'danger':
        return {
          fondo: isDarkMode ? 'bg-red-900 bg-opacity-30' : 'bg-red-50',
          icono: 'text-red-600',
          boton: 'bg-red-600 hover:bg-red-700',
        };
      case 'warning':
        return {
          fondo: isDarkMode ? 'bg-yellow-900 bg-opacity-30' : 'bg-yellow-50',
          icono: 'text-yellow-600',
          boton: 'bg-yellow-600 hover:bg-yellow-700',
        };
      default:
        return {
          fondo: isDarkMode ? 'bg-blue-900 bg-opacity-30' : 'bg-blue-50',
          icono: 'text-blue-600',
          boton: 'bg-blue-600 hover:bg-blue-700',
        };
    }
  };

  const colores = obtenerColorPorTipo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-lg shadow-2xl w-full max-w-sm m-4 ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b"
          style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
          <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {titulo}
          </h2>
          <button
            onClick={onCancelar}
            disabled={cargando}
            className={`p-2 rounded-lg hover:bg-opacity-80 disabled:opacity-50 ${
              isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className={`p-6 ${colores.fondo}`}>
          <div className="flex gap-4">
            {tipo === 'danger' ? (
              <Trash2 size={32} className={colores.icono} />
            ) : (
              <AlertTriangle size={32} className={colores.icono} />
            )}
            <p className={`text-sm leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-gray-700'
            }`}>
              {mensaje}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t"
          style={{ borderColor: isDarkMode ? '#475569' : '#e5e7eb' }}>
          <button
            onClick={onCancelar}
            disabled={cargando}
            className={`px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 ${
              isDarkMode
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {textoBotonCancelar}
          </button>
          <button
            onClick={onConfirmar}
            disabled={cargando}
            className={`px-6 py-2 rounded-lg font-semibold text-white transition-all disabled:opacity-50 ${colores.boton}`}
          >
            {cargando ? 'Procesando...' : textoBotonConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
