import React, { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Check } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { useTheme } from '../context/ThemeContext';

export default function DescriptionGenerator() {
  const { generateDescription, loading, error } = useAI();
  const { isDarkMode, colors } = useTheme();
  const [copied, setCopied] = useState(false);
  const [generated, setGenerated] = useState('');

  const [formData, setFormData] = useState({
    tipo: 'Apartamento',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    location: 'Centro',
    features: 'Balcón, Piscina, Gym',
    price: '$250,000',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async () => {
    const description = await generateDescription(formData);
    if (description) {
      setGenerated(description);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
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
        <div className="p-3 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
          <Sparkles size={24} style={{ color: colors.primary }} />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Generador de Descripciones IA
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Crea descripciones profesionales automáticamente
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Tipo */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Tipo de Propiedad
          </label>
          <select
            name="tipo"
            value={formData.tipo}
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
            <option>Terreno</option>
          </select>
        </div>

        {/* Dormitorios */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Dormitorios
          </label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-white'
                : 'border border-gray-300 bg-white'
            }`}
          />
        </div>

        {/* Baños */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Baños
          </label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-white'
                : 'border border-gray-300 bg-white'
            }`}
          />
        </div>

        {/* Área */}
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
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-white'
                : 'border border-gray-300 bg-white'
            }`}
          />
        </div>

        {/* Ubicación */}
        <div className="md:col-span-1">
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Ubicación
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Ej: Centro, Zona Norte"
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-white'
                : 'border border-gray-300 bg-white'
            }`}
          />
        </div>

        {/* Precio */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Precio
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Ej: $250,000"
            className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
              isDarkMode
                ? 'bg-slate-700 border border-slate-600 text-white'
                : 'border border-gray-300 bg-white'
            }`}
          />
        </div>
      </div>

      {/* Features */}
      <div className="mb-6">
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Características Principales
        </label>
        <textarea
          name="features"
          value={formData.features}
          onChange={handleInputChange}
          placeholder="Ej: Balcón, Piscina, Gimnasio, Seguridad 24/7"
          rows="2"
          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600 text-white'
              : 'border border-gray-300 bg-white'
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
        disabled={loading}
        className="w-full font-semibold py-2 px-4 rounded-lg transition-all text-white disabled:opacity-50 flex items-center justify-center gap-2 mb-6"
        style={{
          backgroundColor: colors.primary,
          opacity: loading ? 0.5 : 1,
        }}
      >
        <Sparkles size={18} />
        {loading ? 'Generando...' : 'Generar Descripción'}
      </button>

      {/* Generated Description */}
      {generated && (
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Descripción Generada:
          </h4>
          <div className={`p-4 rounded-lg mb-4 ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <p className={isDarkMode ? 'text-slate-200' : 'text-gray-700'}>
              {generated}
            </p>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
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
                Copiar Descripción
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
