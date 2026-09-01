import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import greenMarker from '../assets/markers/marker-icon-green.png';
import redMarker from '../assets/markers/marker-icon-red.png';
import yellowMarker from '../assets/markers/marker-icon-yellow.png';

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

//para navegar desde el mapa
import { useNavigate } from 'react-router-dom';



const abrirInmueble = (id) => {
  navigate('/inmuebles', {
    state: {
      editarId: id,
    },
  });

};
const iconoDisponible = new L.Icon({
  iconUrl: greenMarker,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconoVendido = new L.Icon({
  iconUrl: redMarker,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconoAlquilado = new L.Icon({
  iconUrl: yellowMarker,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});





delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function AutoZoom({ inmuebles }) {

  const map = useMap();

  React.useEffect(() => {

    if (inmuebles.length === 0) return;

    const bounds = inmuebles.map(inmueble => [
      inmueble.latitud,
      inmueble.longitud,
    ]);

    map.fitBounds(bounds, {
      padding: [50, 50],
    });

  }, [inmuebles, map]);

  return null;
}

export default function DashboardMap({ inmuebles = [] }) {

  const navigate = useNavigate();
  const editarInmueble = (id) => {

  navigate("/inmuebles", {
    state: {
      editarId: id,
    },
  });

};
  const centro =
    inmuebles.length > 0
      ? [inmuebles[0].latitud, inmuebles[0].longitud]
      : [40.4168, -3.7038];

  const abrirInmueble = (id) => {
      navigate('/inmuebles', {
        state: {
          editarId: id,
        },
      });
    };

 const obtenerIconoTipo = (tipo) => {
    switch (tipo) {

      case "casa":
        return <Home size={16} className="text-blue-600" />;

      case "apartamento":
        return <Building2 size={16} className="text-indigo-600" />;

      case "local":
        return <Store size={16} className="text-orange-600" />;

      case "oficina":
        return <Landmark size={16} className="text-purple-600" />;

      default:
        return <Building2 size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      <h2 className="text-2xl font-bold mb-4">
        Mapa de Inmuebles
      </h2>
     
      <MapContainer
        center={centro}
        zoom={12}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "12px",
        }}
      >
       
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
         <AutoZoom inmuebles={inmuebles} />

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

      {inmuebles.map((inmueble) => (
          console.log(inmueble),
          <Marker
                key={inmueble.id}
                position={[inmueble.latitud, inmueble.longitud]}
                icon={
                  inmueble.estado === 'disponible'
                    ? iconoDisponible
                    : inmueble.estado === 'vendido'
                    ? iconoVendido
                    : iconoAlquilado
                }
                
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

    </div>
  );
}