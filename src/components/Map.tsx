// src/components/Map.tsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { Stop } from "../types/Stop";
import "leaflet/dist/leaflet.css";

// Define custom icons
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

interface MapProps {
  shapes: any[];
  stops: Stop[];
  onStopSelect: (stopId: string) => void;
  center?: [number, number]; // Add center prop
}

const Map = ({
  shapes,
  stops,
  onStopSelect,
  center = [42.354, 13.391],
}: MapProps) => {
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "500px", width: "100%" }} // Set a fixed height for the map
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup>
        {stops.map((stop) => (
          <Marker
            key={stop.stop_id}
            position={[stop.stop_lat, stop.stop_lon]}
            icon={customIcon}
            eventHandlers={{
              click: () => {
                onStopSelect(stop.stop_id);
              },
            }}
          >
            <Popup>{stop.stop_name}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Map;
