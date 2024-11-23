// src/pages/index.tsx
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Stop } from "../types/Stop";
import moment from "moment";

// Dynamically import the Map component with no SSR
const Map = dynamic(() => import("../components/Map"), { ssr: false });

const TripsPage = () => {
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

  return (
    <div>
      <h1>Map</h1>
      <Map shapes={shapes} stops={stops} onStopSelect={handleStopSelect} />
      <h2>Upcoming Trips</h2>
      <ul>
        {selectedStopTimes.map((time: any) => (
          <li key={time.trip_id}>
            Trip ID: {time.trip_id}, Arrival Time: {time.formattedArrivalTime}{" "}
            {time.isSameDay ? "" : "(Next Day)"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripsPage;
