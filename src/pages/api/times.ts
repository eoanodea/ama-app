import type { NextApiRequest, NextApiResponse } from "next";
import { readCSV } from "../../utils/csvReader";
import path from "path";
import { StopTime } from "../../types/StopTime";
import { Trip } from "@/types/trip";

import moment from "moment";

const timesFilePath = path.resolve("data/stop_times.txt");
const tripsFilePath = path.resolve("data/trips.txt");

const times = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const times = (await readCSV(timesFilePath)) as StopTime[];
    const trips = (await readCSV(tripsFilePath)) as Trip[];
    const { stop_id, limit } = req.query;
    const now = moment()
      .startOf("week")
      .add(1, "days")
      .hour(9)
      .minute(0)
      .second(0);

    const filteredTimes = times
      .filter((time: StopTime) => time.stop_id === stop_id)
      .map((time: StopTime) => ({
        ...time,
        arrival_time: moment(time.arrival_time, "HH:mm:ss").toISOString(),
      }))
      .filter((time: StopTime) => moment(time.arrival_time).isAfter(now))
      .sort((a: StopTime, b: StopTime) =>
        moment(a.arrival_time).diff(moment(b.arrival_time))
      );

    const limitedTimes = limit
      ? filteredTimes.slice(0, Number(limit))
      : filteredTimes;

    const upcomingBusesWithTrips = limitedTimes.map((time) => {
      const trip = trips.find((trip) => trip.trip_id === time.trip_id);
      return {
        ...time,
        trip,
      };
    });

    res.status(200).json(upcomingBusesWithTrips);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to load stop times data", message: error });
  }
};

export default times;
