import { Trip } from "@/types/trip";
import { useState, useEffect } from "react";

interface Route {
  route_id: string;
  route_short_name: string;
  route_long_name: string;
}

interface Service {
  service_id: string;
}

const TripSearch = ({
  onSearch,
}: {
  onSearch: (route_id: string, service_id: string) => void;
}) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [routeId, setRouteId] = useState("");
  const [serviceId, setServiceId] = useState("");

  useEffect(() => {
    const fetchRoutes = async () => {
      const response = await fetch("/api/routes");
      const data = await response.json();
      setRoutes(data);
    };

    const fetchServices = async () => {
      const response = await fetch("/api/trips");
      const data: Trip[] = await response.json();
      const uniqueServices = Array.from(
        new Set(data.map((trip) => trip.service_id))
      );
      setServices(uniqueServices.map((id: string) => ({ service_id: id })));
    };

    fetchRoutes();
    fetchServices();
  }, []);

  const handleSearch = () => {
    onSearch(routeId, serviceId);
  };

  return (
    <div>
      <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
        <option value="">Select Route</option>
        {routes.map((route) => (
          <option key={route.route_id} value={route.route_id}>
            {route.route_short_name} - {route.route_long_name}
          </option>
        ))}
      </select>
      <select value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
        <option value="">Select Service ID</option>
        {services.map((service) => (
          <option key={service.service_id} value={service.service_id}>
            {service.service_id}
          </option>
        ))}
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default TripSearch;
