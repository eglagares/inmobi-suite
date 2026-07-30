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

  const centro =
    inmuebles.length > 0
      ? [inmuebles[0].latitud, inmuebles[0].longitud]
      : [40.4168, -3.7038];

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

            <Marker
                key={inmueble.id}
                position={[inmueble.latitud, inmueble.longitud]}
                icon={
                  inmueble.estado === "disponible"
                    ? iconoDisponible
                    : inmueble.estado === "vendido"
                    ? iconoVendido
                    : iconoAlquilado
                }
              >

                <Popup>

                  <strong>{inmueble.titulo}</strong>

                  <br />

                  {Number(inmueble.precio).toLocaleString("es-ES")} €

                  <br />

                  {inmueble.ubicacion}

                  <br />

                  Estado: {inmueble.estado}

                </Popup>

              </Marker>

            ))}
        </MarkerClusterGroup>
      </MapContainer>

    </div>
  );
}