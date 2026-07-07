import React, { useState } from 'react';
import { Globe, Copy, Check } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { useTheme } from '../context/ThemeContext';

export default function TranslationTool() {
  const { translateDescription, loading, error } = useAI();
  const { isDarkMode, colors } = useTheme();
  const [copied, setCopied] = useState(false);
  const [translated, setTranslated] = useState('');

  const [formData, setFormData] = useState({
    originalText: '',
    targetLanguage: 'Inglés',
  });

  const languages = ['Inglés', 'Francés', 'Alemán', 'Italiano', 'Portugués', 'Holandés', 'Chino', 'Japonés'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTranslate = async () => {
    if (!formData.originalText.trim()) {
      return;
    }
    const translation = await translateDescription(formData.originalText, formData.targetLanguage);
    if (translation) {
      setTranslated(translation);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translated);
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
          <Globe size={24} style={{ color: colors.secondary }} />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Traductor de Anuncios
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Traduce descripciones a múltiples idiomas
          </p>
        </div>
      </div>

      {/* Idioma */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Idioma de Destino
        </label>
        <select
          name="targetLanguage"
          value={formData.targetLanguage}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600 text-white'
              : 'border border-gray-300 bg-white'
          }`}
        >
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      {/* Texto Original */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Texto Original
        </label>
        <textarea
          name="originalText"
          value={formData.originalText}
          onChange={handleInputChange}
          placeholder="Pega aquí la descripción que quieres traducir..."
          rows="5"
          className={`w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400'
              : 'border border-gray-300 bg-white placeholder-gray-500'
          }`}
        />
        <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          Caracteres: {formData.originalText.length}
        </p>
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

      {/* Translate Button */}
      <button
        onClick={handleTranslate}
        disabled={loading || !formData.originalText.trim()}
        className="w-full font-semibold py-2 px-4 rounded-lg transition-all text-white disabled:opacity-50 mb-6"
        style={{
          backgroundColor: colors.primary,
          opacity: loading || !formData.originalText.trim() ? 0.5 : 1,
        }}
      >
        {loading ? 'Traduciendo...' : 'Traducir al ' + formData.targetLanguage}
      </button>

      {/* Translated Text */}
      {translated && (
        <div>
          <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Texto Traducido ({formData.targetLanguage}):
          </h4>
          <div className={`p-4 rounded-lg mb-4 ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <p className={isDarkMode ? 'text-slate-200' : 'text-gray-700'}>
              {translated}
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
                Copiar Traducción
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
