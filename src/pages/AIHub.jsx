import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import AIDescriptionGenerator from '../components/AIDescriptionGenerator';
import AITranslationTool from '../components/AITranslationTool';
import AIPriceSuggestion from '../components/AIPriceSuggestion';
import AIAutoReplyGenerator from '../components/AIAutoReplyGenerator';

export default function AIHub() {
  const { isConfigured } = useAI();
  const { isDarkMode, colors } = useTheme();
  const navigate = useNavigate();

  if (!isConfigured) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
            <Sparkles size={24} style={{ color: colors.primary }} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Herramientas de IA
            </h1>
            <p className={`text-gray-600 mt-1 ${isDarkMode ? 'text-slate-400' : ''}`}>
              Potencia tu CRM con inteligencia artificial
            </p>
          </div>
        </div>

        {/* Alert */}
        <div className={`rounded-lg shadow-sm border p-6 mb-6 flex items-center gap-4 ${
          isDarkMode
            ? 'bg-yellow-900 bg-opacity-20 border-yellow-700'
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <AlertCircle className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} size={24} />
          <div>
            <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
              API Key no Configurada
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
              Por favor configura tu API Key de OpenAI para usar las herramientas de IA.
            </p>
            <button
              onClick={() => navigate('/ia-settings')}
              className="mt-3 px-4 py-2 rounded-lg font-semibold transition-colors"
              style={{
                backgroundColor: colors.primary,
                color: 'white',
              }}
            >
              Ir a Configuración
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-lg" style={{ backgroundColor: colors.primary + '20' }}>
          <Sparkles size={24} style={{ color: colors.primary }} />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Herramientas de IA
          </h1>
          <p className={`text-gray-600 mt-1 ${isDarkMode ? 'text-slate-400' : ''}`}>
            Potencia tu CRM con inteligencia artificial avanzada
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className={`rounded-lg shadow-sm border p-4 ${
        isDarkMode
          ? 'bg-slate-700 border-slate-600'
          : 'bg-blue-50 border-blue-200'
      }`}>
        <p className={`text-sm ${isDarkMode ? 'text-slate-200' : 'text-blue-900'}`}>
          ✨ Todas las herramientas están alimentadas por GPT-3.5 Turbo de OpenAI. Los resultados se generan en tiempo real.
        </p>
      </div>

      {/* Description Generator */}
      <section>
        <AIDescriptionGenerator />
      </section>

      {/* Translation Tool */}
      <section>
        <AITranslationTool />
      </section>

      {/* Price Suggestion */}
      <section>
        <AIPriceSuggestion />
      </section>

      {/* Auto Reply Generator */}
      <section>
        <AIAutoReplyGenerator />
      </section>

      {/* Tips */}
      <div className={`rounded-lg shadow-sm border p-6 ${
        isDarkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          💡 Tips para Mejores Resultados
        </h3>
        <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
          <li>• Proporciona información detallada del inmueble para mejores descripciones</li>
          <li>• Usa terminología específica del mercado inmobiliario en la zona</li>
          <li>• Incluye todas las amenidades para análisis de precio más precisos</li>
          <li>• Los mensajes de clientes pueden ser preguntas, solicitudes de visita o consultas</li>
          <li>• Las respuestas generadas pueden editarse antes de enviarlas al cliente</li>
          <li>• Usa diferentes idiomas para expandir tu mercado potencial</li>
        </ul>
      </div>
    </div>
  );
}
