import React, { useState } from 'react';
import {
  Key,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  Check,
  AlertCircle,
  ExternalLink,
  Copy,
  Trash2,
  Zap,
  Sparkles,
  Globe,
  Settings,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { useAI } from '../context/AIContext';
import { useTheme } from '../context/ThemeContext';

export default function AISettings() {
  const { apiKey, isConfigured, saveApiKey, clearApiKey } = useAI();
  const { isDarkMode, colors } = useTheme();
  const [showKey, setShowKey] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (tempKey.trim()) {
      saveApiKey(tempKey);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleClear = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar la API Key?')) {
      clearApiKey();
      setTempKey('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
          <Settings size={24} style={{ color: colors.primary }} />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Configuración de IA
          </h1>
          <p className={`text-gray-600 mt-1 ${isDarkMode ? 'text-slate-400' : ''}`}>
            Configura tu API Key de OpenAI para usar las herramientas de IA
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className={`rounded-lg shadow-sm border p-8 ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}>
        {/* Status */}
        <div className={`mb-6 p-4 rounded-lg ${
          isConfigured
            ? isDarkMode
              ? 'bg-green-900 bg-opacity-30 border border-green-700'
              : 'bg-green-50 border border-green-200'
            : isDarkMode
            ? 'bg-yellow-900 bg-opacity-30 border border-yellow-700'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center gap-2">
            {isConfigured ? (
              <>
                <Check size={20} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                <p className={isDarkMode ? 'text-green-400' : 'text-green-700'}>
                  ✅ API Key configurada correctamente
                </p>
              </>
            ) : (
              <>
                <AlertCircle size={20} className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                <p className={isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}>
                  ⚠️ Por favor configura tu API Key para usar las herramientas de IA
                </p>
              </>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className={`mb-8 p-4 rounded-lg ${
          isDarkMode
            ? 'bg-slate-700 border border-slate-600'
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <h3 className={`font-semibold mb-3 flex items-center gap-2 ${
            isDarkMode ? 'text-blue-300' : 'text-blue-900'
          }`}>
            <AlertCircle size={18} />
            Cómo obtener tu API Key
          </h3>
          <ol className={`space-y-2 text-sm ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            <li>1. Ve a <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" 
              className="underline hover:opacity-70">platform.openai.com</a></li>
            <li>2. Inicia sesión o crea una cuenta</li>
            <li>3. Ve a API keys en la navegación lateral</li>
            <li>4. Haz clic en "Create new secret key"</li>
            <li>5. Copia la clave (solo aparecerá una vez)</li>
            <li>6. Pégala en el campo de abajo</li>
          </ol>
        </div>

        {/* API Key Input */}
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-3 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            API Key de OpenAI
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="sk-..."
              className={`w-full px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                isDarkMode
                  ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400'
                  : 'border border-gray-300 bg-white placeholder-gray-500'
              }`}
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                isDarkMode
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-gray-600 hover:text-gray-700'
              }`}
            >
              {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Tu API Key se guarda localmente en tu navegador y nunca se envía a servidores externos.
          </p>
        </div>

        {/* Saved Message */}
        {saved && (
          <div className={`mb-6 p-3 rounded-lg flex items-center gap-2 text-sm ${
            isDarkMode
              ? 'bg-green-900 bg-opacity-30 text-green-400'
              : 'bg-green-50 text-green-700'
          }`}>
            <Check size={18} />
            API Key guardada correctamente
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!tempKey.trim()}
            className="flex-1 font-semibold py-3 px-4 rounded-lg transition-all text-white disabled:opacity-50"
            style={{
              backgroundColor: colors.primary,
            }}
          >
            Guardar API Key
          </button>
          {isConfigured && (
            <button
              onClick={handleClear}
              className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-all ${
                isDarkMode
                  ? 'bg-red-900 hover:bg-red-800 text-red-300'
                  : 'bg-red-100 hover:bg-red-200 text-red-700'
              }`}
            >
              Eliminar API Key
            </button>
          )}
        </div>
      </div>

      {/* Pricing Information */}
      <div className={`rounded-lg shadow-sm border p-6 ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Información de Precios
        </h3>
        <p className={`mb-3 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
          OpenAI ofrece diferentes modelos con precios competitivos:
        </p>
        <div className="space-y-2 text-sm">
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            • <strong>GPT-3.5 Turbo:</strong> $0.0005 por 1K tokens de entrada
          </p>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            • <strong>GPT-4:</strong> $0.03 por 1K tokens de entrada
          </p>
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            • Los tokens de salida típicamente cuestan el doble
          </p>
          <p className={isDarkMode ? 'text-slate-300 mt-4' : 'text-gray-700 mt-4'}>
            Visita <a href="https://openai.com/pricing" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70">
              openai.com/pricing
            </a> para ver los precios actuales.
          </p>
        </div>
      </div>

      {/* Features Available */}
      <div className={`rounded-lg shadow-sm border p-6 ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Funciones Disponibles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-lg ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Sparkles size={18} style={{ color: colors.primary }} />
              Generador de Descripciones
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Crea descripciones profesionales y persuasivas de inmuebles automáticamente
            </p>
          </div>

          <div className={`p-4 rounded-lg ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <Globe size={18} style={{ color: colors.secondary }} />
              Traductor de Anuncios
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Traduce tus anuncios a 8 idiomas diferentes en segundos
            </p>
          </div>

          <div className={`p-4 rounded-lg ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <TrendingUp size={18} style={{ color: colors.primary }} />
              Recomendador de Precios
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Análisis inteligente de mercado para precios competitivos
            </p>
          </div>

          <div className={`p-4 rounded-lg ${
            isDarkMode
              ? 'bg-slate-700 border border-slate-600'
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <MessageCircle size={18} style={{ color: colors.secondary }} />
              Respuestas Automáticas
            </h4>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              Genera respuestas profesionales a consultas de clientes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
