// src/pages/index.tsx
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Stop } from "../types/Stop";
import moment from "moment";
import { Container, Typography, List, ListItem, Button } from "@mui/material";
import SaveStopDialog from "../components/SaveStopDialog";

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import("../components/Map"), { ssr: false });

const TripsPage = ({
  toggleTheme,
  mode,
}: {
  toggleTheme: () => void;
  mode: "light" | "dark";
}) => {
  const [shapes, setShapes] = useState([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [selectedStopTimes, setSelectedStopTimes] = useState([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchStops = async () => {
      const response = await fetch("/api/stops");
      const data = await response.json();
      setStops(data);
    };

    fetchStops();
  }, []);

  const handleStopSelect = async (stopId: string) => {
    const response = await fetch(`/api/times?stop_id=${stopId}&limit=6`);
    const data = await response.json();
    const formattedTimes = data.map((time: any) => {
      const arrivalTime = moment(time.arrival_time);
      const now = moment();
      const isSameDay = arrivalTime.isSame(now, "day");
      return {
        ...time,
        formattedArrivalTime: arrivalTime.format(
          "dddd, MMMM Do YYYY, h:mm:ss a"
        ),
        isSameDay,
      };
    });
    setSelectedStopTimes(formattedTimes);
  };

  const handleSaveStop = (stop: Stop) => {
    setSelectedStop(stop);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedStop(null);
  };

  const handleDialogSave = (stop: Stop, name: string, icon: string) => {
    const savedStops = JSON.parse(localStorage.getItem("savedStops") || "[]");
    if (
      !savedStops.some((savedStop: Stop) => savedStop.stop_id === stop.stop_id)
    ) {
      savedStops.push({ ...stop, name, icon });
      localStorage.setItem("savedStops", JSON.stringify(savedStops));
    }
    handleDialogClose();
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
            <Button onClick={() => handleSaveStop(time.stop)}>Save Stop</Button>
          </ListItem>
        ))}
      </List>
      <SaveStopDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        stop={selectedStop}
      />
    </Container>
  );
};

export default TripsPage;
