import React, { useState } from 'react';
import { MessageCircle, Copy, Check, Send } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { useTheme } from '../context/ThemeContext';

export default function AutoReplyGenerator() {
  const { generateAutoReply, loading, error } = useAI();
  const { isDarkMode, colors } = useTheme();
  const [copied, setCopied] = useState(false);
  const [reply, setReply] = useState('');

  const [formData, setFormData] = useState({
    customerMessage: '',
    propertyTipo: 'Apartamento',
    propertyLocation: 'Centro',
    propertyPrice: '$250,000',
    availability: 'Disponible inmediatamente',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    if (!formData.customerMessage.trim()) {
      return;
    }

    const autoReply = await generateAutoReply(
      formData.customerMessage,
      {
        tipo: formData.propertyTipo,
        location: formData.propertyLocation,
        price: formData.propertyPrice,
        availability: formData.availability,
      }
    );

    if (autoReply) {
      setReply(autoReply);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-lg shadow-sm border p-6 ${
      isDarkMode
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg" style={{ backgroundColor: colors.secondary + '20' }}>
          <MessageCircle size={24} style={{ color: colors.secondary }} />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Generador de Respuestas IA
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Responde automáticamente a consultas de clientes
          </p>
        </div>
      </div>

      {/* Property Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Tipo de Propiedad
          </label>
          <select
            name="propertyTipo"
            value={formData.propertyTipo}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-white'
                : 'border border-gray-300 bg-white'
            }`}
          >
            <option>Apartamento</option>
            <option>Casa</option>
            <option>Oficina</option>
            <option>Local Comercial</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Ubicación
          </label>
          <input
            type="text"
            name="propertyLocation"
            value={formData.propertyLocation}
            onChange={handleInputChange}
            placeholder="Ej: Centro"
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400'
                : 'border border-gray-300 bg-white placeholder-gray-500'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Precio
          </label>
          <input
            type="text"
            name="propertyPrice"
            value={formData.propertyPrice}
            onChange={handleInputChange}
            placeholder="Ej: $250,000"
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400'
                : 'border border-gray-300 bg-white placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Disponibilidad
        </label>
        <input
          type="text"
          name="availability"
          value={formData.availability}
          onChange={handleInputChange}
          placeholder="Ej: Disponible inmediatamente"
          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400'
              : 'border border-gray-300 bg-white placeholder-gray-500'
          }`}
        />
      </div>

      {/* Customer Message */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Mensaje del Cliente
        </label>
        <textarea
          name="customerMessage"
          value={formData.customerMessage}
          onChange={handleInputChange}
          placeholder="Ej: ¿Puedo ver la propiedad este fin de semana? ¿Cuál es el precio final?"
          rows="4"
          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400'
              : 'border border-gray-300 bg-white placeholder-gray-500'
          }`}
        />
      </div>

      {/* Error */}
      {error && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          isDarkMode
            ? 'bg-red-900 bg-opacity-30 text-red-400'
            : 'bg-red-50 text-red-600'
        }`}>
          {error}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !formData.customerMessage.trim()}
        className="w-full font-semibold py-2 px-4 rounded-lg transition-all text-white disabled:opacity-50 flex items-center justify-center gap-2 mb-6"
        style={{
          backgroundColor: colors.primary,
          opacity: loading || !formData.customerMessage.trim() ? 0.5 : 1,
        }}
      >
        <Send size={18} />
        {loading ? 'Generando respuesta...' : 'Generar Respuesta'}
      </button>

      {/* Generated Reply */}
      {reply && (
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Respuesta Sugerida:
          </h4>
          <div className={`p-4 rounded-lg mb-4 ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <p className={isDarkMode ? 'text-slate-200' : 'text-gray-700'}>
              {reply}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold flex-1 ${
                copied
                  ? isDarkMode
                    ? 'bg-green-900 text-green-300'
                    : 'bg-green-50 text-green-700'
                  : isDarkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Copiado
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copiar Respuesta
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
