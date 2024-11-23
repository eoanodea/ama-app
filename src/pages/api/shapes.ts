// src/pages/api/shapes.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { readCSV } from "../../utils/csvReader";
import path from "path";
import { Shape } from "../../types/Shape";

const shapesFilePath = path.resolve("data/shapes.txt");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const shapes = (await readCSV(shapesFilePath)) as Shape[];
    const { shape_id } = req.query;

    const filteredShapes = shapes.filter(
      (shape: Shape) => shape.shape_id === shape_id
    );

    res.status(200).json(filteredShapes);
  } catch (error) {
    res.status(500).json({ error: "Failed to load shapes data" });
  }
};
