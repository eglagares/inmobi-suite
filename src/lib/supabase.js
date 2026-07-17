import { createClient } from '@supabase/supabase-js';

// Obtener credenciales del archivo .env
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las credenciales existen
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Credenciales de Supabase no configuradas');
  console.warn('Asegúrate de tener .env.local con:');
  console.warn('VITE_SUPABASE_URL=...');
  console.warn('VITE_SUPABASE_ANON_KEY=...');
}

// Crear cliente de Supabase
export const supabase = createClient(
  SUPABASE_URL || '',
  SUPABASE_ANON_KEY || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

// Exportar para uso en la app
export default supabase;


console.log("SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("SUPABASE_KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY ? "OK" : "NO");
console.log("ENV:", import.meta.env);
