import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
import {
  Bed,
  Bath,
  Ruler,
  MapPin,
  Euro,
  Pencil,
  Home,
  Building2,
  Store,
  Landmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// Configurar iconos por defecto
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Iconos de colores por estado
const crearIcono = (color, shadowUrl = markerShadow) => {
  return new L.Icon({
    iconUrl: color,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

// Componente para auto zoom
function AutoZoom({ inmuebles }) {
  const map = useMap();

  useEffect(() => {
    if (!inmuebles || inmuebles.length === 0) return;

    // Filtrar inmuebles con coordenadas válidas
    const validInmuebles = inmuebles.filter(
      (i) => i.latitud && i.longitud && !isNaN(i.latitud) && !isNaN(i.longitud)
    );

    if (validInmuebles.length === 0) return;

    const bounds = validInmuebles.map((inmueble) => [
      parseFloat(inmueble.latitud),
      parseFloat(inmueble.longitud),
    ]);

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15,
    });
  }, [inmuebles, map]);

  return null;
}

export default function DashboardMap({ inmuebles = [] }) {
  const navigate = useNavigate();
  const { isDarkMode, colors } = useTheme();
  const [selectedInmueble, setSelectedInmueble] = useState(null);

  // Validar inmuebles con coordenadas
  const inmuebleValidos = inmuebles.filter(
    (i) => i.latitud && i.longitud && !isNaN(i.latitud) && !isNaN(i.longitud)
  );

  // Centro del mapa (Madrid por defecto)
  const centro =
    inmuebleValidos.length > 0
      ? [
          parseFloat(inmuebleValidos[0].latitud),
          parseFloat(inmuebleValidos[0].longitud),
        ]
      : [40.4168, -3.7038];

  // Obtener icono según estado
  const obtenerIconoEstado = (estado) => {
    // Simular iconos de colores (usar URLs reales si existen)
    const iconBase = '/markers/marker-icon-';
    
    switch (estado) {
      case 'disponible':
        // Verde
        return new L.Icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSA0MSI+PHBhdGggZmlsbD0iIzIyYzU1ZSIgZD0iTTEyLjUgMEMxOC4wMjMgMCAyMi41IDQuNDc3IDIyLjUgMTBjMCAzLjI1LTIuMDQ3IDYuMDMtNS4xMDMgNy40MkMxNS4zMyAyMS4wOSAxMi41IDI1LjI1IDEyLjUgMzFjMCA1Ljc5OCA2IDkuOTkgNiA5Ljk5cy02IDQuMTkyLTYgMTBjMCAuNDk3LjAxMyAxIDAgMWgxYzAgMi43NTctMi4yNDMgNS01IDVzLTUtMi4yNDMtNS01YzAtLjAxNi4wMDYtLjAzMSAwLS4wNDhjLS43MzQtNi4wMTQtNi0xMS40MDQtNi0xNS4yMzZDMCAyNC4yNzMgNS40NzcgMTkuNzQyIDEwLjAwOCAxNy40OTMgNy4xNzYgMTYuMDA2IDUgMTMuMzI2IDUgMTBjMC01LjUyMyA0LjQ3Ny0xMCAxMC00eiIvPjwvc3ZnPg==',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      case 'vendido':
        // Rojo
        return new L.Icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSA0MSI+PHBhdGggZmlsbD0iI2VmNDQ0NCIgZD0iTTEyLjUgMEMxOC4wMjMgMCAyMi41IDQuNDc3IDIyLjUgMTBjMCAzLjI1LTIuMDQ3IDYuMDMtNS4xMDMgNy40MkMxNS4zMyAyMS4wOSAxMi41IDI1LjI1IDEyLjUgMzFjMCA1Ljc5OCA2IDkuOTkgNiA5Ljk5cy02IDQuMTkyLTYgMTBjMCAuNDk3LjAxMyAxIDAgMWgxYzAgMi43NTctMi4yNDMgNS01IDVzLTUtMi4yNDMtNS01YzAtLjAxNi4wMDYtLjAzMSAwLS4wNDhjLS43MzQtNi4wMTQtNi0xMS40MDQtNi0xNS4yMzZDMCAyNC4yNzMgNS40NzcgMTkuNzQyIDEwLjAwOCAxNy40OTMgNy4xNzYgMTYuMDA2IDUgMTMuMzI2IDUgMTBjMC01LjUyMyA0LjQ3Ny0xMCAxMC00eiIvPjwvc3ZnPg==',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      case 'alquilado':
        // Amarillo
        return new L.Icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNSA0MSI+PHBhdGggZmlsbD0iI2VhYjMwOCIgZD0iTTEyLjUgMEMxOC4wMjMgMCAyMi41IDQuNDc3IDIyLjUgMTBjMCAzLjI1LTIuMDQ3IDYuMDMtNS4xMDMgNy40MkMxNS4zMyAyMS4wOSAxMi41IDI1LjI1IDEyLjUgMzFjMCA1Ljc5OCA2IDkuOTkgNiA5Ljk5cy02IDQuMTkyLTYgMTBjMCAuNDk3LjAxMyAxIDAgMWgxYzAgMi43NTctMi4yNDMgNS01IDVzLTUtMi4yNDMtNS01YzAtLjAxNi4wMDYtLjAzMSAwLS4wNDhjLS43MzQtNi4wMTQtNi0xMS40MDQtNi0xNS4yMzZDMCAyNC4yNzMgNS40NzcgMTkuNzQyIDEwLjAwOCAxNy40OTMgNy4xNzYgMTYuMDA2IDUgMTMuMzI2IDUgMTBjMC01LjUyMyA0LjQ3Ny0xMCAxMC00eiIvPjwvc3ZnPg==',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
      default:
        return new L.Icon({
          iconUrl: markerIcon,
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
    }
  };

  // Obtener icono del tipo de inmueble
  const obtenerIconoTipo = (tipo) => {
    switch (tipo) {
      case 'casa':
        return <Home size={16} className="text-blue-600" />;
      case 'apartamento':
        return <Building2 size={16} className="text-indigo-600" />;
      case 'local':
        return <Store size={16} className="text-orange-600" />;
      case 'oficina':
        return <Landmark size={16} className="text-purple-600" />;
      default:
        return <Building2 size={16} className="text-gray-500" />;
    }
  };

  // Editar inmueble
  const editarInmueble = (id) => {
    navigate('/inmuebles', {
      state: { editarId: id }
    });
  };

  return (
    <div className={`rounded-xl shadow-sm p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          📍 Mapa de Inmuebles
        </h2>
        <span className={`text-sm px-3 py-1 rounded-full ${
          isDarkMode
            ? 'bg-slate-700 text-slate-300'
            : 'bg-gray-200 text-gray-700'
        }`}>
          {inmuebleValidos.length} inmuebles
        </span>
      </div>

      {inmuebleValidos.length === 0 ? (
        <div className={`flex flex-col items-center justify-center h-96 rounded-lg ${
          isDarkMode ? 'bg-slate-700' : 'bg-gray-100'
        }`}>
          <MapPin size={48} className="opacity-50 mb-2" />
          <p className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>
            No hay inmuebles con ubicación disponible
          </p>
        </div>
      ) : (
        <MapContainer
          center={centro}
          zoom={12}
          style={{
            height: '500px',
            width: '100%',
            borderRadius: '12px',
            zIndex: 1,
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AutoZoom inmuebles={inmuebleValidos} />

           <MarkerClusterGroup
               iconCreateFunction={(cluster) =>
                  L.divIcon({
                    html: `
                      <div
                        style="
                          width:44px;
                          height:44px;
                          border-radius:9999px;
                          background:
                            linear-gradient(135deg,#ff2d96 0%, #c026d3 45%, #7c3aed 100%);
                          display:flex;
                          align-items:center;
                          justify-content:center;
                          color:white;
                          font-weight:700;
                          font-size:18px;
                          border:4px solid white;
                          box-shadow:
                            0 3px 10px rgba(0,0,0,.30),
                            0 0 0 4px rgba(255,255,255,.45);
                        "
                      >
                        ${cluster.getChildCount()}
                      </div>
                    `,
                    className: "",
                    iconSize: [44, 44],
                  })
                }
            >
            {inmuebleValidos.map((inmueble) => (
              <Marker
                key={inmueble.id}
                position={[
                  parseFloat(inmueble.latitud),
                  parseFloat(inmueble.longitud),
                ]}
                icon={obtenerIconoEstado(inmueble.estado)}
                eventHandlers={{
                  click: () => setSelectedInmueble(inmueble.id),
                }}
              >
                 <Popup minWidth={280} maxWidth={340}>
                
                                  <div className="w-72">
                                    <div
                                      className={`h-2 rounded-t-xl ${
                                        inmueble.estado === "disponible"
                                          ? "bg-green-500"
                                          : inmueble.estado === "vendido"
                                          ? "bg-red-500"
                                          : "bg-yellow-500"
                                      }`}
                                    />
                                    <img
                                      src={inmueble.imagenes_urls?.[0]}
                                      alt={inmueble.titulo}
                                      className="w-full h-44 object-cover rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                                    />
                
                                    <h3 className="font-bold text-lg mb-2">
                                      {inmueble.titulo}
                                    </h3>
                                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                                      {obtenerIconoTipo(inmueble.tipo)}
                                      <span className="capitalize font-medium">
                                        {inmueble.tipo}
                                      </span>
                                    </div>
                                  <div className="mb-3">
                                    <span
                                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                        inmueble.estado === "disponible"
                                          ? "bg-green-100 text-green-700"
                                          : inmueble.estado === "vendido"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-yellow-100 text-yellow-700"
                                      }`}
                                    >
                                      {inmueble.estado.charAt(0).toUpperCase() + inmueble.estado.slice(1)}
                                    </span>
                                  </div>
                                   
                                    <div className="space-y-2 text-sm">
                
                                    <div className="flex items-center gap-2 mt-3">
                                        <Euro className="text-green-500" size={22} />
                                          <span className="text-3xl font-extrabold tracking-tight text-gray-900">
                                          {inmueble.precio.toLocaleString("es-ES")} €
                                        </span>
                                        <div className="border-b border-gray-100 my-3"></div>
                                      </div>
                                      </div>
                
                                      <div className="flex items-center gap-2">
                                      <span className="text-gray-600">
                                        {inmueble.ubicacion}</span>
                                      </div>
                
                                      <div className="flex items-center justify-between mt-3">
                
                                        <div className="flex items-center gap-1">
                                      <div className="flex items-center justify-center gap-2">
                                      <Bed size={18} />
                                      <span>{inmueble.dormitorios ?? 0}</span>
                                    </div>
                                        </div>
                
                                        <div className="flex items-center gap-1">
                                       
                                        <div className="flex items-center justify-center gap-2">
                                          <Bath size={18} />
                                          <span>{inmueble.banos ?? 0}</span>
                                        </div>
                                        </div>
                
                                        <div className="flex items-center gap-1">
                                         <div className="flex items-center justify-center gap-2">
                                                <Ruler size={18} />
                                                <span>{inmueble.area ?? 0} m²</span>
                                              </div>
                                        </div>
                
                                      </div>
                                      <button
                                        onClick={() => editarInmueble(inmueble.id)}
                                        className="
                                          mt-5
                                          w-full
                                          flex
                                          items-center
                                          justify-center
                                          gap-2
                                          rounded-lg
                                          bg-pink-600
                                          text-white
                                          py-2.5
                                          font-medium
                                          hover:bg-pink-700
                                          transition-all
                                          duration-200
                                          hover:scale-[1.02]
                                          active:scale-95
                                          duration-200
                                        "
                                      >
                
                                        <Pencil size={18} />
                
                                        Editar inmueble
                
                                      </button>
                                    </div>
                                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      )}

      {/* Leyenda */}
      <div className={`mt-4 grid grid-cols-3 gap-4 pt-4 border-t ${
        isDarkMode ? 'border-slate-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>Disponible</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>Vendido</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>Alquilado</span>
        </div>
      </div>
    </div>
  );
}
