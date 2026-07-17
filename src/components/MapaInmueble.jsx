import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function SeleccionarUbicacion({ onChangePosition }) {

  useMapEvents({
    click(e) {
      onChangePosition(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function MapaInmueble({
  latitud = 40.4168,
  longitud = -3.7038,
  titulo = 'Inmueble',
  onChangePosition
}) {

  return (
    <MapContainer
      center={[latitud, longitud]}
      zoom={15}
      style={{
        height: '220px',
        width: '100%',
        borderRadius: '12px'
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Detecta el clic en el mapa */}
      <SeleccionarUbicacion
        onChangePosition={onChangePosition}
      />

      <Marker position={[latitud, longitud]}>
        <Popup>{titulo}</Popup>
      </Marker>

    </MapContainer>
  );
}