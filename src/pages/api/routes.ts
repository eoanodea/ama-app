// src/pages/api/routes.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { readCSV } from "../../utils/csvReader";
import path from "path";

const routesFilePath = path.resolve("data/routes.txt");

const routes = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const routes = await readCSV(routesFilePath);
    res.status(200).json(routes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to load routes data", message: error });
  }
};

export default routes;
