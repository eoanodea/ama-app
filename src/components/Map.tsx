// src/components/Map.tsx
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "react-leaflet-markercluster/dist/styles.min.css";
import { Shape } from "../types/Shape";
import { Stop } from "../types/Stop";
import L from "leaflet";

// Import the default icon images
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Set the default icon options
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  shapes: Shape[];
  stops: Stop[];
  onStopSelect: (stopId: string) => void;
}

const Map = ({ shapes, stops, onStopSelect }: MapProps) => {
  const positions = shapes.map((shape) => [
    shape.shape_pt_lat,
    shape.shape_pt_lon,
  ]);

  const defaultCenter: [number, number] = [
    42.350734353567674, 13.403534889221193,
  ];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline positions={positions} color="blue" />
      <MarkerClusterGroup>
        {stops.map((stop) => (
          <Marker
            key={stop.stop_id}
            position={[stop.stop_lat, stop.stop_lon]}
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
