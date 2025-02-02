import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Stop } from "../types/Stop";
import moment from "moment";
import { Typography, List, ListItem } from "@mui/material";
import styled from "@emotion/styled";
import Search from "@/components/Search";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

const StyledHomePageContainer = styled.div`
  position: relative;
`;

const TripsPage = ({ mode }: { mode: "light" | "dark" }) => {
  const [stops, setStops] = useState<Stop[]>([]);
  const [selectedStopTimes, setSelectedStopTimes] = useState([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    42.354, 13.391,
  ]);

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
      {selectedStop && (
        <>
          <Typography variant="h2">
            Upcoming Buses for {selectedStop.stop_name}
          </Typography>
          <List>
            {selectedStopTimes.map((time: any) => (
              <ListItem key={time.trip_id}>
                <Typography>
                  Trip ID: {time.trip_id}, Arrival Time:{" "}
                  {time.formattedArrivalTime}{" "}
                  {time.isSameDay ? "" : "(Next Day)"}
                </Typography>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </StyledHomePageContainer>
  );
};

export default TripsPage;
