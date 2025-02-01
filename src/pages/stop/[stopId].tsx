import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Stop } from "../../types/Stop";
import moment from "moment";
import { Container, Typography, List, ListItem, Button } from "@mui/material";
import SaveStopDialog from "../../components/SaveStopDialog";
import { StopTime } from "@/types/StopTime";

const StopPage = () => {
  const router = useRouter();
  const { stopId } = router.query;
  const [stop, setStop] = useState<Stop | null>(null);
  const [upcomingBuses, setUpcomingBuses] = useState<StopTime[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (stopId) {
      const fetchStop = async () => {
        const response = await fetch(`/api/stops`);
        const data = await response.json();
        const selectedStop = data.find((s: Stop) => s.stop_id === stopId);
        setStop(selectedStop);
      };

      const fetchUpcomingBuses = async () => {
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
        // debugger;

        setUpcomingBuses(formattedTimes);
      };

      fetchStop();
      fetchUpcomingBuses();
    }
  }, [stopId]);

  const handleSaveStop = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
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

  if (!stop) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Typography variant="h1">{stop.stop_name}</Typography>
      <Typography variant="h2">Stop Information</Typography>
      <Typography>Stop ID: {stop.stop_id}</Typography>
      <Typography>Stop Name: {stop.stop_name}</Typography>
      <Typography>Latitude: {stop.stop_lat}</Typography>
      <Typography>Longitude: {stop.stop_lon}</Typography>
      <Typography variant="h2">Upcoming Buses</Typography>
      <List>
        {upcomingBuses.map((bus) => (
          <ListItem key={bus.trip_id}>
            <Typography>
              {bus.trip.trip_headsign} Trip ID: {bus.trip_id}, Arrival Time:{" "}
              {bus.formattedArrivalTime} {bus.isSameDay ? "" : "(Next Day)"}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Button onClick={handleSaveStop}>Save Stop</Button>
      <SaveStopDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleDialogSave}
        stop={stop}
      />
    </Container>
  );
};

export default StopPage;
