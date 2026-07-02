import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('agente');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validación simple
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

    // Simular llamada al servidor
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Building2 size={32} className="text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            InMobi Suite
          </h1>
          <p className="text-gray-600 text-center mb-8">
            CRM Inmobiliario Profesional
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="border-t border-gray-200 pt-6">
            <p className="text-xs text-gray-600 text-center mb-4">
              Cuentas de demostración:
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handleQuickLogin('admin@inmobiliaria.com', 'admin')}
                className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-lg transition-colors border border-gray-200"
              >
                <div className="font-medium">Admin</div>
                <div className="text-xs text-gray-500">admin@inmobiliaria.com</div>
              </button>
              <button
                onClick={() => handleQuickLogin('agente@inmobiliaria.com', 'agente')}
                className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-lg transition-colors border border-gray-200"
              >
                <div className="font-medium">Agente</div>
                <div className="text-xs text-gray-500">agente@inmobiliaria.com</div>
              </button>
              <button
                onClick={() => handleQuickLogin('usuario@inmobiliaria.com', 'usuario')}
                className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-lg transition-colors border border-gray-200"
              >
                <div className="font-medium">Usuario</div>
                <div className="text-xs text-gray-500">usuario@inmobiliaria.com</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-white text-center text-sm mt-8">
          © 2024 InMobi Suite. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
