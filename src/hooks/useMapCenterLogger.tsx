// src/hooks/useMapCenterLogger.tsx
import { useMapEvents } from "react-leaflet";

const useMapCenterLogger = () => {
  useMapEvents({
    moveend: (event: { target: any }) => {
      const map = event.target;
      const center = map.getCenter();
      console.log("Map center:", center);
    },
  });

  return null;
};

export default useMapCenterLogger;
