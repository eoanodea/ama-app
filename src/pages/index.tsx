import { useState, useEffect, useContext } from "react";
import dynamic from "next/dynamic";
import { Stop } from "../types/Stop";
import moment from "moment";
import {
  Typography,
  List,
  ListItem,
  SwipeableDrawer,
  Box,
  IconButton,
} from "@mui/material";
import styled from "@emotion/styled";
import Search from "@/components/Search";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { AppContext } from "@/providers/AppProvider";
const Map = dynamic(() => import("../components/Map"), { ssr: false });

const StyledHomePageContainer = styled.div`
  position: relative;
`;

const TripsPage = () => {
  const [stops, setStops] = useState<Stop[]>([]);
  const [selectedStopTimes, setSelectedStopTimes] = useState([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number, number]>([
    42.354, 13.391, 15,
  ]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { mode, isFavorite, addFavorite, removeFavorite } =
    useContext(AppContext);

  useEffect(() => {
    const fetchStops = async () => {
      const response = await fetch("/api/stops");
      const data = await response.json();
      setStops(data);
    };

    fetchStops();
  }, []);

  const handleStopSelect = async (stopId: string) => {
    const stop = stops.find((s) => s.stop_id === stopId);
    setSelectedStop(stop || null);

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
    setDrawerOpen(true);
  };

  const handleFavoriteToggle = () => {
    if (selectedStop) {
      if (isFavorite(selectedStop.stop_id)) {
        removeFavorite(selectedStop.stop_id);
      } else {
        // Here we're using the stop's name and a default icon value.
        addFavorite(selectedStop, selectedStop.stop_name, "Home");
      }
    }
  };

  return (
    <StyledHomePageContainer>
      <Search setMapCenter={setMapCenter} />

      <Map
        stops={stops}
        onStopSelect={handleStopSelect}
        center={mapCenter}
        mode={mode}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => {}}
      >
        <Box sx={{ p: 2, height: "40vh", overflowY: "auto" }}>
          {selectedStop && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6">{selectedStop.stop_name}</Typography>
                <IconButton onClick={handleFavoriteToggle}>
                  {isFavorite(selectedStop.stop_id) ? (
                    <Favorite color="error" />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
              </Box>
              <Typography variant="body2" gutterBottom>
                Stop ID: {selectedStop.stop_id}
              </Typography>
              <Typography variant="subtitle1">Upcoming Bus Times:</Typography>
              <List>
                {selectedStopTimes.map((time: any) => (
                  <ListItem key={time.trip_id}>
                    <Typography variant="body2">
                      Trip: {time.trip_id}, Arrival: {time.formattedArrivalTime}{" "}
                      {time.isSameDay ? "" : "(Next Day)"}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </SwipeableDrawer>
    </StyledHomePageContainer>
  );
};

export default TripsPage;
