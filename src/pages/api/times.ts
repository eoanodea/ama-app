// src/pages/api/times.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { readCSV } from "../../utils/csvReader";
import path from "path";
import { StopTime } from "../../types/StopTime";
import moment from "moment";

const timesFilePath = path.resolve("data/stop_times.txt");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const times = (await readCSV(timesFilePath)) as StopTime[];
    const { stop_id, limit } = req.query;
    const now = moment();

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

    res.status(200).json(limitedTimes);
  } catch (error) {
    res.status(500).json({ error: "Failed to load stop times data" });
  }
};
