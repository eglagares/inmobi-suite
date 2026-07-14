import { useEffect, useState } from 'react';
import { inmuebleService } from '../services/supabaseServices';
import { useTheme } from '../context/ThemeContext';

export default function Inmuebles() {
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    cargarInmuebles();
  }, []);

  const cargarInmuebles = async () => {
    setLoading(true);
    const { data } = await inmuebleService.getAll();
    setInmuebles(data || []);
    setLoading(false);
  };

  if (loading) return <div>Cargando inmuebles...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Inmuebles</h1>

      <div className={`rounded-lg shadow p-6 mb-6 ${
        isDarkMode ? 'bg-slate-800' : 'bg-white'
      }`}>
        <p>Total de inmuebles: <strong>{inmuebles.length}</strong></p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inmuebles.map(inmueble => (
          <div 
            key={inmueble.id}
            className={`rounded-lg shadow p-4 ${
              isDarkMode ? 'bg-slate-800' : 'bg-white'
            }`}
          >
  <img
    src={inmueble.imagenes_urls?.[0]}
    alt={inmueble.titulo}
    className="w-full h-48 object-cover"
  />
            <h3 className="font-bold text-lg">{inmueble.titulo}</h3>
            <p className="text-sm">Tipo: {inmueble.tipo}</p>
            <p className="text-sm">Precio: ${inmueble.precio}</p>
            <p className="text-sm">Ubicación: {inmueble.ubicacion}</p>
            <p className="text-sm">Estado: {inmueble.estado}</p>
          </div>
        ))}
      </div>

      {inmuebles.length === 0 && (
        <div className="text-center p-8">
          <p>No hay inmuebles registrados</p>
        </div>
      )}
    </div>
  );
}