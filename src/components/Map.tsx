import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
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
  stops: Stop[];
  onStopSelect: (stopId: string) => void;
  center?: [number, number, number]; // Add center prop
  mode: "light" | "dark";
}

const Map = ({
  stops,
  onStopSelect,
  center = [42.354, 13.391, 15],
  mode,
}: MapProps) => {
  const mapboxAccessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapStyle =
    mode === "dark"
      ? "eoan/cm6mr92gz002y01sg4xmwan54"
      : "eoan/cm6mqrgi800k601qr0p8k0qx5";

  return (
    <MapContainer
      center={[center[0], center[1]]}
      zoom={center[2]}
      style={{
        height: "91vh",
        width: "100%",
        zIndex: 0,
        position: "relative",
      }} // Set a fixed height for the map
      zoomControl={false}
    >
      <UpdateMapCenter center={[center[0], center[1]]} />
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/${mapStyle}/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
        attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> contributors'
      />
      <ZoomControl position="bottomright" />
      {/* mapbox://styles/eoan/cm6mqrgi800k601qr0p8k0qx5 */}
      {/* <TileLayer
      
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      /> */}
      <MarkerClusterGroup>
        {stops.map((stop) => (
          <ClickableMarker
            key={stop.stop_id}
            stop={stop}
            onStopSelect={onStopSelect}
          />
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
  }, [center, map]);

  return null;
};

const ClickableMarker = ({
  stop,
  onStopSelect,
}: {
  stop: Stop;
  onStopSelect: (stopId: string) => void;
}) => {
  const map = useMap();
  const handleClick = () => {
    // Call any additional logic
    onStopSelect(stop.stop_id);
    // Zoom in on marker at zoom level 18 (adjust as needed)
    map.setView([stop.stop_lat, stop.stop_lon], 18);
  };

  return (
    <Marker
      key={stop.stop_id}
      position={[stop.stop_lat, stop.stop_lon]}
      icon={customIcon}
      eventHandlers={{ click: handleClick }}
    >
      <Popup>{stop.stop_name}</Popup>
    </Marker>
  );
};
