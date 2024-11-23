// src/utils/csvReader.ts
import fs from "fs";
import path from "path";
import csv from "csv-parser";

export const readCSV = (filePath: string) => {
  const data: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => data.push(row))
      .on("end", () => resolve(data))
      .on("error", (error) => reject(error));
  });
};
