// src/pages/api/trips.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { readCSV } from "../../utils/csvReader";
import path from "path";
import { Trip } from "@/types/trip";

const tripsFilePath = path.resolve("data/trips.txt");

const trips = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const trips = (await readCSV(tripsFilePath)) as Trip[];
    const { route_id, service_id } = req.query;

    const filteredTrips = trips.filter((trip) => {
      return (
        (!route_id || trip.route_id === route_id) &&
        (!service_id || trip.service_id === service_id)
      );
    });

    res.status(200).json(filteredTrips);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to load trips data", message: error });
  }
};

export default trips;
