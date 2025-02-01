// src/pages/index.tsx
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Stop } from "../types/Stop";
import moment from "moment";
import { Container, Typography, List, ListItem } from "@mui/material";

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import("../components/Map"), { ssr: false });

const TripsPage = ({
  toggleTheme,
  mode,
}: {
  toggleTheme: () => void;
  mode: "light" | "dark";
}) => {
  const router = useRouter();
  const [shapes, setShapes] = useState([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [selectedStopTimes, setSelectedStopTimes] = useState([]);

  useEffect(() => {
    const fetchStops = async () => {
      const response = await fetch("/api/stops");
      const data = await response.json();
      setStops(data);
    };

    fetchStops();
  }, []);

  const handleStopSelect = (stopId: string) => {
    router.push(`/stop/${stopId}`);
  };

  return (
    <Container>
      <Typography variant="h1">Map</Typography>
      <Map shapes={shapes} stops={stops} onStopSelect={handleStopSelect} />
      <Typography variant="h2">Upcoming Trips</Typography>
      <List>
        {selectedStopTimes.map((time: any) => (
          <ListItem key={time.trip_id}>
            <Typography>
              Trip ID: {time.trip_id}, Arrival Time: {time.formattedArrivalTime}{" "}
              {time.isSameDay ? "" : "(Next Day)"}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TripsPage;
