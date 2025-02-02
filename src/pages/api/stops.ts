import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const stopsFilePath = path.resolve("data/stops.txt");

const getStops = async () => {
  const stops: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(stopsFilePath)
      .pipe(csv())
      .on("data", (data) => stops.push(data))
      .on("end", () => resolve(stops))
      .on("error", (error) => reject(error));
  });
};

const stops = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const stops = await getStops();
    res.status(200).json(stops);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to load stops data", message: error });
  }
};

export default stops;
