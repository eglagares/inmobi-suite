import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LogoBrand from '../components/LogoBrand';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('agente');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDarkMode, toggleDarkMode, branding, colors } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor ingresa un email válido');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      if (login(email, password, role)) {
        navigate('/');
      } else {
        setError('Error al iniciar sesión');
      }
      setLoading(false);
    }, 500);
  };

  const handleQuickLogin = (testEmail, testRole) => {
    setEmail(testEmail);
    setPassword('123456');
    setRole(testRole);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-pink-600 via-pink-500 to-rose-500'
    }`}>
      <div className="w-full max-w-md">
        {/* Card */}
        <div className={`rounded-lg shadow-2xl p-8 transition-colors duration-300 ${
          isDarkMode
            ? 'bg-slate-800'
            : 'bg-white'
        }`}>
          {/* Dark mode toggle - esquina superior derecha */}
          <div className="flex justify-between items-start mb-8">
            <div></div>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600'
                  : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
              }`}
              title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-10">
            <LogoBrand size="5xl" showText={false} />
          </div>

          {/* Title */}
          <h1 className={`text-4xl font-bold text-center mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {branding.appName}
          </h1>
          <p className={`text-center mb-8 text-sm ${
            isDarkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>
            {branding.tagline}
          </p>

          {/* Error Message */}
          {error && (
            <div className={`mb-6 p-4 rounded-lg flex gap-3 ${
              isDarkMode
                ? 'bg-red-900 bg-opacity-30 border border-red-700'
                : 'bg-red-50 border border-red-200'
            }`}>
              <AlertCircle className={isDarkMode ? 'text-red-400' : 'text-red-600'} size={20} />
              <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-pink-500'
                    : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-pink-500'
                }`}
              />
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:ring-pink-500'
                    : 'border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-pink-500'
                }`}
              />
            </div>

            {/* Role Selector */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                  isDarkMode
                    ? 'bg-slate-700 border border-slate-600 text-white focus:ring-pink-500'
                    : 'border border-gray-300 bg-white text-gray-900 focus:ring-pink-500'
                }`}
              >
                <option value="admin">Administrador</option>
                <option value="agente">Agente Inmobiliario</option>
                <option value="usuario">Usuario</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-2 px-4 rounded-lg transition-colors mt-6 text-white disabled:opacity-50 ${
                isDarkMode
                  ? 'bg-pink-600 hover:bg-pink-500'
                  : 'bg-pink-600 hover:bg-pink-700'
              }`}
              style={{
                background: isDarkMode 
                  ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`
                  : `linear-gradient(135deg, ${colors.primary}, #FF1493)`
              }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className={`border-t pt-6 ${
            isDarkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <p className={`text-xs text-center mb-4 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Cuentas de demostración:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleQuickLogin('admin@inmobiliaria.com', 'admin')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors border ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <div className="font-medium">Admin</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  admin@inmobiliaria.com
                </div>
              </button>
              <button
                onClick={() => handleQuickLogin('agente@inmobiliaria.com', 'agente')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors border ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <div className="font-medium">Agente</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  agente@inmobiliaria.com
                </div>
              </button>
              <button
                onClick={() => handleQuickLogin('usuario@inmobiliaria.com', 'usuario')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors border ${
                  isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
              >
                <div className="font-medium">Usuario</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                  usuario@inmobiliaria.com
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className={`text-center text-sm mt-8 ${
          isDarkMode ? 'text-slate-400' : 'text-white'
        }`}>
          © 2026 {branding.appName}. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
