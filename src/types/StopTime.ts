import { Trip } from "./trip";

// src/types/StopTime.ts
export interface StopTime {
  trip_id: string;
  arrival_time: string;
  departure_time: string;
  stop_id: string;
  stop_sequence: number;
  trip: Trip;
  isSameDay?: boolean;
  formattedArrivalTime?: string;
}
