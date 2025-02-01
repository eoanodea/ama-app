// src/components/Map.tsx
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { Stop } from "../types/Stop";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

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
  mode: "light" | "dark";
}

const Map = ({
  shapes,
  stops,
  onStopSelect,
  center = [42.354, 13.391],
  mode,
}: MapProps) => {
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapStyle =
    mode === "dark"
      ? "eoan/cm6mr92gz002y01sg4xmwan54"
      : "eoan/cm6mqrgi800k601qr0p8k0qx5";
  // mapbox://styles/eoan/cm6mr92gz002y01sg4xmwan54
  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{
        height: "100vh",
        width: "100%",
        zIndex: 0,
        position: "relative",
      }} // Set a fixed height for the map
    >
      <UpdateMapCenter center={center} />
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/${mapStyle}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
        attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
      />
      {/* mapbox://styles/eoan/cm6mqrgi800k601qr0p8k0qx5 */}
      {/* <TileLayer
      
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      /> */}
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

const UpdateMapCenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center]);

  return null;
};
